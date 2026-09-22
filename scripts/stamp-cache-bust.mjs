/**
 * Cache-bust static assets for GitHub Pages (Telegram / mobile cache hard).
 *
 * Usage:
 *   node scripts/stamp-cache-bust.mjs [version]
 *
 * Version defaults to GITHUB_SHA or Date.now().
 * Mutates files in place — run only in CI before Pages upload, not as a local commit.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL("..", import.meta.url)));
const version = (process.argv[2] || process.env.GITHUB_SHA || String(Date.now())).slice(0, 12);
const bust = `v=${version}`;

/** @param {string} dir */
function walk(dir) {
  /** @type {string[]} */
  const out = [];
  for (const name of readdirSync(dir)) {
    if (name === ".git" || name === "node_modules") continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

/** @param {string} specifier */
function withBust(specifier) {
  if (!specifier || specifier.startsWith("http://") || specifier.startsWith("https://") || specifier.startsWith("data:")) {
    return specifier;
  }
  const bare = specifier.replace(/[?&]v=[^&#'"]+/g, "").replace(/[?&]$/, "");
  const joinChar = bare.includes("?") ? "&" : "?";
  return `${bare}${joinChar}${bust}`;
}

/** @param {string} source */
function stampJs(source) {
  // Skip JSDoc `import("./x")` inside `{...}`; only real ESM from/import()
  return source
    .replace(
      /(\bfrom\s+)(["'])([^"']+\.js(?:\?[^"']*)?)\2/g,
      (_m, prefix, quote, spec) => `${prefix}${quote}${withBust(spec)}${quote}`
    )
    .replace(
      /(?<!\{)(\bimport\s*\(\s*)(["'])([^"']+\.js(?:\?[^"']*)?)\2(\s*\))/g,
      (_m, prefix, quote, spec, suffix) => `${prefix}${quote}${withBust(spec)}${quote}${suffix}`
    );
}

/** @param {string} source */
function stampCss(source) {
  return source.replace(
    /url\(\s*(['"]?)([^)'"]+)\1\s*\)/g,
    (_m, quote, spec) => {
      const trimmed = spec.trim();
      if (trimmed.startsWith("data:") || trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        return `url(${quote}${trimmed}${quote})`;
      }
      // Only bust relative stylesheet / font / asset refs that look like files
      if (!/\.(css|woff2?|ttf|otf|png|jpe?g|webp|svg)([?#]|$)/i.test(trimmed)) {
        return `url(${quote}${trimmed}${quote})`;
      }
      return `url(${quote}${withBust(trimmed)}${quote})`;
    }
  );
}

/** @param {string} source */
function stampHtml(source) {
  let next = source.replace(
    /(\b(?:href|src)=)(["'])([^"']+)\2/g,
    (_m, attr, quote, spec) => {
      if (spec.startsWith("http://") || spec.startsWith("https://") || spec.startsWith("data:") || spec.startsWith("#")) {
        return `${attr}${quote}${spec}${quote}`;
      }
      if (!/\.(css|js)([?#]|$)/i.test(spec)) {
        return `${attr}${quote}${spec}${quote}`;
      }
      return `${attr}${quote}${withBust(spec)}${quote}`;
    }
  );

  if (!/http-equiv=["']Cache-Control["']/i.test(next)) {
    next = next.replace(
      /<meta charset="UTF-8"\s*\/>/,
      `<meta charset="UTF-8" />\n    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />\n    <meta http-equiv="Pragma" content="no-cache" />`
    );
  }

  return next;
}

const htmlPath = join(root, "index.html");
writeFileSync(htmlPath, stampHtml(readFileSync(htmlPath, "utf8")), "utf8");

for (const file of walk(root)) {
  const ext = extname(file).toLowerCase();
  if (ext === ".js" && (file.includes(`${join(root, "js")}`) || file.includes(`${join(root, "vendor", "ds", "js")}`))) {
    writeFileSync(file, stampJs(readFileSync(file, "utf8")), "utf8");
  }
  if (
    ext === ".css" &&
    (file.includes(`${join(root, "css")}`) || file.includes(`${join(root, "vendor", "ds")}`))
  ) {
    writeFileSync(file, stampCss(readFileSync(file, "utf8")), "utf8");
  }
}

console.log(`Cache bust stamped: ${bust}`);

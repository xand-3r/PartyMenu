/**
 * DTCG → CSS custom properties
 * Source of truth: design-system/tokens/*.tokens.json
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const tokensDir = join(root, "design-system", "tokens");

const sources = [
  ["primitives", "primitives.tokens.json"],
  ["semantic", "semantic.tokens.json"],
  ["component", "component.tokens.json"],
];

/** @type {Record<string, { type?: string, raw: unknown }>} */
const flat = {};

for (const [collection, file] of sources) {
  const json = JSON.parse(readFileSync(join(tokensDir, file), "utf8"));
  walk(json[collection], collection, flat);
}

/** @param {unknown} node @param {string} path */
function walk(node, path, out) {
  if (!node || typeof node !== "object" || Array.isArray(node)) return;

  if ("$value" in node) {
    out[path] = { type: node.$type, raw: node.$value };
    return;
  }

  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith("$")) continue;
    walk(value, `${path}.${key}`, out);
  }
}

/** @param {string} refPath */
function resolve(refPath) {
  const entry = flat[refPath];
  if (!entry) {
    throw new Error(`Unresolved token: ${refPath}`);
  }
  return resolveValue(entry.raw, entry.type);
}

/** @param {unknown} value @param {string=} type */
function resolveValue(value, type) {
  if (typeof value === "string") {
    const match = value.match(/^\{(.+)\}$/);
    if (match) return resolve(match[1]);
    return value;
  }

  if (value && typeof value === "object" && "value" in value && "unit" in value) {
    const v = /** @type {{ value: number, unit: string }} */ (value);
    if (type === "dimension" && v.unit === "px" && (v.value === 500 || v.value === 600)) {
      return String(v.value);
    }
    return `${v.value}${v.unit}`;
  }

  if (value && typeof value === "object" && "components" in value) {
    const c = /** @type {{ components: string, alpha: string }} */ (value);
    const color = resolveValue(c.components);
    let alpha = resolveValue(c.alpha);
    if (typeof alpha === "string" && alpha.endsWith("px")) {
      alpha = String(Number(alpha.replace("px", "")) / 100);
    }
    if (typeof color === "string" && color.startsWith("rgb(")) {
      return color.replace(/\)$/, ` / ${alpha})`).replace(/^rgb\(/, "rgb(");
    }
    const hex = color.replace("#", "");
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgb(${r} ${g} ${b} / ${alpha})`;
  }

  return String(value);
}

const lines = [
  "/* AUTO-GENERATED — do not edit. Run: node scripts/build-tokens.mjs */",
  "/* Source: design-system/tokens/*.tokens.json (DTCG canonical) */",
  ":root {",
];

for (const path of Object.keys(flat).sort()) {
  const cssVar = `--${path.replaceAll(".", "-")}`;
  const resolved = resolveValue(flat[path].raw, flat[path].type);
  lines.push(`  ${cssVar}: ${resolved};`);
}

lines.push("}", "");

writeFileSync(join(tokensDir, "generated.css"), lines.join("\n"));
console.log(`Wrote ${Object.keys(flat).length} tokens → design-system/tokens/generated.css`);

import { createServer } from "node:http";
import { readFileSync, statSync, existsSync } from "node:fs";
import { networkInterfaces } from "node:os";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL("..", import.meta.url)));
const dsRoot = process.env.DS_ROOT || join(root, "..", "design-system");
const port = Number(process.env.PORT || 8080);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".woff2": "font/woff2",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

function resolveFile(urlPath) {
  const relative = urlPath.replace(/^\//, "").replace(/\.\./g, "");
  const local = join(root, relative);
  if (existsSync(local) && !statSync(local).isDirectory()) {
    return local;
  }
  if (relative.startsWith("vendor/ds/")) {
    const dsFile = join(dsRoot, relative.slice("vendor/ds/".length));
    if (existsSync(dsFile) && !statSync(dsFile).isDirectory()) {
      return dsFile;
    }
  }
  return local;
}

createServer((req, res) => {
  const url = new URL(req.url ?? "/", `http://localhost:${port}`);
  let path = decodeURIComponent(url.pathname);
  if (path === "/") path = "/index.html";

  const file = resolveFile(path);

  if (!file.startsWith(root) && !file.startsWith(dsRoot)) {
    res.writeHead(404, { "Cache-Control": "no-store" });
    res.end("Not found");
    return;
  }

  if (!existsSync(file) || statSync(file).isDirectory()) {
    res.writeHead(404, { "Cache-Control": "no-store" });
    res.end("Not found");
    return;
  }

  const body = readFileSync(file);
  res.writeHead(200, {
    "Content-Type": types[extname(file)] || "application/octet-stream",
    "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    Pragma: "no-cache",
    Expires: "0",
  });
  res.end(body);
}).listen(port, "0.0.0.0", () => {
  console.log(`Party Menu (no-cache): http://localhost:${port}/`);
  console.log(`Design system: ${dsRoot}`);

  const lanIps = [
    ...new Set(
      Object.values(networkInterfaces())
        .flatMap((ifaces) => ifaces ?? [])
        .filter((iface) => iface.family === "IPv4" && !iface.internal)
        .map((iface) => iface.address),
    ),
  ];

  if (lanIps.length) {
    console.log("На телефоне (та же Wi‑Fi):");
    for (const ip of lanIps) {
      console.log(`  http://${ip}:${port}/`);
    }
  }
});

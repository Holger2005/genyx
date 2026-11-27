import { createServer } from "node:http";
import { readFileSync, statSync } from "node:fs";
import { resolve, sep } from "node:path";
import { auditStatic } from "./static-audit.mjs";

const root = resolve("out");
auditStatic(root);
const types = {
  html: "text/html; charset=utf-8",
  txt: "text/plain; charset=utf-8",
  js: "text/javascript; charset=utf-8",
  css: "text/css; charset=utf-8",
  svg: "image/svg+xml",
  json: "application/json",
  woff2: "font/woff2",
  woff: "font/woff",
  png: "image/png",
  webp: "image/webp",
};

const headers = Object.fromEntries(
  readFileSync(resolve(root, "_headers"), "utf8")
    .split("\n")
    .filter((line) => line.startsWith("  "))
    .map((line) => {
      const index = line.indexOf(":");
      return [line.slice(0, index).trim(), line.slice(index + 1).trim()];
    }),
);

createServer((request, response) => {
  for (const [name, value] of Object.entries(headers)) response.setHeader(name, value);
  if (!["GET", "HEAD"].includes(request.method)) {
    response.writeHead(405).end();
    return;
  }
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname);
  } catch {
    response.writeHead(400).end();
    return;
  }
  if (pathname === "/") {
    response.writeHead(302, { Location: "/es" }).end();
    return;
  }
  const candidate = resolve(root, "." + pathname);
  const paths = [candidate, candidate + ".html"];
  const file =
    !pathname.includes("\\") &&
    !pathname.split("/").some((part) => part.startsWith(".")) &&
    !["/_headers", "/_redirects"].includes(pathname)
      ? paths.find(
          (path) => path.startsWith(root + sep) && statSync(path, { throwIfNoEntry: false })?.isFile(),
        )
      : undefined;
  const selected = file ?? resolve(root, "404.html");
  const extension = selected.split(".").at(-1);
  response.writeHead(file ? 200 : 404, {
    "Content-Type": types[extension] ?? "application/octet-stream",
  });
  response.end(request.method === "HEAD" ? undefined : readFileSync(selected));
}).listen(3220, "127.0.0.1", () => {
  console.log("GENYX static preview: http://127.0.0.1:3220");
});

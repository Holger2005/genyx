import { existsSync, readdirSync, readFileSync } from "node:fs";
import { resolve, relative, sep } from "node:path";
import { inspectPublicSource } from "./public-boundary.mjs";

const root = process.cwd();

function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? files(path) : [path];
  });
}

const roots = files(resolve(root, "src"));
for (const name of ["middleware", "proxy"]) {
  for (const extension of [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]) {
    const path = resolve(root, name + extension);
    if (existsSync(path)) roots.push(path);
  }
}

const violations = roots
  .filter((path) => /\.[cm]?[jt]sx?$/.test(path))
  .flatMap((path) => {
    const name = relative(root, path).split(sep).join("/");
    return inspectPublicSource(name, readFileSync(path, "utf8")).map(
      (error) => `${name}: ${error}`,
    );
  });
if (violations.length) {
  console.error(violations.join("\n"));
  process.exitCode = 1;
} else {
  console.log("Public deployment boundary: passed (source-level guard)");
}

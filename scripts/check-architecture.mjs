import { readdirSync, readFileSync } from "node:fs";
import { dirname, extname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../src/", import.meta.url));
const allowed = {
  domain: new Set(["domain"]),
  application: new Set(["domain", "application"]),
  infrastructure: new Set(["domain", "application", "infrastructure", "config"]),
  presentation: new Set(["domain", "application", "presentation", "config"]),
  config: new Set(["config"]),
};

function files(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(dir, entry.name);
    return entry.isDirectory() ? files(path) : [path];
  });
}

const violations = [];
for (const file of files(root).filter((file) => [".ts", ".tsx"].includes(extname(file)))) {
  const source = relative(root, file).split(sep)[0];
  if (!allowed[source]) continue;
  const code = readFileSync(file, "utf8");
  // Baseline check for literal import/export and dynamic import specifiers; not a full parser.
  const imports = code.matchAll(/(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)["']([^"']+)["']/g);
  for (const [, specifier] of imports) {
    let target;
    if (specifier.startsWith("@/")) target = resolve(root, specifier.slice(2));
    else if (specifier.startsWith(".")) target = resolve(dirname(file), specifier);
    else {
      if (source === "domain" || source === "application") {
        violations.push(`${relative(root, file)}: external import ${specifier}`);
      }
      continue;
    }
    const layer = relative(root, target).split(sep)[0];
    if (!allowed[source].has(layer)) violations.push(`${relative(root, file)} -> ${specifier}`);
  }
}
if (violations.length) {
  console.error(violations.join("\n"));
  process.exitCode = 1;
} else console.log("Architecture baseline: passed");

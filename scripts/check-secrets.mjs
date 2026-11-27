import { execFileSync } from "node:child_process";
import { lstatSync, readFileSync } from "node:fs";
import { inspectTrackedFile } from "./secret-policy.mjs";

const root = execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();
process.chdir(root);
const paths = execFileSync("git", ["ls-files", "-z"], {
  encoding: "utf8",
  maxBuffer: 16 * 1024 * 1024,
})
  .split("\0")
  .filter(Boolean);
const issues = [];

for (const path of new Set(paths)) {
  const stat = lstatSync(path, { throwIfNoEntry: false });
  if (!stat || !stat.isFile() || stat.isSymbolicLink()) {
    issues.push({ path, kind: "missing or unsupported tracked file" });
    continue;
  }

  const bytes = readFileSync(path);
  const content = bytes.includes(0) ? undefined : bytes.toString("utf8");
  for (const kind of inspectTrackedFile(path, content)) {
    issues.push({ path, kind });
  }
}

if (issues.length) {
  for (const { path, kind } of issues) {
    console.error(`Security gate: ${JSON.stringify(path)} — ${kind}`);
  }
  process.exitCode = 1;
} else {
  console.log("GENYX tracked-file security gate passed");
}

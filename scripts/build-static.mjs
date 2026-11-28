import { spawnSync } from "node:child_process";
import { copyFileSync, readFileSync, rmSync } from "node:fs";
import { auditStatic } from "./static-audit.mjs";

const products = JSON.parse(readFileSync("src/infrastructure/content/data/products.json", "utf8"));
if (!Array.isArray(products) || products.length !== 0) {
  throw new Error("Restore and review static product detail routes before publishing products");
}

rmSync("out", { recursive: true, force: true });
const env = { ...process.env, GENYX_STATIC_EXPORT: "1", NEXT_TELEMETRY_DISABLED: "1" };
const result = spawnSync(process.execPath, ["node_modules/next/dist/bin/next", "build"], {
  env,
  stdio: "inherit",
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

for (const name of ["_headers", "_redirects"]) {
  copyFileSync("deployment/cloudflare/" + name, "out/" + name);
}
auditStatic("out");

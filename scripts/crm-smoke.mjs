import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const temporary = mkdtempSync(join(tmpdir(), "genyx-crm-smoke-"));
const env = { ...process.env, HOME: temporary, LOCALAPPDATA: temporary };
const expectedDirectory =
  process.platform === "win32"
    ? join(temporary, "Genyx")
    : join(temporary, ".local", "share", "genyx");

function cli(args, status = 0) {
  const result = spawnSync(
    process.execPath,
    [
      "--experimental-sqlite",
      "--experimental-strip-types",
      "--disable-warning=ExperimentalWarning",
      "scripts/crm.mjs",
      ...args,
    ],
    { env, encoding: "utf8", timeout: 15000 },
  );
  if (result.error) throw result.error;
  assert.equal(result.status, status, result.stderr);
  return result.stdout;
}

try {
  assert.equal(cli(["where"]).trim(), join(expectedDirectory, "crm-lab.sqlite"));
  assert.match(cli(["demo"]), /genyx-test-001/);
  assert.match(cli(["move", "genyx-test-001", "contacted"]), /contacted/);
  assert.match(cli(["demo"]), /contacted/);
  assert.match(cli(["list"]), /genyx-test-001/);
  const history = cli(["history", "genyx-test-001"]);
  assert.match(history, /new/);
  assert.match(history, /contacted/);
  cli(["move", "genyx-test-001", "won"], 1);
  console.log("CRM CLI smoke passed; isolated synthetic database only");
} finally {
  rmSync(temporary, { recursive: true, force: true });
}

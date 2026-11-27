import { randomBytes } from "node:crypto";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

const name = "genyx-pg-test-" + randomBytes(8).toString("hex");
const env = { ...process.env, POSTGRES_PASSWORD: randomBytes(32).toString("hex") };

function docker(args, options = {}) {
  const result = spawnSync("docker", args, {
    encoding: "utf8",
    timeout: 300000,
    ...options,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error((result.stderr || result.stdout || "Docker command failed").trim());
  }
  return result.stdout;
}

try {
  docker([
    "run",
    "-d",
    "--name",
    name,
    "--network",
    "none",
    "-e",
    "POSTGRES_PASSWORD",
    "-e",
    "POSTGRES_DB=genyx_test",
    "postgres:17",
  ], { env });

  let ready = false;
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      docker(["exec", name, "psql", "-U", "postgres", "-d", "genyx_test", "-c", "select 1"], {
        timeout: 5000,
      });
      ready = true;
      break;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  if (!ready) throw new Error("PostgreSQL test container did not become ready");

  for (const path of [
    "tests/postgres/bootstrap.sql",
    "supabase/migrations/20261127000100_crm_foundation.sql",
    "tests/postgres/crm-security.sql",
  ]) {
    const output = docker(
      ["exec", "-i", name, "psql", "-X", "-U", "postgres", "-d", "genyx_test", "-v", "ON_ERROR_STOP=1", "-f", "-"],
      { input: readFileSync(new URL("../" + path, import.meta.url), "utf8") },
    );
    console.log(output.trim());
  }
} finally {
  spawnSync("docker", ["rm", "-f", "-v", name], { stdio: "ignore", timeout: 15000 });
}

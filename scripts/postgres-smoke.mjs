import { randomBytes } from "node:crypto";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { verifyN8nTest } from "./n8n-crm-bridge.mjs";

const live = process.argv.includes("--live");
const fixture = JSON.parse(
  readFileSync(new URL("../automation/n8n/fixtures/intake-test.json", import.meta.url), "utf8"),
);
const simulatedResponse = () =>
  Response.json({
    statusCode: 200,
    ok: true,
    testOnly: true,
    requestId: "genyx-test-001",
    service: "automation",
    priority: "high",
    stage: "new",
    persisted: false,
  });
const lead = live
  ? await verifyN8nTest(fixture, process.env.GENYX_N8N_TEST_TOKEN)
  : await verifyN8nTest(fixture, randomBytes(32).toString("hex"), simulatedResponse);
console.log(live ? "Live n8n response verified" : "Simulated n8n response verified");

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
  docker(
    [
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
    ],
    { env },
  );

  let ready = false;
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      docker(
        ["exec", name, "pg_isready", "-h", "127.0.0.1", "-U", "postgres", "-d", "genyx_test"],
        { timeout: 5000 },
      );
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
    "supabase/migrations/20261127000200_crm_test_ingestion.sql",
    "tests/postgres/crm-security.sql",
    "tests/postgres/n8n-bridge.sql",
  ]) {
    const output = docker(
      [
        "exec",
        "-i",
        name,
        "psql",
        "-X",
        "-U",
        "postgres",
        "-d",
        "genyx_test",
        "-v",
        "ON_ERROR_STOP=1",
        "-v",
        `request_id=${lead.id}`,
        "-v",
        `locale=${lead.locale}`,
        "-v",
        `service=${lead.service}`,
        "-v",
        `timeline=${lead.timeline}`,
        "-v",
        `priority=${lead.priority}`,
        "-f",
        "-",
      ],
      { input: readFileSync(new URL("../" + path, import.meta.url), "utf8") },
    );
    console.log(output.trim());
  }
} finally {
  spawnSync("docker", ["rm", "-f", "-v", name], { stdio: "ignore", timeout: 15000 });
}

import assert from "node:assert/strict";
import { test } from "node:test";
import { inspectTrackedFile } from "../../scripts/secret-policy.mjs";

test("blocks private files, including database sidecars", () => {
  for (const path of [".env.local", "data/crm.sqlite-wal", "keys/server.pem", "backups/a.sql"]) {
    assert.ok(inspectTrackedFile(path, "").includes("private artifact"));
  }
});

test("permits the empty public environment example only", () => {
  assert.deepEqual(
    inspectTrackedFile(".env.example", "# public settings\nGENYX_WHATSAPP_NUMBER=\n"),
    [],
  );
  assert.ok(inspectTrackedFile(".env.example", "GENYX_WHATSAPP_NUMBER=123456789").length);
  assert.ok(inspectTrackedFile(".env.example", "PRIVATE_KEY=").length);
});

test("identifies operator credentials without returning their values", () => {
  const value = "a".repeat(64);
  assert.deepEqual(inspectTrackedFile("config.txt", "GENYX_ADMIN_TOKEN=" + value), [
    "Genyx operator credential",
  ]);
  assert.deepEqual(inspectTrackedFile("config.txt", "GENYX_N8N_TEST_TOKEN=" + value), [
    "Genyx operator credential",
  ]);
});

test("recognizes representative provider credentials and database passwords", () => {
  for (const [sample, kind] of [
    ["gh" + "p_" + "x".repeat(36), "GitHub credential"],
    ["sb_" + "secret_" + "x".repeat(24), "Supabase secret"],
    ["AK" + "IA" + "A".repeat(16), "AWS access key"],
    ["GOC" + "SPX-" + "x".repeat(24), "Google OAuth credential"],
    ["-----BEGIN " + "PRIVATE KEY-----", "private key"],
    ["postgres" + "://user:password@db.invalid/test", "database URL with password"],
  ]) {
    assert.ok(inspectTrackedFile("config.txt", sample).includes(kind));
  }
});

test("allows safe configuration references and public links", () => {
  assert.deepEqual(inspectTrackedFile("src/config.ts", "process.env.GENYX_ADMIN_TOKEN"), []);
  assert.deepEqual(inspectTrackedFile("README.md", "https://calendar.app.google/example"), []);
  assert.deepEqual(inspectTrackedFile("public/icon.svg", "<svg></svg>"), []);
});

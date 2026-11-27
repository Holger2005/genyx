import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const token = process.env.GENYX_N8N_TEST_TOKEN;
assert.ok(token && token.length >= 32, "Set GENYX_N8N_TEST_TOKEN (minimum 32 characters)");

const fixture = JSON.parse(
  await readFile(new URL("../automation/n8n/fixtures/intake-test.json", import.meta.url), "utf8"),
);
const url = "http://127.0.0.1:5678/webhook-test/genyx-intake-test";
const response = await fetch(url, {
  method: "POST",
  headers: { "content-type": "application/json", "x-genyx-token": token },
  body: JSON.stringify(fixture),
  redirect: "error",
  signal: AbortSignal.timeout(10000),
});
assert.equal(response.status, 200, "Test webhook must return 200");
const result = await response.json();
assert.equal(result.ok, true);
assert.equal(result.testOnly, true);
assert.equal(result.requestId, fixture.requestId);
assert.equal(result.service, fixture.service);
assert.equal(result.priority, "high");
assert.equal(result.stage, "new");
assert.equal(result.persisted, false);
console.log("n8n test webhook: validation and classification passed; nothing persisted");

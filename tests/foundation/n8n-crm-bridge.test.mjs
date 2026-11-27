import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { verifyN8nTest } from "../../scripts/n8n-crm-bridge.mjs";

const fixture = JSON.parse(
  await readFile(
    new URL("../../automation/n8n/fixtures/intake-test.json", import.meta.url),
    "utf8",
  ),
);
const token = "a".repeat(64);
const result = {
  statusCode: 200,
  ok: true,
  testOnly: true,
  requestId: fixture.requestId,
  service: fixture.service,
  priority: "high",
  stage: "new",
  persisted: false,
};

test("accepts only a matching authenticated classification at the fixed loopback URL", async () => {
  const lead = await verifyN8nTest(fixture, token, async (url, options) => {
    assert.equal(url, "http://127.0.0.1:5678/webhook-test/genyx-intake-test");
    assert.equal(options.headers["x-genyx-token"], token);
    assert.equal(options.method, "POST");
    assert.equal(options.redirect, "error");
    assert.deepEqual(JSON.parse(options.body), fixture);
    return Response.json(result);
  });
  assert.equal(lead.id, fixture.requestId);
  assert.equal(lead.priority, "high");
});

test("refuses invalid credentials and non-synthetic input before transmission", async () => {
  const forbidden = async () => {
    assert.fail("Must not send");
  };
  await assert.rejects(verifyN8nTest(fixture, "short", forbidden), /TOKEN/);
  await assert.rejects(verifyN8nTest({ ...fixture, testOnly: false }, token, forbidden));
  await assert.rejects(
    verifyN8nTest({ ...fixture, email: "test@example.invalid" }, token, forbidden),
  );
});

test("refuses unauthorized, unavailable, mismatched and oversized responses", async () => {
  for (const status of [401, 403, 404, 500]) {
    await assert.rejects(
      verifyN8nTest(fixture, token, async () => new Response(null, { status })),
      /HTTP/,
    );
  }
  for (const value of [
    null,
    { ...result, priority: "low" },
    { ...result, requestId: "different" },
    { ...result, persisted: true },
    { ...result, extra: true },
  ]) {
    await assert.rejects(
      verifyN8nTest(fixture, token, async () => Response.json(value)),
      /classification/,
    );
  }
  await assert.rejects(
    verifyN8nTest(fixture, token, async () => new Response("x".repeat(4097))),
    /exceeds limit/,
  );
});

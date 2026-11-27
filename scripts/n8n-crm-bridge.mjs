import { parseTestLead } from "../src/domain/crm/lead.ts";

const endpoint = "http://127.0.0.1:5678/webhook-test/genyx-intake-test";

async function boundedJson(response) {
  if (!response.body) throw new Error("Missing n8n response");
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let size = 0;
  let text = "";
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 4096) {
        await reader.cancel();
        throw new Error("n8n response exceeds limit");
      }
      text += decoder.decode(value, { stream: true });
    }
    return JSON.parse(text + decoder.decode());
  } finally {
    reader.releaseLock();
  }
}

export async function verifyN8nTest(fixture, token, send = fetch) {
  const lead = parseTestLead(fixture);
  if (typeof token !== "string" || !/^[a-f0-9]{64}$/.test(token)) {
    throw new Error("Set a fresh 32-byte hexadecimal GENYX_N8N_TEST_TOKEN");
  }
  const response = await send(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json", "x-genyx-token": token },
    body: JSON.stringify(fixture),
    redirect: "error",
    signal: AbortSignal.timeout(10000),
  });
  if (response.status !== 200) {
    await response.body?.cancel();
    throw new Error(`n8n test webhook returned HTTP ${response.status}`);
  }
  const result = await boundedJson(response);
  const expected = {
    statusCode: 200,
    ok: true,
    testOnly: true,
    requestId: lead.id,
    service: lead.service,
    priority: lead.priority,
    stage: "new",
    persisted: false,
  };
  if (
    !result ||
    typeof result !== "object" ||
    Array.isArray(result) ||
    Object.keys(result).length !== Object.keys(expected).length ||
    !Object.entries(expected).every(([key, value]) => result[key] === value)
  ) {
    throw new Error("Unexpected n8n classification; CRM write refused");
  }
  return lead;
}

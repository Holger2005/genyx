import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vitest";
import fixture from "../../automation/n8n/fixtures/intake-test.json";
import workflow from "../../automation/n8n/genyx-intake-test.json";
import { staticCatalog } from "../../src/infrastructure/catalog/static-catalog";

const code = workflow.nodes.find((node) => node.type === "n8n-nodes-base.code")?.parameters.jsCode;
if (!code) throw new Error("Missing workflow code");

function execute(body: unknown) {
  const result = runInNewContext(
    `(function () { ${code} })()`,
    { $input: { first: () => ({ json: { body } }) } },
    { timeout: 1000 },
  );
  return JSON.parse(JSON.stringify(result[0].json));
}

describe("n8n intake laboratory", () => {
  it("ships inactive, authenticated and without embedded credentials", () => {
    expect(workflow.active).toBe(false);
    const webhook = workflow.nodes.find((node) => node.type === "n8n-nodes-base.webhook");
    expect(webhook?.parameters.authentication).toBe("headerAuth");
    expect(workflow.settings.saveDataSuccessExecution).toBe("none");
    expect(workflow.settings.saveDataErrorExecution).toBe("none");
    expect(JSON.stringify(workflow)).not.toContain('"credentials"');
  });

  it("classifies a synthetic request without persistence", () => {
    expect(execute(fixture)).toEqual({
      statusCode: 200,
      ok: true,
      testOnly: true,
      requestId: fixture.requestId,
      service: fixture.service,
      priority: "high",
      stage: "new",
      persisted: false,
    });
    expect(execute({ ...fixture, timeline: "exploring" }).priority).toBe("low");
    expect(execute({ ...fixture, timeline: "one-to-three" }).priority).toBe("normal");
    expect(execute({ ...fixture, timeline: "three-plus" }).priority).toBe("normal");
  });

  it("accepts the six existing service identifiers", () => {
    for (const service of staticCatalog.services()) {
      expect(execute({ ...fixture, service: service.slug }).ok).toBe(true);
    }
  });

  it("rejects malformed, non-test, and personal-data-bearing records", () => {
    const invalid = [
      null,
      [],
      {},
      { ...fixture, testOnly: false },
      { ...fixture, source: "genyx" },
      { ...fixture, schemaVersion: 2 },
      { ...fixture, service: "unknown" },
      { ...fixture, timeline: "unknown" },
      { ...fixture, requestId: "real-client" },
      { ...fixture, locale: "fr" },
      { ...fixture, email: "test@example.invalid" },
      { ...fixture, details: "Unexpected free text" },
    ];
    for (const body of invalid) {
      expect(execute(body)).toEqual({ statusCode: 400, ok: false, error: "invalid_test_payload" });
    }
  });
});

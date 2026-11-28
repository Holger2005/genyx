import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { estimateProject, parseSalesArguments } from "../../scripts/sales/estimate.mjs";

const input = {
  service: "automation",
  hours: 12,
  hourlyCents: 1500,
  costsCents: 2000,
  contingencyPercent: 15,
};

test("estimates labor, direct costs and contingency in integer cents", () => {
  assert.deepEqual(estimateProject(input), {
    service: "automation",
    laborCents: 18000,
    costsCents: 2000,
    contingencyCents: 3000,
    estimateCents: 23000,
  });
});

test("rounds contingency upward to the nearest cent", () => {
  const result = estimateProject({
    ...input,
    hours: 1,
    hourlyCents: 101,
    costsCents: 0,
    contingencyPercent: 10,
  });
  assert.equal(result.contingencyCents, 11);
  assert.equal(result.estimateCents, 112);
});

test("rejects invalid scope, negative amounts, fractional and unsafe numbers", () => {
  for (const change of [
    { service: "unknown" },
    { hours: 0 },
    { hours: 1.5 },
    { hourlyCents: -1 },
    { costsCents: Number.MAX_SAFE_INTEGER },
    { contingencyPercent: 101 },
  ]) {
    assert.throws(() => estimateProject({ ...input, ...change }));
  }
});

test("CLI accepts exactly five arguments and rejects noninteger values", () => {
  assert.equal(parseSalesArguments(["web", "12", "1500", "2000", "15"]).estimateCents, 23000);
  assert.throws(() => parseSalesArguments(["web", "12", "15.00", "2000", "15"]));
  assert.throws(() => parseSalesArguments(["web", "12", "1500", "2000", "15", "extra"]));
});

test("calculator covers every service in the reviewed catalog", async () => {
  const catalog = JSON.parse(
    await readFile(
      new URL("../../src/infrastructure/content/data/services.json", import.meta.url),
      "utf8",
    ),
  );
  for (const item of catalog) {
    assert.equal(estimateProject({ ...input, service: item.slug }).service, item.slug);
  }
});

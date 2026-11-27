import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const directory = ".artifacts/lighthouse";
const origin = "http://127.0.0.1:3191";
const audits = [
  ["home-mobile", "", "mobile"],
  ["home-desktop", "", "desktop"],
  ["projects-mobile", "/projects", "mobile"],
  ["case-mobile", "/projects/genyx", "mobile"],
  ["services-mobile", "/services", "mobile"],
  ["products-mobile", "/products", "mobile"],
  ["inquiry-mobile", "/inquiry", "mobile"],
  ["consultation-mobile", "/consultation", "mobile"],
];
let failures = 0;

function readAudit(key, route, formFactor, locale) {
  const report = JSON.parse(readFileSync(join(directory, `${key}.json`), "utf8"));
  assert.equal(report.requestedUrl, `${origin}/${locale}${route}`, key);
  assert.equal(report.configSettings.formFactor, formFactor, key);
  assert.ok(!report.runtimeError, `${key}: Lighthouse runtime error`);
  const scores = {
    performance: report.categories.performance.score,
    accessibility: report.categories.accessibility.score,
    bestPractices: report.categories["best-practices"].score,
    seo: report.categories.seo.score,
    lcp: report.audits["largest-contentful-paint"].numericValue,
    cls: report.audits["cumulative-layout-shift"].numericValue,
    tbt: report.audits["total-blocking-time"].numericValue,
  };
  for (const [metric, value] of Object.entries(scores)) {
    assert.ok(typeof value === "number" && Number.isFinite(value), `${key}: ${metric}`);
  }
  console.log(key, JSON.stringify(scores));
  if (scores.performance < 0.95 || scores.tbt > 200) {
    const tasks = report.audits["long-tasks"]?.details?.items ?? [];
    const breakdown = report.audits["mainthread-work-breakdown"]?.details?.items ?? [];
    console.log(key, JSON.stringify({ tasks: tasks.slice(0, 10), breakdown }));
  }
  return scores;
}

function passes(scores) {
  return (
    scores.performance >= 0.95 &&
    scores.accessibility >= 0.95 &&
    scores.lcp <= 2500 &&
    scores.cls <= 0.1 &&
    scores.tbt <= 200
  );
}

for (const locale of ["es", "en"]) {
  for (const [name, route, formFactor] of audits) {
    const key = `${locale}-${name}`;
    const samples =
      name === "home-mobile"
        ? [1, 2, 3].map((id) => readAudit(`${key}-${id}`, route, formFactor, locale))
        : [readAudit(key, route, formFactor, locale)];
    const passed = samples.filter(passes).length;
    const required = samples.length === 3 ? 2 : 1;
    console.log(`${key}: ${passed}/${samples.length} runs meet every budget`);
    // Accessibility and layout stability are required in every run.
    const stable = samples.every((score) => score.accessibility >= 0.95 && score.cls <= 0.1);
    if (passed < required || !stable) {
      failures++;
      console.error(`${key}: release budgets not met`);
    }
  }
}
assert.equal(failures, 0, "Lighthouse release budgets");

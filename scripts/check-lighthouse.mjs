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

function threshold(label, value, limit, direction) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    failures++;
    console.error(`${label}: missing or invalid measurement`);
    return;
  }
  const passed = direction === "min" ? value >= limit : value <= limit;
  if (!passed) {
    failures++;
    console.error(`${label}: ${value} failed ${direction} ${limit}`);
  }
}

for (const locale of ["es", "en"]) {
  for (const [name, route, formFactor] of audits) {
    const key = `${locale}-${name}`;
    const report = JSON.parse(readFileSync(join(directory, `${key}.json`), "utf8"));
    assert.equal(report.requestedUrl, `${origin}/${locale}${route}`, key);
    assert.equal(report.configSettings.formFactor, formFactor, key);
    assert.ok(!report.runtimeError, `${key}: Lighthouse runtime error`);
    const performance = report.categories.performance.score;
    const accessibility = report.categories.accessibility.score;
    const bestPractices = report.categories["best-practices"].score;
    const seo = report.categories.seo.score;
    const lcp = report.audits["largest-contentful-paint"].numericValue;
    const cls = report.audits["cumulative-layout-shift"].numericValue;
    const tbt = report.audits["total-blocking-time"].numericValue;
    const scores = { performance, accessibility, bestPractices, seo, lcp, cls, tbt };
    console.log(key, JSON.stringify(scores));
    if (performance < 0.95 || tbt > 200) {
      const tasks = report.audits["long-tasks"]?.details?.items ?? [];
      const breakdown = report.audits["mainthread-work-breakdown"]?.details?.items ?? [];
      console.log(key, JSON.stringify({ tasks: tasks.slice(0, 10), breakdown }));
    }
    threshold(`${key} performance`, performance, 0.95, "min");
    threshold(`${key} accessibility`, accessibility, 0.95, "min");
    threshold(`${key} LCP`, lcp, 2500, "max");
    threshold(`${key} CLS`, cls, 0.1, "max");
    threshold(`${key} TBT`, tbt, 200, "max");
  }
}
assert.equal(failures, 0, "Lighthouse release budgets");

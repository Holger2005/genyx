import assert from "node:assert/strict";
import { contactStatus } from "./hosted-contact.mjs";

const origin = "https://genyx-7us.pages.dev";
const requireContacts = process.argv.includes("--require-contacts");
const routes = [
  "",
  "/projects",
  "/projects/genyx",
  "/services",
  "/products",
  "/inquiry",
  "/consultation",
  "/privacy",
  ...["web", "mobile", "enterprise", "ai", "automation", "integrations"].map(
    (slug) => "/services/" + slug,
  ),
];
const request = (path) =>
  fetch(origin + path, { redirect: "manual", signal: AbortSignal.timeout(15000) });

const root = await request("/");
assert.equal(root.status, 302, "Root redirect");
assert.equal(new URL(root.headers.get("location"), origin).href, origin + "/es");
await root.body?.cancel();

const consultation = {};
let passed = 0;
for (const locale of ["es", "en"]) {
  for (const route of routes) {
    const path = "/" + locale + route;
    const response = await request(path);
    assert.equal(response.status, 200, path);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html/);
    assert.match(response.headers.get("x-robots-tag") ?? "", /\bnoindex\b/);
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
    assert.equal(response.headers.get("x-frame-options"), "DENY");
    assert.equal(response.headers.get("referrer-policy"), "strict-origin-when-cross-origin");
    assert.match(response.headers.get("content-security-policy") ?? "", /frame-ancestors 'none'/);
    const html = await response.text();
    assert.ok(html.includes(`lang="${locale}"`), "Incorrect language: " + path);
    if (route === "/consultation") consultation[locale] = html;
    passed++;
  }
}

for (const path of ["/admin", "/api/leads", "/es/crm", "/en/products/unavailable"]) {
  const response = await request(path);
  assert.equal(response.status, 404, path);
  await response.body?.cancel();
}

const status = contactStatus(consultation.es, consultation.en);
console.log("Localized pages passed: " + passed + "/28");
console.log("Calendar: " + status.calendar);
console.log("WhatsApp: " + status.whatsapp);
for (const state of Object.values(status)) {
  assert.notEqual(state, "inconsistent", "Contact configuration differs between locales");
  if (requireContacts) assert.equal(state, "configured", "Required contact channel unavailable");
}
console.log("GENYX hosted preview checks passed");

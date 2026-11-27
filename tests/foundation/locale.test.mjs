import assert from "node:assert/strict";
import test from "node:test";
import { alternateLocale, isLocale } from "../../src/domain/locale.ts";
import { getSiteContent } from "../../src/application/site-content.ts";

test("supported locales", () => {
  assert.equal(isLocale("es"), true);
  assert.equal(isLocale("en"), true);
  for (const value of ["fr", "", undefined, null, 1]) assert.equal(isLocale(value), false);
});

test("language switching", () => {
  assert.equal(alternateLocale("es"), "en");
  assert.equal(alternateLocale("en"), "es");
});

test("application delegates to its port", () => {
  const sample = { title: "Test", description: "", status: "", language: "" };
  let received;
  const repository = {
    get(locale) {
      received = locale;
      return sample;
    },
  };
  assert.equal(getSiteContent(repository, "en"), sample);
  assert.equal(received, "en");
});

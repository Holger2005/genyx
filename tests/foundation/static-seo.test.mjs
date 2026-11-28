import assert from "node:assert/strict";
import { test } from "node:test";
import { inspectStaticPage } from "../../scripts/static-seo.mjs";

const html = `<html lang="es"><head><title>Software | Genyx</title>
<meta name="description" content="Software a medida">
<meta name="robots" content="noindex, nofollow">
<meta property="og:title" content="Software | Genyx">
<meta property="og:description" content="Software a medida">
<meta property="og:site_name" content="Genyx">
<meta property="og:locale" content="es_EC">
<meta name="twitter:title" content="Software | Genyx">
<meta name="twitter:description" content="Software a medida">
<meta name="twitter:card" content="summary">
<script src="/_next/static/chunks/a.js"></script>
<link rel="preload" href="/_next/static/chunks/a.js">
<link rel="stylesheet" href="/_next/static/chunks/a.css">
</head></html>`;

test("validates localized preview metadata and deduplicates asset references", () => {
  const result = inspectStaticPage(html, "es", () => 100);
  assert.equal(result.title, "Software | Genyx");
  assert.equal(result.sizes.javascript, 100);
  assert.equal(result.sizes.css, 100);
});

test("rejects missing metadata, incorrect locale and indexable previews", () => {
  assert.throws(() => inspectStaticPage(html.replace("noindex", "index"), "es", () => 100));
  assert.throws(() => inspectStaticPage(html, "en", () => 100));
  assert.throws(() => inspectStaticPage(html.replace("og:title", "other"), "es", () => 100));
});

test("rejects unapproved canonical URLs and missing or oversized assets", () => {
  const canonical = '<link rel="canonical" href="https://example.invalid">';
  assert.throws(() => inspectStaticPage(html + canonical, "es", () => 100));
  assert.throws(() => inspectStaticPage(html, "es", () => undefined));
  assert.throws(() => inspectStaticPage(html, "es", () => 2 * 1024 * 1024));
});

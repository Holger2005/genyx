import assert from "node:assert/strict";

export const budgets = { html: 512 * 1024, javascript: 1024 * 1024, css: 256 * 1024 };

function metadata(html) {
  const result = new Map();
  for (const match of html.matchAll(/<meta\s+[^>]*>/gi)) {
    const attrs = Object.fromEntries(
      [...match[0].matchAll(/([\w:-]+)="([^"]*)"/g)].map((item) => [item[1], item[2]]),
    );
    const key = attrs.name ?? attrs.property;
    if (key && attrs.content !== undefined) {
      // Repeatable Open Graph properties are allowed; the checked singletons must agree.
      if (key !== "og:locale:alternate") {
        assert.ok(
          !result.has(key) || result.get(key) === attrs.content,
          "Conflicting metadata: " + key,
        );
      }
      result.set(key, attrs.content);
    }
  }
  return result;
}

export function inspectStaticPage(html, locale, assetSize) {
  const head = html.match(/<head>([\s\S]*?)<\/head>/i)?.[1] ?? "";
  const meta = metadata(head);
  const title = head.match(/<title>([^<]+)<\/title>/i)?.[1];
  assert.ok(title?.trim(), "Missing document title");
  for (const key of [
    "description",
    "og:title",
    "og:description",
    "og:site_name",
    "twitter:title",
    "twitter:description",
    "twitter:card",
  ]) {
    assert.ok(meta.get(key)?.trim(), "Missing " + key);
  }
  assert.equal(meta.get("og:locale"), locale === "es" ? "es_EC" : "en_US");
  assert.equal(meta.get("og:site_name"), "Genyx");
  assert.match(meta.get("robots") ?? "", /\bnoindex\b/);
  assert.match(meta.get("robots") ?? "", /\bnofollow\b/);
  assert.equal(meta.get("og:description"), meta.get("description"));
  assert.equal(meta.get("twitter:description"), meta.get("description"));
  assert.equal(meta.get("twitter:title"), meta.get("og:title"));
  assert.ok(!meta.has("og:url"), "Canonical origin must be approved first");
  assert.ok(!/<link\b[^>]*rel="canonical"/i.test(html), "Unapproved canonical origin");

  const sizes = { html: Buffer.byteLength(html), javascript: 0, css: 0 };
  const assets = new Set(
    [...html.matchAll(/(?:src|href)="\/(_next\/static\/[^"?#]+\.(?:js|css))(?:\?[^"]*)?"/g)].map(
      (match) => match[1],
    ),
  );
  for (const path of assets) {
    const kind = path.endsWith(".js") ? "javascript" : "css";
    const bytes = assetSize(path);
    assert.ok(Number.isSafeInteger(bytes) && bytes >= 0, "Missing referenced asset: " + path);
    sizes[kind] += bytes;
  }
  for (const [kind, limit] of Object.entries(budgets)) {
    assert.ok(sizes[kind] <= limit, `${kind} budget exceeded: ${sizes[kind]} > ${limit}`);
  }
  return { title, sizes };
}

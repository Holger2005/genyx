import assert from "node:assert/strict";

const origin = "https://genyx-7us.pages.dev";
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

export function contactChannels(html) {
  const links = [...html.matchAll(/<a\s[^>]*\bhref="([^"]+)"[^>]*>/gi)].map((match) => match[1]);
  const booking = links.filter((link) =>
    /^https:\/\/calendar\.(?:app\.google\/[a-zA-Z0-9_-]+|google\.com\/(?:calendar\/)?appointments\/schedules\/[a-zA-Z0-9_-]+)\/?$/.test(
      link,
    ),
  );
  const whatsapp = links.filter((link) =>
    /^https:\/\/wa\.me\/[1-9][0-9]{7,14}(?:\?text=[^#]*)?$/.test(link),
  );
  return {
    booking: booking.length > 0,
    whatsapp: whatsapp.length > 0,
  };
}

function checkHeaders(headers) {
  assert.equal(headers.get("x-robots-tag"), "noindex, nofollow");
  assert.equal(headers.get("x-content-type-options"), "nosniff");
  assert.equal(headers.get("x-frame-options"), "DENY");
  assert.equal(headers.get("referrer-policy"), "strict-origin-when-cross-origin");
  assert.equal(headers.get("permissions-policy"), "camera=(), microphone=(), geolocation=()");
  assert.match(headers.get("content-security-policy") ?? "", /frame-ancestors 'none'/);
}

export async function checkHostedPreview(send = fetch) {
  const request = (path) =>
    send(origin + path, { redirect: "manual", signal: AbortSignal.timeout(10000) });

  const entry = await request("/");
  assert.equal(entry.status, 302, "Root status");
  assert.equal(entry.headers.get("location"), "/es", "Root redirect");
  checkHeaders(entry.headers);
  await entry.body?.cancel();

  const channels = {};
  let pages = 0;
  for (const locale of ["es", "en"]) {
    for (const route of routes) {
      const path = "/" + locale + route;
      const response = await request(path);
      assert.equal(response.status, 200, path);
      assert.match(response.headers.get("content-type") ?? "", /^text\/html/);
      checkHeaders(response.headers);
      if (route === "/consultation") {
        channels[locale] = contactChannels(await response.text());
      } else {
        await response.body?.cancel();
      }
      pages++;
    }
  }
  assert.deepEqual(channels.es, channels.en, "Contact availability differs by language");

  for (const path of [
    "/fr",
    "/admin",
    "/es/crm",
    "/api/leads",
    "/api/inquiry",
    "/es/products/unavailable",
    "/.env.local",
    "/scripts/admin-start.mjs",
  ]) {
    const response = await request(path);
    assert.equal(response.status, 404, path);
    await response.body?.cancel();
  }
  return { pages, channels: channels.es };
}

import assert from "node:assert/strict";
import { test } from "node:test";
import { checkHostedPreview, contactChannels } from "../../scripts/hosted-preview.mjs";

const headers = {
  "content-type": "text/html; charset=utf-8",
  "x-robots-tag": "noindex, nofollow",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=()",
  "content-security-policy": "frame-ancestors 'none'",
};

const fixture =
  '<a href="https://calendar.app.google/example">Calendar</a>' +
  '<a href="https://wa.me/593000000000?text=demo">WhatsApp</a>';

function mock(url, options) {
  const parsed = new URL(url);
  assert.equal(parsed.origin, "https://genyx-7us.pages.dev");
  assert.equal(options.redirect, "manual");
  if (parsed.pathname === "/") {
    return new Response(null, { status: 302, headers: { ...headers, location: "/es" } });
  }
  if (
    /^\/(es|en)(?:$|\/)/.test(parsed.pathname) &&
    !["/es/crm", "/es/products/unavailable"].includes(parsed.pathname)
  ) {
    return new Response(fixture, { status: 200, headers });
  }
  return new Response(null, { status: 404 });
}

test("contact inspection ignores plain text and foreign origins", () => {
  assert.deepEqual(contactChannels(fixture), { booking: true, whatsapp: true });
  assert.deepEqual(contactChannels(fixture.replaceAll("href=", "data-url=")), {
    booking: false,
    whatsapp: false,
  });
  assert.deepEqual(contactChannels('<a href="https://wa.me.example/593000000000">x</a>'), {
    booking: false,
    whatsapp: false,
  });
});

test("hosted preview checks all 28 pages without contacting providers", async () => {
  assert.deepEqual(await checkHostedPreview(mock), {
    pages: 28,
    channels: { booking: true, whatsapp: true },
  });
});

test("rejects a public admin route or missing security headers", async () => {
  await assert.rejects(
    checkHostedPreview((url, options) =>
      url.endsWith("/admin") ? new Response("unexpected") : mock(url, options),
    ),
  );
  await assert.rejects(
    checkHostedPreview((url, options) =>
      url.endsWith("/en") ? new Response("missing headers") : mock(url, options),
    ),
  );
});

test("rejects inconsistent contact availability in the two languages", async () => {
  await assert.rejects(
    checkHostedPreview((url, options) =>
      url.endsWith("/en/consultation")
        ? new Response("<p>Unavailable</p>", { headers })
        : mock(url, options),
    ),
  );
});

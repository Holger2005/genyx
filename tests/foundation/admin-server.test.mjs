import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { once } from "node:events";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { createAdminServer } from "../../scripts/admin/server.mjs";
import { recordTestLead } from "../../src/application/crm/lead-repository.ts";
import { SqliteLeadRepository } from "../../src/infrastructure/crm/sqlite-lead-repository.ts";

const fixture = JSON.parse(
  await readFile(
    new URL("../../automation/n8n/fixtures/intake-test.json", import.meta.url),
    "utf8",
  ),
);

test("local dashboard enforces login, CSRF, state changes, logout and session expiry", async () => {
  const repository = new SqliteLeadRepository(":memory:");
  const token = randomBytes(32).toString("hex");
  let now = Date.now();
  recordTestLead(repository, fixture, new Date(now).toISOString());
  const server = createAdminServer(repository, token, () => now);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const origin = `http://127.0.0.1:${server.address().port}`;
  const post = (path, values, cookie = "", requestOrigin = origin) =>
    fetch(origin + path, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Origin: requestOrigin,
        Cookie: cookie,
      },
      body: new URLSearchParams(values),
      redirect: "manual",
    });
  try {
    const initial = await fetch(origin);
    assert.match(await initial.text(), /Acceso privado/);
    assert.equal(initial.headers.get("cache-control"), "no-store");
    assert.equal(initial.headers.get("referrer-policy"), "same-origin");
    assert.match(initial.headers.get("content-security-policy"), /frame-ancestors 'none'/);
    assert.equal((await post("/move", {})).status, 401);
    assert.equal((await post("/login", { token }, "", "http://example.invalid")).status, 403);
    assert.equal((await post("/login", { token }, "", "null")).status, 403);
    assert.equal((await post("/login", { token: "wrong" })).status, 401);

    const login = await post("/login", { token });
    assert.equal(login.status, 303);
    const setCookie = login.headers.get("set-cookie");
    assert.match(setCookie, /HttpOnly; SameSite=Strict/);
    const cookie = setCookie.split(";")[0];
    const page = await fetch(origin, { headers: { Cookie: cookie } });
    const body = await page.text();
    assert.match(body, /genyx-test-001/);
    const csrf = body.match(/name="csrf" value="([a-f0-9]{64})"/)?.[1];
    assert.ok(csrf);
    const change = { csrf, id: fixture.requestId, stage: "contacted" };
    assert.equal((await post("/move", { ...change, csrf: "wrong" }, cookie)).status, 403);
    assert.equal((await post("/move", change, cookie, "http://example.invalid")).status, 403);
    assert.equal((await post("/move", change, cookie)).status, 303);
    assert.equal(repository.find(fixture.requestId).stage, "contacted");
    assert.equal(repository.history(fixture.requestId).length, 2);
    assert.equal((await post("/move", { ...change, stage: "won" }, cookie)).status, 400);

    assert.equal((await post("/logout", { csrf }, cookie)).status, 303);
    assert.equal((await post("/move", change, cookie)).status, 401);
    const fresh = await post("/login", { token });
    const freshCookie = fresh.headers.get("set-cookie").split(";")[0];
    now += 30 * 60 * 1000;
    const expired = await fetch(origin, { headers: { Cookie: freshCookie } });
    assert.match(await expired.text(), /Acceso privado/);

    for (let attempt = 0; attempt < 5; attempt++) {
      assert.equal((await post("/login", { token: "wrong" })).status, 401);
    }
    assert.equal((await post("/login", { token })).status, 429);
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
    repository.close();
  }
});

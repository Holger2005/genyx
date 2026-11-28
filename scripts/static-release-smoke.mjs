import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { once } from "node:events";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { auditStatic } from "./static-audit.mjs";
import { createStaticServer } from "./static-server.mjs";

const root = "out";
const files = [...auditStatic(root)].sort();
const server = createStaticServer(root);
const ready = once(server, "listening");
server.listen(0, "127.0.0.1");
await ready;

try {
  const origin = "http://127.0.0.1:" + server.address().port;
  const request = (path, method = "GET") =>
    fetch(origin + path, {
      method,
      redirect: "manual",
      signal: AbortSignal.timeout(5000),
    });
  const entry = await request("/");
  assert.equal(entry.status, 302);
  assert.equal(entry.headers.get("location"), "/es");
  const pages = files.filter((path) => /^(es|en)(?:\/[^.]+)?\.html$/.test(path));
  assert.equal(pages.length, 28, "Expected bilingual public pages");

  for (const path of pages) {
    const response = await request("/" + path.slice(0, -5));
    assert.equal(response.status, 200, path);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html/);
    assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow");
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
    assert.equal(response.headers.get("x-frame-options"), "DENY");
    assert.equal(response.headers.get("referrer-policy"), "strict-origin-when-cross-origin");
    assert.match(response.headers.get("content-security-policy") ?? "", /frame-ancestors 'none'/);
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.deepEqual(bytes, await readFile(join(root, path)), path);
  }

  for (const path of [
    "/fr",
    "/admin",
    "/es/crm",
    "/en/admin",
    "/api/leads",
    "/api/inquiry",
    "/es/products/unavailable",
    "/.env.local",
    "/scripts/admin-start.mjs",
    "/_headers",
    "/_redirects",
  ]) {
    const response = await request(path);
    assert.equal(response.status, 404, path);
    await response.body?.cancel();
  }

  const post = await request("/es/inquiry", "POST");
  assert.equal(post.status, 405);
  const assets = files.filter((path) => /\.(?:js|css|svg)$/.test(path));
  assert.ok(assets.length > 0);
  for (const path of assets) {
    const response = await request("/" + path);
    assert.equal(response.status, 200, path);
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), await readFile(join(root, path)));
  }

  const manifest = [];
  for (const path of files) {
    const bytes = await readFile(join(root, path));
    manifest.push({
      path,
      bytes: bytes.length,
      sha256: createHash("sha256").update(bytes).digest("hex"),
    });
  }
  await mkdir(".artifacts", { recursive: true });
  await writeFile(".artifacts/static-manifest.json", JSON.stringify(manifest, null, 2) + "\n");
  console.log("GENYX static release HTTP checks passed");
  console.log("SHA-256 manifest: .artifacts/static-manifest.json");
} finally {
  server.closeAllConnections();
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
}

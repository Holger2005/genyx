import assert from "node:assert/strict";
import { test } from "node:test";
import { inspectPublicSource } from "../../scripts/public-boundary.mjs";

const page = "src/app/[locale]/page.tsx";

test("allows the reviewed public page and its normal dependencies", () => {
  assert.deepEqual(
    inspectPublicSource(page, 'import { isLocale } from "../../domain/locale";'),
    [],
  );
});

test("rejects unreviewed public admin, intake, and proxy routes", () => {
  for (const path of [
    "src/app/admin/page.tsx",
    "src/app/api/leads/route.ts",
    "src/app/[locale]/crm/page.tsx",
    "src/proxy.ts",
    "middleware.ts",
  ]) {
    assert.ok(inspectPublicSource(path, "").length > 0);
  }
});

test("rejects direct, re-exported, aliased, and dynamic private imports", () => {
  for (const code of [
    'import { SqliteLeadRepository } from "../../infrastructure/crm/sqlite-lead-repository";',
    'export * from "@/application/crm/lead-repository";',
    'const db = await import("node:sqlite");',
    'const sync = require("../../../scripts/crm-sync.mjs");',
    "const module = await import(name);",
  ]) {
    assert.ok(inspectPublicSource(page, code).length > 0);
  }
});

test("blocks private credential references, but permits public contact configuration", () => {
  assert.ok(inspectPublicSource(page, "process.env.GENYX_N8N_TEST_TOKEN").length > 0);
  assert.ok(inspectPublicSource(page, "process.env.NEXT_PUBLIC_ADMIN_SECRET").length > 0);
  assert.deepEqual(inspectPublicSource(page, "process.env.GENYX_GOOGLE_BOOKING_URL"), []);
  assert.deepEqual(inspectPublicSource(page, "process.env.GENYX_WHATSAPP_NUMBER"), []);
});

test("preserves the separate local CRM module", () => {
  assert.deepEqual(
    inspectPublicSource("src/infrastructure/crm/sqlite-lead-repository.ts", 'import "node:sqlite";'),
    [],
  );
});

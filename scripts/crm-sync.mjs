import { mkdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { recordTestLead } from "../src/application/crm/lead-repository.ts";
import { SqliteLeadRepository } from "../src/infrastructure/crm/sqlite-lead-repository.ts";
import { crmDirectory } from "./crm-location.mjs";
import { verifyN8nTest } from "./n8n-crm-bridge.mjs";

try {
  const fixture = JSON.parse(
    await readFile(new URL("../automation/n8n/fixtures/intake-test.json", import.meta.url), "utf8"),
  );
  await verifyN8nTest(fixture, process.env.GENYX_N8N_TEST_TOKEN);

  const directory = crmDirectory();
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const repository = new SqliteLeadRepository(join(directory, "crm-lab.sqlite"));
  try {
    const lead = recordTestLead(repository, fixture, new Date().toISOString());
    console.table([lead]);
    console.log("Verified n8n test classification; synthetic lead stored idempotently");
  } finally {
    repository.close();
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : "CRM synchronization failed");
  process.exitCode = 1;
}

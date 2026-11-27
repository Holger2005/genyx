import { mkdir, readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { moveLead, recordTestLead } from "../src/application/crm/lead-repository.ts";
import { SqliteLeadRepository } from "../src/infrastructure/crm/sqlite-lead-repository.ts";

const directory =
  process.platform === "win32"
    ? join(process.env.LOCALAPPDATA || join(homedir(), "AppData", "Local"), "Genyx")
    : join(homedir(), ".local", "share", "genyx");
const path = join(directory, "crm-lab.sqlite");
const [command = "help", id, stage] = process.argv.slice(2);

if (command === "where") {
  console.log(path);
} else if (!["demo", "list", "move", "history"].includes(command)) {
  console.log(
    "Synthetic CRM only: npm run crm -- demo | list | move <id> <stage> | history <id> | where",
  );
} else {
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const repository = new SqliteLeadRepository(path);
  try {
    if (command === "demo") {
      const fixture = JSON.parse(
        await readFile(
          new URL("../automation/n8n/fixtures/intake-test.json", import.meta.url),
          "utf8",
        ),
      );
      console.table([recordTestLead(repository, fixture, new Date().toISOString())]);
    } else if (command === "list") {
      console.table(repository.list());
    } else if (command === "move") {
      if (!id || !stage) throw new Error("Usage: npm run crm -- move <id> <stage>");
      console.table([moveLead(repository, id, stage, new Date().toISOString())]);
    } else if (command === "history") {
      if (!id || !repository.find(id)) throw new Error("Existing synthetic lead ID required");
      console.table(repository.history(id));
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : "CRM operation failed");
    process.exitCode = 1;
  } finally {
    repository.close();
  }
}

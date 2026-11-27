import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { SqliteLeadRepository } from "../src/infrastructure/crm/sqlite-lead-repository.ts";
import { createAdminServer } from "./admin/server.mjs";
import { crmDirectory } from "./crm-location.mjs";

const token = process.env.GENYX_ADMIN_TOKEN;
if (!/^[a-f0-9]{64}$/.test(token ?? "")) {
  throw new Error("Set GENYX_ADMIN_TOKEN before starting the local dashboard");
}
const directory = crmDirectory();
await mkdir(directory, { recursive: true, mode: 0o700 });
const repository = new SqliteLeadRepository(join(directory, "crm-lab.sqlite"));
const server = createAdminServer(repository, token);
server.on("error", (error) => {
  repository.close();
  console.error(error.message);
  process.exitCode = 1;
});
server.listen(3210, "127.0.0.1", () => {
  console.log("GENYX CRM laboratory: http://127.0.0.1:3210");
  console.log("Local synthetic records only. Stop with Ctrl+C.");
});

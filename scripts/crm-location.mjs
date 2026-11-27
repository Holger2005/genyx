import { homedir } from "node:os";
import { join } from "node:path";

export function crmDirectory() {
  return process.platform === "win32"
    ? join(process.env.LOCALAPPDATA || join(homedir(), "AppData", "Local"), "Genyx")
    : join(homedir(), ".local", "share", "genyx");
}

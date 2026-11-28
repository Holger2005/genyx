import { posix } from "node:path";

const prohibitedFiles = [
  /(?:^|\/)\.env(?:\.[^/]+)?$/i,
  /\.(?:pem|key|p12|pfx|sqlite(?:-wal|-shm|-journal)?|sqlite3|db|dump|bak)$/i,
  /(?:^|\/)(?:\.n8n|\.supabase|\.vercel|\.wrangler|backups?)\//i,
];

const secretPatterns = [
  ["private key", /-----BEGIN (?:[A-Z0-9]+ )*PRIVATE KEY-----/],
  ["GitHub credential", /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})\b/],
  ["Supabase secret", /\bsb_secret_[A-Za-z0-9_-]{15,}\b/],
  ["AWS access key", /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/],
  ["Google OAuth credential", /\bGOCSPX-[A-Za-z0-9_-]{20,}\b/],
  ["database URL with password", /\bpostgres(?:ql)?:\/\/[^\s:/]+:[^\s@/]+@/i],
  [
    "Genyx operator credential",
    /\bGENYX_(?:ADMIN_TOKEN|N8N_TEST_TOKEN)\s*[:=]\s*["']?[a-f0-9]{64}\b/i,
  ],
];

export function inspectTrackedFile(path, content) {
  const issues = [];
  const name = posix.basename(path);
  if (name !== ".env.example" && prohibitedFiles.some((pattern) => pattern.test(path))) {
    issues.push("private artifact");
  }

  if (typeof content === "string") {
    for (const [kind, pattern] of secretPatterns) {
      if (pattern.test(content)) issues.push(kind);
    }
    if (name === ".env.example") {
      for (const line of content.split(/\r?\n/)) {
        if (!line.trim() || line.trimStart().startsWith("#")) continue;
        if (!/^GENYX_(?:GOOGLE_BOOKING_URL|WHATSAPP_NUMBER)=$/.test(line.trim())) {
          issues.push("environment example must contain only empty approved public settings");
        }
      }
    }
  }
  return [...new Set(issues)];
}

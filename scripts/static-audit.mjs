import { lstatSync, readFileSync, readdirSync } from "node:fs";
import { join, posix } from "node:path";
import { inspectTrackedFile } from "./secret-policy.mjs";

const pages = [
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
const expected = new Set(
  ["es", "en"].flatMap((locale) => pages.map((page) => locale + page + ".html")),
);
expected.add("index.html");
expected.add("404.html");

export function auditStatic(root) {
  const found = new Set();
  function walk(directory, prefix = "") {
    for (const entry of readdirSync(directory)) {
      const path = join(directory, entry);
      const relative = prefix + entry;
      const stat = lstatSync(path);
      if (stat.isDirectory()) {
        walk(path, relative + "/");
        continue;
      }
      if (!stat.isFile() || stat.isSymbolicLink()) {
        throw new Error("Unexpected static entry: " + relative);
      }
      const allowed =
        expected.has(relative) ||
        relative === "_not-found.html" ||
        ["_headers", "_redirects"].includes(relative) ||
        /^_next\/static\/[A-Za-z0-9_./-]+\.(?:js|css|woff2?|ttf|otf|png|svg|webp|json)$/.test(
          relative,
        ) ||
        /^media\/genyx\/(?:architecture|graphics)-(?:es|en)\.svg$/.test(relative) ||
        (/\.txt$/.test(relative) &&
          /^(?:index\.txt|404\.txt|_not-found(?:[./])|(?:es|en)(?:[./])|__next\.)/.test(relative));
      if (
        !allowed ||
        /^(?:(?:es|en)\/)?(?:admin|crm|api|supabase|automation|scripts)(?:\/|\.)/.test(relative)
      ) {
        throw new Error("Unapproved static artifact: " + relative);
      }
      const bytes = readFileSync(path);
      if (bytes.length > 25 * 1024 * 1024) throw new Error("Oversized static asset: " + relative);
      const text = bytes.includes(0) ? undefined : bytes.toString("utf8");
      if (inspectTrackedFile(posix.normalize(relative), text).length) {
        throw new Error("Credential or private artifact detected: " + relative);
      }
      if (expected.has(relative) && relative !== "404.html") {
        if (!text?.includes("noindex")) throw new Error("Missing noindex: " + relative);
        if (relative !== "index.html" && !text.includes(`lang="${relative.slice(0, 2)}"`)) {
          throw new Error("Incorrect page language: " + relative);
        }
      }
      found.add(relative);
    }
  }
  walk(root);
  for (const path of [...expected, "_headers", "_redirects"]) {
    if (!found.has(path)) throw new Error("Missing static artifact: " + path);
  }
  if (!readFileSync(join(root, "_headers"), "utf8").includes("X-Robots-Tag: noindex, nofollow")) {
    throw new Error("Preview must remain noindex");
  }
  console.log("GENYX static deployment artifact checks passed");
  return found;
}

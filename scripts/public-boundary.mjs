import { posix } from "node:path";
import ts from "typescript";

const approvedPages = new Set([
  "src/app/(entry)/page.tsx",
  "src/app/(entry)/layout.tsx",
  "src/app/[locale]/layout.tsx",
  "src/app/[locale]/page.tsx",
  "src/app/[locale]/projects/page.tsx",
  "src/app/[locale]/projects/[slug]/page.tsx",
  "src/app/[locale]/services/page.tsx",
  "src/app/[locale]/services/[slug]/page.tsx",
  "src/app/[locale]/products/page.tsx",
  "src/app/[locale]/products/[slug]/page.tsx",
  "src/app/[locale]/inquiry/page.tsx",
  "src/app/[locale]/consultation/page.tsx",
  "src/app/[locale]/privacy/page.tsx",
]);

const privatePath = /^src\/(domain|application|infrastructure)\/crm\//;
const sourceFile = /\.[cm]?[jt]sx?$/;
const sensitiveConfig = /\b(?:GENYX_N8N_TEST_TOKEN|NEXT_PUBLIC_[A-Z0-9_]*(?:TOKEN|SECRET|PASSWORD|PRIVATE_KEY))\b/;

export function inspectPublicSource(path, content) {
  if (!sourceFile.test(path) || privatePath.test(path)) return [];
  const errors = [];
  const file = posix.basename(path);
  if (
    path.startsWith("src/app/") &&
    /^(page|layout|route)\.[cm]?[jt]sx?$/.test(file) &&
    !approvedPages.has(path)
  ) {
    errors.push("Unapproved public route or layout");
  }
  if (/^(src\/)?(?:proxy|middleware)\.[cm]?[jt]sx?$/.test(path)) {
    errors.push("Review public request interception before adding it");
  }
  if (sensitiveConfig.test(content)) errors.push("Private credential referenced in public source");

  const source = ts.createSourceFile(path, content, ts.ScriptTarget.Latest, true);
  function checkSpecifier(node) {
    if (!node || !ts.isStringLiteralLike(node)) {
      errors.push("Nonliteral module reference requires boundary review");
      return;
    }
    const value = node.text;
    const target = value.startsWith("@/")
      ? "src/" + value.slice(2)
      : value.startsWith(".")
        ? posix.normalize(posix.join(posix.dirname(path), value))
        : value;
    if (privatePath.test(target + "/") || /^(?:node:)?sqlite$/.test(value)) {
      errors.push("Private CRM or SQLite imported into public source");
    }
    if (/^(?:scripts|automation)\//.test(target)) {
      errors.push("Operator or automation module imported into public source");
    }
  }

  function visit(node) {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
      if (node.moduleSpecifier) checkSpecifier(node.moduleSpecifier);
    }
    if (ts.isCallExpression(node)) {
      const dynamic = node.expression.kind === ts.SyntaxKind.ImportKeyword;
      const requireCall = ts.isIdentifier(node.expression) && node.expression.text === "require";
      if (dynamic || requireCall) checkSpecifier(node.arguments[0]);
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  return errors;
}

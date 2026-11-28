# GENYX · v0.4.0

Bilingual Genyx corporate platform — Sprint 3 commercial integration laboratory.
Includes the portfolio, project questionnaire, consultation page, optional Calendar and WhatsApp
links, and local synthetic n8n/CRM tooling. No production deployment or real intake is enabled.
All rights reserved.

## Start locally (Windows / macOS / Linux)

Install Git, VS Code and Node.js 22 LTS (22.12+) or Node.js 24 (24.x).
Node.js 22 remains the default in the version files. Both supported major versions are tested in CI.

```bash
git clone https://github.com/Holger2005/genyx.git
cd genyx
npm ci
npm run check
npm run audit:security
npm run dev
```

Open http://localhost:3000 (redirects to `/es`); `/en` is the English version.
The committed lockfile provides reproducible dependency installation. Use `npm install`
only when intentionally changing dependencies and review the resulting lockfile diff.
Do not ignore audit errors. Run `npm run format` before committing changes.
`npm run test:foundation` and `npm run architecture` run without third-party packages.

## Browser smoke checks

Install Chrome or Chromium and use Node.js 24. Run:

```bash
npm run build
npm run test:browser
```

Set `CHROME_PATH` to the browser executable if necessary. The smoke test uses port 3190
and checks the compiled site, not the development server. CI runs it on Node.js 24.

## GitHub workflow

- `main`: stable baseline; changes must be reviewed through pull requests.
- `develop`: integration branch.
- `feature/*`: feature branches; `fix/*`: maintenance branches.

Use a feature branch and submit a pull request to `develop`; integrate verified changes
into `main` through a separate pull request. Check both Node.js jobs and CodeQL before merging.
Never commit secrets. Do not bypass failing checks or force-push the main branch.

Dependabot groups compatible Vitest updates and defers selected major version migrations.
Evaluate security advisories promptly and review dependency changes before merging.

Main branch protection is active. The repository owner must verify remaining security settings.
See [Sprint 0](docs/sprint-0.md) for the outstanding gates.

## Lighthouse audits

The Node.js 24 CI job runs the pinned Lighthouse CLI against the production build.
Reports are uploaded for review, including failed audit runs. See the
[release checklist](docs/releases/v0.4.0.md) for thresholds and limitations.

## Appointment scheduling

See [Google Calendar setup](docs/google-calendar.md) for the optional booking link.
Reservations remain disabled without an approved configuration.

## WhatsApp contact

See [WhatsApp setup](docs/whatsapp.md) for the optional business number.

## Automation laboratory

See [n8n setup](docs/n8n.md) for the optional local synthetic intake workflow.

## CRM laboratory

Use `npm run crm -- demo` to create a local synthetic opportunity. See
[CRM setup](docs/crm.md) for the available commands and safety limitations.

## Security and privacy laboratory

See [commercial security gates](docs/commercial-security.md) for the local n8n-to-CRM bridge.
Run `npm run security:check` and `npm run test:security` for the tracked-file security gate.
See [security and privacy readiness](docs/security-privacy.md) for the launch checklist.
Real customer intake remains disabled.

## Production architecture

See [deployment architecture](docs/production-architecture.md) for the proposed
public static deployment, private administration boundary and hosting decisions.
Run `npm run test:boundary` to test the source-level isolation guard.

## Local administrative dashboard

See [local admin setup](docs/admin.md) for the authenticated synthetic CRM dashboard.
It is a separate loopback-only process, never a public Next.js route.

## PostgreSQL foundation

See [PostgreSQL setup](docs/postgres.md) for the synthetic-only migration and
isolated Docker checks. See [n8n PostgreSQL bridge](docs/n8n-postgres.md) for a live
synthetic integration test. The local dashboard still uses SQLite.

## Static preview

Run `npm run build:static` and `npm run preview:static` for the isolated public
site candidate. See [deployment setup](docs/deployment.md). Rebuild with
`npm run build` before running the normal Next.js server.

## Content management

Edit bilingual content through the [Git-based editorial workflow](docs/content-management.md).
Run `npm run test:content` before submitting a content change.

## Architecture

See [architecture](docs/architecture.md), [Sprint 0](docs/sprint-0.md), and [security](SECURITY.md).
See [Sprint 1](docs/sprint-1.md) and the [release checklist](docs/releases/v0.2.0.md).
See [Sprint 2](docs/sprint-2.md) and the [v0.3.0 release checklist](docs/releases/v0.3.0.md).
See [Sprint 3](docs/sprint-3.md) and the [v0.4.0 release checklist](docs/releases/v0.4.0.md).
The prototype is not a production-ready commercial site.

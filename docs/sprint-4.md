# Sprint 4 — Production and launch

## 4.1 — Production architecture

The proposed deployment separates the read-only website from the administrative
backend. Cloudflare Pages Free is the initial static hosting candidate; Vercel
Pro remains the budget-dependent alternative. The current Node build is kept
unchanged. The public source boundary guard is integrated into architecture
checks and exercised in CI.

See [production architecture](production-architecture.md) for the provider
assessment, source links, trust boundaries, and static-export acceptance gates.

## 4.2 — Local authenticated dashboard

A separate loopback-only Node HTTP process exposes a server-rendered administrative
dashboard for synthetic CRM records. A randomly generated local token opens a
30-minute in-memory session. Login attempts are limited, mutating requests
require the same origin and CSRF token, and logout revokes the session.
The public application remains unchanged. See [admin setup](admin.md).

## 4.3 — PostgreSQL foundation

The private synthetic CRM schema adds explicit membership, owner-scoped RLS,
column grants, derived priority and database-enforced stage history. The
isolated PostgreSQL 17 test runs with a test-only Supabase Auth shim.
See [database setup](postgres.md). Cloud provisioning and the production
adapter remain separate acceptance gates.

## 4.4 — Synthetic n8n PostgreSQL integration

An invoker-rights ingestion function preserves owner isolation and handles exact
replays without resetting the stage or duplicating history. The local operator
can validate a live n8n response before exercising the database in a disposable
container. CI uses an explicitly simulated response. See [integration setup](n8n-postgres.md).
A hosted adapter and real commercial intake remain disabled.

## 4.5 — Security and privacy readiness

The tracked-file security gate and regression tests are included in quality checks.
The public source guard rejects database credentials and private migration imports.
See [security and privacy readiness](security-privacy.md) for the risk, retention,
incident response and commercial release approval checklist.
Production compliance and hosted security controls are not yet verified.

## 4.6 — Static deployment candidate

The optional static profile builds and audits an export with Cloudflare Pages
configuration and a loopback preview. The empty product detail route is removed
until actual products are approved. Normal Node builds remain supported.
See [deployment setup](deployment.md). No hosting or DNS is configured yet.

## 4.7 — SEO and performance readiness

Localized social metadata, unique page titles and static asset budgets are
checked in the export. All preview pages remain noindex. Canonical URLs,
hreflang and sitemap publication require the approved domain and launch review.
See [SEO readiness](seo.md). Existing Lighthouse budgets are unchanged.

## 4.8 — Customer acquisition readiness

A Spanish sales playbook defines proposed segments, four-week goals, permitted
manual channels, consultation and proposal templates. An operator-only estimate
CLI accepts explicit inputs and stores nothing. No messages are sent, no
prospects are imported and no actual prices or revenue are claimed.
See [sales playbook](sales-playbook.md).

## Remaining work

- Build and validate the static deployment profile before any public deployment.
- Design authenticated private administration and durable production storage.
- Add actual intake only after privacy, authorization, rate limits, retention,
  backup and operational gates are approved.
- Review external providers and data handling, real-device accessibility,
  contact identity, SEO and the final commercial publication decision.

No production service or customer-data collection is enabled by Sprint 4.1.

# Sprint 4.4 — n8n PostgreSQL integration laboratory

This phase connects the existing local n8n test workflow to the PostgreSQL
integration checks. It does not expose a new webhook, deploy Supabase, migrate
the SQLite database or enable real prospect collection.

## Contract

The operator sends the checked-in synthetic fixture to the fixed loopback
test webhook using the existing header-auth credential. The bridge verifies
the response and derives the expected priority before starting PostgreSQL.
A failed response stops the command before any database container is created.

The database migration adds `genyx_crm.record_test_lead` with invoker privileges,
a fixed search path and an explicit operator membership requirement. It uses
existing column grants and RLS. Ingestion is scoped to the authenticated owner.
Exact replay preserves the existing lead and audit history. Conflicting IDs are
rejected. The schema stays private and the RPC must not be added to exposed APIs.

## Local commands

Start Docker Desktop. The automated tests use a simulated webhook response:

```powershell
npm run test:postgres
```

For a live test, ensure the existing n8n instance is running and the matching
`GENYX_N8N_TEST_TOKEN` is set in the current PowerShell session. If necessary,
generate a fresh key locally and update the n8n Header Auth credential. Do not
share it. Click Listen for test event in the existing workflow, then run:

```powershell
npm run crm:postgres:lab
```

The command checks the real n8n response, creates an isolated PostgreSQL 17
container, applies both migrations and exercises authorization, stage history,
exact replay, conflict rejection and owner isolation using synthetic identities.
The test transactions roll back and the temporary container is removed. The
operator's SQLite records and n8n workflow remain unchanged.

Expected messages include:

- Live n8n response verified (live mode only).
- GENYX PostgreSQL authorization and history checks passed.
- GENYX n8n PostgreSQL ingestion and replay checks passed.

## Production gates

A real Supabase project, JWT-authenticated database access adapter, credentials
with restricted privileges, retry/reconciliation strategy, retention and
deletion, abuse controls, backups, monitoring and privacy approval are still
required. No real customer data is stored by this laboratory. The existing
dashboard continues to use SQLite. The test Auth shim is not real Supabase
Auth and must never be deployed to a hosted project.

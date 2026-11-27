# Genyx local CRM laboratory

The first CRM is a local administrative CLI using the SQLite module built into
Node.js. It is intentionally restricted to synthetic test envelopes matching
the n8n fixture. No contact details, free-text notes, actual customer data,
public administration page, online synchronization or automatic webhook
persistence is supported.

## Start

Use the supported Node.js 22.12+ or 24.x. Run:

```powershell
npm run check
npm run crm -- where
npm run crm -- demo
npm run crm -- list
npm run crm -- move genyx-test-001 contacted
npm run crm -- history genyx-test-001
```

The demo imports the existing synthetic fixture. Repeating it is idempotent;
it does not reset the stage or duplicate history. An existing identifier with
different data is rejected. The stage sequence is new, contacted, consultation,
proposal, won. Any open stage can transition to lost. Won and lost are terminal.

On Windows the database defaults to LOCALAPPDATA/Genyx/crm-lab.sqlite. On
other systems it is stored under ~/.local/share/genyx/crm-lab.sqlite.
Use the where command for the actual path. It is outside the repository by
default; SQLite files are also gitignored. Local OS access restrictions apply.
The database is not encrypted and there is no user authentication layer.
Never insert actual customer data into this laboratory.

## Architecture

- Domain: exact synthetic envelope validation, priority and stage rules.
- Application: repository contract, record and stage use cases.
- Infrastructure: parameterized SQLite queries, unique primary key and atomic
  transactions for creation, compare-and-set stage updates and history.
- Administration: local CLI only.

Unit tests cover validation, persistence, duplicate IDs, transitions, history
and reopened SQLite connections. The n8n test workflow remains unchanged and
does not write to this database. The demo imports the same fixture locally,
not a live webhook result.

## Before enabling real intake

Approve the privacy notice, data categories, consent/legal basis, retention,
backup and deletion procedures, access control and authentication, webhook
authentication and replay protection, rate limits, validated delivery, audit
logging and durable production storage. A local SQLite database is not a
multi-instance deployment strategy. The production adapter may be different.

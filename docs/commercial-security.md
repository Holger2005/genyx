# Commercial security and privacy gates

## Local synthetic bridge

The existing n8n workflow accepts synthetic data only. The CRM database stores
synthetic data only. The bridge is a local operator command, not a public API.
It sends the checked-in test fixture to the existing loopback test webhook and
verifies all expected response fields before recording the lead. A failed
authentication, timeout, malformed response or mismatched classification must
prevent the write. A repeated successful request keeps the existing CRM stage
and history. No automatic retry or background process is enabled.

In PowerShell, keep the same header-auth credential configured in n8n.
If the token was exposed, rotate it. Generate a fresh 32-byte hexadecimal token
locally, copy it into the Header Auth credential and do not share it.

```powershell
$env:GENYX_N8N_TEST_TOKEN = node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Click Listen for test event in the existing n8n workflow, then run:

```powershell
npm run crm:sync
npm run crm -- list
npm run crm -- history genyx-test-001
```

The listener is temporary; activate it again before repeating the bridge command.
Run npm run test:bridge to exercise the response contract with simulated HTTP
responses, without contacting a real n8n instance. The live command requires
a correctly configured local n8n. Remove the environment variable when done.

```powershell
Remove-Item Env:GENYX_N8N_TEST_TOKEN
```

## Current boundaries

- No network-exposed CRM or browser administrator interface.
- Local OS account is the administrative boundary; no application-level login.
- SQLite is not encrypted. Never store actual customer data in this laboratory.
- No public form submission, real lead processing, third-party tracking added by
  this phase, or automatic outbound messages.
- The prototype privacy page is descriptive, not a final legal privacy policy.

## Commercial release blockers

Before enabling real intake, identify the actual data controller, establish the
applicable legal basis and privacy notice, define retention and deletion, choose
private durable production storage, implement authentication and authorization,
secure backups, TLS, server-side validation, abuse controls, rate limits and
request deduplication, and configure secret rotation and incident response.
Verify the actual hosting and external provider data handling. Review applicable
Ecuadorian personal-data obligations with appropriate legal expertise.
Do not treat the laboratory or its notice as legal compliance certification.

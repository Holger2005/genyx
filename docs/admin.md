# Local Genyx CRM dashboard — Sprint 4.2

This is an independent local Node HTTP server, not a Next.js admin route.
It listens only on 127.0.0.1:3210 and uses the existing synthetic SQLite
database. Do not expose it through tunnels, port forwarding, a reverse proxy
or public hosting. Never insert real customer data.

## Start on Windows

Run from the repository root:

```powershell
npm run test:admin
npm run crm -- demo
$env:GENYX_ADMIN_TOKEN = node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
$env:GENYX_ADMIN_TOKEN
npm run admin
```

Open http://127.0.0.1:3210 (use this exact host, not localhost). Paste the local
token into the login field. Do not share the token or commit it. This key is
separate from the n8n credential. Stop the server with Ctrl+C and remove the
environment variable when done.

```powershell
Remove-Item Env:GENYX_ADMIN_TOKEN
```

## Features and boundaries

- Dashboard counts for all, open, won and lost synthetic opportunities.
- View the existing records and transition history.
- Advance the same stage rules used by the CLI.
- Random local access key, one in-memory session, fixed 30-minute expiry,
  logout revocation, login rate limiting, host/origin checks, CSRF verification.
- HttpOnly, SameSite=Strict session cookie, no browser storage and no-store
  responses. The cookie is not Secure because this laboratory uses loopback HTTP.
- Escaped HTML, bounded form bodies, restrictive response headers and no scripts.

The token is held in process memory. This is not a multi-user account system,
MFA, durable identity service or production authorization layer. SQLite is
not encrypted. The local OS account remains the trust boundary. For commercial
administration, implement approved TLS, managed identity, role-based access,
private durable storage, backups and appropriate retention before real intake.

Tests exercise actual loopback HTTP with an in-memory database and generated
test credentials. They do not certify production security.

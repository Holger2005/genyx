# Genyx n8n intake laboratory

This is a test-only workflow, not a deployed CRM or a public lead intake API.
It uses three built-in n8n nodes: authenticated Webhook, Code, Respond to Webhook.
No credentials, personal information, production URL or third-party messages
are embedded. The workflow is inactive and has execution persistence disabled
in its settings. Manual editor views can still show test data.

## Local setup

Install Docker Desktop or use an existing supported local n8n installation.
Follow the current official Docker installation documentation:
https://docs.n8n.io/deploy/host-n8n/install-options/install-using-docker-compose

For local experimentation only, bind the service to loopback, not all interfaces:

```powershell
docker volume create genyx_n8n_data
docker run --rm -it --name genyx-n8n -p 127.0.0.1:5678:5678 -e GENERIC_TIMEZONE=America/Guayaquil -e TZ=America/Guayaquil -v genyx_n8n_data:/home/node/.n8n docker.n8n.io/n8nio/n8n:2.49.7
```

Create your local owner account at http://localhost:5678. Keep the service private.
Review the n8n license for your intended use and update to a supported patched
version before any production hosting. The example image tag is a starting
point, not a verified deployment in this repository.

## Import and test

1. In n8n import automation/n8n/genyx-intake-test.json from file.
2. Open Authenticated test webhook. Select Header Auth and create a credential
   with header name X-Genyx-Token.
3. In a separate PowerShell terminal at the Genyx project root generate a token:

   ```powershell
   $env:GENYX_N8N_TEST_TOKEN = node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
   ```

4. Copy that value into the credential's secret field locally. Never commit or
   share it. Keep this terminal open.
5. Keep the workflow unpublished. Select Listen for test event on the Webhook.
6. In the same terminal run npm run test:n8n. The script sends only the checked-in
   synthetic fixture to the fixed loopback test URL, and expects a high-priority
   new classification with persisted=false.
7. Remove the terminal variable when finished:

   ```powershell
   Remove-Item Env:GENYX_N8N_TEST_TOKEN
   ```

## Production gates

No actual customer data may be submitted to this workflow. Authentication must
be configured before the test listener is enabled. Confirm the imported node
versions, verify that a missing or wrong credential is rejected, and inspect
the returned response. The repository unit tests execute the trusted exported
Code node using Node's VM; they do not run n8n or verify its authentication.

The next phase must define a durable private lead store, idempotency, retention,
authorization, validated delivery and an approved privacy notice. Public form
submission also requires server-side validation, abuse controls, TLS, error
handling and secure credential storage. Do not expose this local webhook to
the internet or publish the workflow for real intake.

Official webhook reference:
https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/

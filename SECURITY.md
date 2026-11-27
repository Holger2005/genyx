# Security policy

Genyx v0.1 is a development foundation, not a production-ready service.
Do not disclose credentials, customer data or vulnerability details in public issues.
Use GitHub private vulnerability reporting when enabled; otherwise contact the repository owner privately.
Never commit secrets. Rotate compromised credentials immediately; deleting a file does not erase Git history.

## Before production

- Enable private vulnerability reporting, secret scanning and push protection where available.
- Require CI checks and review for changes to `main` when collaborators are available.
- Verify CSP, HTTPS/HSTS, dependency audit, backups, incident response and applicable privacy requirements.
- Establish authenticated server-to-server webhooks before integrating n8n.
- Review applicable OWASP ASVS level 2 controls; no certification is claimed.

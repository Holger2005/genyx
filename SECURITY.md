# Security policy

Genyx v0.4 is a commercial integration laboratory, not a production-ready service.
Do not disclose credentials, customer data or vulnerability details in public issues.
Use GitHub private vulnerability reporting when enabled; otherwise contact the repository owner privately.
Never commit secrets. Rotate compromised credentials immediately; deleting a file does not erase Git history.

## Repository controls

- Maintain active branch protection on `main`, requiring pull requests and passing CI checks.
- Verify secret scanning, push protection, Dependabot alerts and private vulnerability reporting.
- Review dependency changes and coordinate major migrations; do not use forced npm resolutions.
- Keep GitHub Actions pinned to reviewed full commit SHAs and evaluate updates through pull requests.
- Use least-privilege workflow permissions, no persisted checkout credentials and no secrets in untrusted PR workflows.

The tracked-file security gate checks selected secret formats and prohibited artifact paths.
It is not a full history scan or a substitute for platform secret scanning.
See [security and privacy readiness](docs/security-privacy.md).

## Before production

- Verify CSP, HTTPS/HSTS, dependency audit, backups, incident response and applicable privacy requirements.
- Keep the authenticated n8n and CRM laboratory local and synthetic; production intake requires
  separate authentication, authorization, durable storage, retention and abuse controls.
- Review applicable OWASP ASVS level 2 controls; no certification is claimed.

# Sprint 4.5 — Security and privacy readiness

Status: laboratory controls and pre-launch checklist. Not a compliance opinion,
a production security certification, or approval to process real customer data.

## Scope and responsibility

Genyx currently has a read-only public prototype, optional external contact
links, a local SQLite dashboard, n8n and a disposable PostgreSQL test harness.
No hosted CRM is connected. Do not enter personal or confidential information
into the laboratory. Hosting providers may independently process access logs
and metadata even when the application has no intake endpoint.

Before any public commercial launch, identify the actual controller, business
contact details, purposes and legal basis for each processing activity. Review
the Ecuadorian LOPDP, its General Regulation and applicable current SPDP rules.
Provide the information required by article 12 before collecting personal
data; document retention, rights requests, transfers and recipients. Determine
whether a data protection officer or an impact assessment is required for
the actual activity. Review provider contracts and international transfers.

Official references reviewed on 2026-11-27:

- https://www.spdp.gob.ec/docs/proteccion-de-datos-personales/general/normativa/
- https://www.spdp.gob.ec/docs/consultas-absueltas/2026-2/oficio-n-spdp-ird-2026-0001-o/
- https://www.spdp.gob.ec/docs/proteccion-de-datos-personales/general/seguridad-e-incidentes/
- https://www.spdp.gob.ec/docs/guias/2025-2/gestion-de-riesgos-y-evaluacion-de-impacto-del-tratamiento-de-datos-personales-version-2/

## Data inventory and proposed retention

| Activity            | Current status                 | Decision before production                            |
| ------------------- | ------------------------------ | ----------------------------------------------------- |
| Local questionnaire | Browser draft only             | No sensitive or confidential data                     |
| Contact links       | Optional external providers    | Review Google and WhatsApp notices and transfers      |
| Lead CRM            | Synthetic only                 | Approve minimum fields and purpose-specific retention |
| Operator identity   | Temporary local token          | Managed identity, MFA, least privilege and revocation |
| Security events     | Local/test only                | Minimal event metadata and protected logs             |
| Backups             | No verified production restore | Encrypt, restrict access, test recovery and deletion  |

Proposal for future review: remove inactive prospect data after 90 days unless
a documented lawful purpose requires longer retention. Review operational
logs after 30 days. These are proposed internal targets, not statutory periods
or implemented automatic deletion. Contract, tax and legal obligations may
require separate retention. Do not adopt these periods without approval.

## Incident response

1. Contain the affected service, revoke compromised credentials and prevent
   further exposure without destroying necessary evidence.
2. Record time of awareness, scope, affected data, systems and actions using
   restricted storage. Do not include secrets in tickets or public issues.
3. Evaluate risk to individuals and preserve a minimal incident record.
4. Consult current Ecuadorian notification rules and deadlines immediately;
   notify competent recipients and affected persons when required. Confirm
   current law and applicable exceptions with qualified counsel.
5. Restore from a verified clean backup, validate access controls, document
   lessons and review corrective actions.

## Automated repository gate

Run `npm run security:check` and `npm run test:security`. The tracked-file
scanner checks the working tree for selected credential formats and private
artifact paths; it reports only a filename and category. CI checks the committed
checkout. It does not inspect Git history, ignored files, encoded secrets or all
credential formats, and is not a replacement for GitHub secret scanning or push
protection. Review staged changes and rotate any exposed credential.

## Release approval gates

- [ ] Confirm controller identity, privacy contact and applicable legal basis.
- [ ] Review provider processing terms, logging and cross-border transfers.
- [ ] Approve privacy notice and rights-request process.
- [ ] Approve risk assessment, retention and deletion procedures.
- [ ] Verify production authentication, MFA, TLS and role isolation.
- [ ] Verify encrypted backup and restore drill.
- [ ] Enable and verify provider security settings and incident notification procedure.
- [ ] Validate static export, deployment artifact and actual security headers.
- [ ] Obtain owner approval before commercial publication or real intake.

No boxes are automatically marked complete merely because CI passes.

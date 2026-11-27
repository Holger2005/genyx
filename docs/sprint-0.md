# Sprint 0 — Acceptance checklist

## Verified baseline

Commit [788ee9f](https://github.com/Holger2005/genyx/commit/788ee9f19269ba4bdb065b7f10794e1b04bc32c7).

- [x] Source scaffold and separated layers.
- [x] TypeScript strict configuration.
- [x] ESLint, Prettier, Vitest and baseline architecture checks configured.
- [x] Bilingual minimal shell, no marketing claims or external requests.
- [x] Security header baseline, Dependabot and CodeQL workflow definitions.
- [x] Resolve dependencies and commit `package-lock.json`.
- [x] Local lint, formatting, types, coverage, build and dependency audit reported successful.
- [x] Public GitHub repository and initial commit.
- [x] CI on Node.js 22 and 24 ([run](https://github.com/Holger2005/genyx/actions/runs/45919930709)).
- [x] CodeQL workflow completed ([run](https://github.com/Holger2005/genyx/actions/runs/45919930839)).

The baseline CI jobs passed. Local Vitest reported 3 passing tests and 100% coverage
of the selected domain/application code, not of the entire platform.
The dependency audit reported no vulnerabilities at that time. These results do
not establish that the application is free of vulnerabilities.

## Maintenance changes (merged)

- Group compatible Vitest updates and defer selected major migrations.
- Pin workflow actions to full commit SHAs observed in the successful baseline runs.
- Disable checkout credential persistence and scope CodeQL permissions to its job.
- Update developer documentation for the existing repository and supported Node versions.

## Closure gates

- [x] Verify CI and CodeQL on the maintenance pull request and merge only after successful checks ([PR #8](https://github.com/Holger2005/genyx/pull/8)).
- [x] Activate the branch ruleset targeting the default branch; verify effective main protection ([ruleset](https://github.com/Holger2005/genyx/rules/28204206)).
- [ ] Verify Dependabot alerts/security updates, secret scanning, push protection and private vulnerability reporting in repository settings.
- [ ] Review or defer incompatible open Dependabot pull requests; do not merge failing updates.
- [x] Development branches incorporate the accepted maintenance changes (equivalent tree after rebase).

Sprint 0 is not administratively closed until these gates are verified.

## Production gates (later)

CSP script/style policy and HTTPS/HSTS must be verified in the actual deployment.
The current partial CSP is not full XSS protection. No form endpoint exists yet.
Review pinned GitHub Actions periodically and keep dependency security updates current.
Performance: LCP <= 2.5 s, INP <= 200 ms, CLS <= 0.1; verify on real devices.
No guarantee of 60 FPS across every device. Use static fallback when necessary.

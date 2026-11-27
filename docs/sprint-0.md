# Sprint 0 — Acceptance checklist

- [x] Source scaffold and separated layers.
- [x] TypeScript strict configuration.
- [x] ESLint, Prettier, Vitest and baseline architecture checks configured.
- [x] Bilingual minimal shell, no marketing claims or external requests.
- [x] Security header baseline, Dependabot and CodeQL workflow definitions.
- [ ] Resolve dependencies and commit `package-lock.json`.
- [ ] Run full local checks: lint, formatting, types, coverage, build and dependency audit.
- [ ] Create public GitHub repository and push initial commit.
- [ ] Verify GitHub Actions results and enable repository security settings.

## Production gates (later)

CSP script/style policy and HTTPS/HSTS must be verified in the actual deployment.
The current partial CSP is not full XSS protection. No form endpoint exists yet.
Pin GitHub Actions to reviewed immutable commit SHAs before production.
Performance: LCP <= 2.5 s, INP <= 200 ms, CLS <= 0.1; verify on real devices.
No guarantee of 60 FPS across every device. Use static fallback when necessary.

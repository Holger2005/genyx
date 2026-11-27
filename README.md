# GENYX · v0.1.0

Technical foundation for the bilingual Genyx corporate platform. Sprint 0 only.
No production deployment or external services configured. All rights reserved.

## Start locally (Windows / macOS / Linux)

Install Git, VS Code and Node.js 22 LTS (22.12+) or Node.js 24 (24.x).
Node.js 22 remains the default in the version files. Both supported major versions are tested in CI.

```bash
git clone https://github.com/Holger2005/genyx.git
cd genyx
npm ci
npm run check
npm run audit:security
npm run dev
```

Open http://localhost:3000 (redirects to `/es`); `/en` is the English shell.
The committed lockfile provides reproducible dependency installation. Use `npm install`
only when intentionally changing dependencies and review the resulting lockfile diff.
Do not ignore audit errors. Run `npm run format` before committing changes.
`npm run test:foundation` and `npm run architecture` run without third-party packages.

## GitHub workflow

- `main`: stable baseline; changes must be reviewed through pull requests.
- `develop`: integration branch.
- `feature/*`: feature branches; `fix/*`: maintenance branches.

Use a feature branch and submit a pull request to `develop`; integrate verified changes
into `main` through a separate pull request. Check both Node.js jobs and CodeQL before merging.
Never commit secrets. Do not bypass failing checks or force-push the main branch.

Dependabot groups compatible Vitest updates and defers selected major version migrations.
Evaluate security advisories promptly and review dependency changes before merging.

The repository owner must activate main branch protection and verify available security settings.
See [Sprint 0](docs/sprint-0.md) for the outstanding gates.

## Architecture

See [architecture](docs/architecture.md), [Sprint 0](docs/sprint-0.md), and [security](SECURITY.md).
The minimal monochrome interface is temporary; the interactive 3D prototype is Sprint 1.

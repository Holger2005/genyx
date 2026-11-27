# GENYX · v0.1.0

Technical foundation for the bilingual Genyx corporate platform. Sprint 0 only.
No production deployment or external services configured. All rights reserved.

## Start locally (Windows / macOS / Linux)

Install Git, VS Code and Node.js 22 LTS (22.12+). From the project directory:

```bash
npm install
npm run format
npm run check
npm run audit:security
npm run dev
```

Open http://localhost:3000 (redirects to `/es`); `/en` is the English shell.
The first `npm install` creates `package-lock.json`. Commit this lockfile after checking it;
use `npm ci` on subsequent clean installs and CI. Dependency versions are initial ranges,
not a verified lockfile. Do not ignore audit errors. The ZIP was prepared without registry access.
`npm run test:foundation` and `npm run architecture` run without third-party packages.

## GitHub

Create a new **public, empty** repository `genyx` (no README, license or gitignore).
Then run these commands after the local checks pass:

```bash
git init -b main
git add .
git commit -m "chore: initialize Genyx sprint 0"
git remote add origin https://github.com/Holger2005/genyx.git
git push -u origin main
```

The remote URL assumes the proposed repository name; change it if needed.
In GitHub Settings, configure branch rules, enable private vulnerability reporting and
available secret protections; verify the Quality and security and CodeQL workflows.

## Architecture

See [architecture](docs/architecture.md), [Sprint 0](docs/sprint-0.md), and [security](SECURITY.md).
The minimal monochrome interface is temporary; the interactive 3D prototype is Sprint 1.

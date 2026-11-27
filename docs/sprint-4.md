# Sprint 4 — Production and launch

## 4.1 — Production architecture

The proposed deployment separates the read-only website from the administrative
backend. Cloudflare Pages Free is the initial static hosting candidate; Vercel
Pro remains the budget-dependent alternative. The current Node build is kept
unchanged. The public source boundary guard is integrated into architecture
checks and exercised in CI.

See [production architecture](production-architecture.md) for the provider
assessment, source links, trust boundaries, and static-export acceptance gates.

## Remaining work

- Build and validate the static deployment profile before any public deployment.
- Design authenticated private administration and durable production storage.
- Add actual intake only after privacy, authorization, rate limits, retention,
  backup and operational gates are approved.
- Review external providers and data handling, real-device accessibility,
  contact identity, SEO and the final commercial publication decision.

No production service or customer-data collection is enabled by Sprint 4.1.

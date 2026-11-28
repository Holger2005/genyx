# Sprint 4.7 — SEO and performance readiness

The bilingual public site generates page-specific title and description,
Open Graph and Twitter metadata. The export verifies the locale, nonempty
metadata, noindex/nofollow, and unique document titles. It refuses canonical
URLs until the real public origin is approved. No fake domain, reviews,
customer claims or social profile URLs are added.

## Static performance budgets

The export audits each localized HTML page for raw, uncompressed sizes:

- HTML: at most 512 KiB.
- Referenced initial JavaScript: at most 1 MiB.
- Referenced initial CSS: at most 256 KiB.

Asset references are deduplicated per page, and missing files fail the check.
These are supplementary budgets, not measurements of transfer size, dynamic
chunks, real-device speed or Core Web Vitals. Existing Lighthouse thresholds
and sample requirements are unchanged. No performance gain is claimed until
measurements are available.

Run:

```powershell
npm run test:seo
npm run check
npm run build:static
npm run preview:static
```

## Before indexing

- Approve an actual HTTPS origin and owner-controlled contact information.
- Add per-page canonical URLs and reciprocal ES/EN hreflang links.
- Generate a sitemap only for approved, indexable pages.
- Review robots directives, then remove preview noindex only after launch approval.
- Add a social image with an approved absolute URL and test sharing previews.
- Verify Search Console ownership and check real URLs after deployment.
- Review real-device accessibility, mobile performance and field metrics.

No analytics, external scripts, tracking cookies or marketing accounts are
added by this phase.

References:

- https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- https://developers.google.com/search/docs/essentials/technical
- https://developers.google.com/search/docs/crawling-indexing/block-indexing
- https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls

# Sprint 4.6 — Static deployment candidate

Use the existing normal build for the Node application. The optional public
static build sets GENYX_STATIC_EXPORT for that build only and writes to out.
The root page contains a language fallback; Pages redirects the root to /es.
No product detail pages are generated while the product catalog is empty.
Restore reviewed static detail routes and update the artifact allowlist when
publishing the first real product or additional project.

## Local review

```powershell
npm run check
npm run build:static
npm run preview:static
```

Open http://127.0.0.1:3220. Test both languages, project details, service pages,
the empty product catalog, consultation, privacy, and unknown routes.
The preview approximates Pages routing and headers, not the provider itself.
The static build changes .next output; run npm run build before npm run start.

## Hosting candidate

Only upload the verified out directory, never the source repository, database,
or .next directory. The _headers and _redirects files configure Cloudflare
Pages and keep previews noindex. CSP is a baseline, not a strict script policy.
No Functions or Workers are included.

After CI passes and the owner approves the preview and provider terms:

1. Create a Cloudflare Pages project with Direct Upload or reviewed Git settings.
2. Upload out or configure npm run build:static with output directory out.
3. Test the assigned pages.dev hostname, HTTPS, redirects, unknown routes and
   security headers. Test browser interactions on actual devices.
4. Add an owned domain only after confirming ownership, cost and DNS changes.
5. Retain the previous artifact and verify the rollback procedure.

Do not remove noindex or enable actual intake until the launch gates are approved.
The owner has since created the Git-integrated Pages preview. See
[commercial identity](commercial-identity.md) for the current configuration.
No custom domain purchase or commercial launch is approved.
Do not upload a failed or unverified build.

References:

- https://nextjs.org/docs/app/guides/static-exports
- https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/
- https://developers.cloudflare.com/pages/configuration/headers/
- https://developers.cloudflare.com/pages/configuration/redirects/
- https://developers.cloudflare.com/pages/configuration/serving-pages/

# Sprint 5.2 — Identidad comercial y canales de contacto

GENYX is the current project name, not a representation of a registered
company or trademark. The public preview uses https://genyx-7us.pages.dev.
Retain this no-cost hostname while validating demand. Do not register a
domain or change DNS without owner approval.

The Spanish tagline is "Ingeniería para lo que viene." The English tagline
is "Engineering what comes next." Continue the existing bilingual visual
identity. Do not add invented office addresses, certifications or client logos.

## Cloudflare production settings

The owner created a Git-integrated Pages project. The previously verified
HTTPS preview redirected / to /es, served both languages and returned 404
for representative private routes. Full hosted verification remains required.

- Production branch: main.
- Build command: npm run build:static.
- Output directory: out.
- Repository root: default.
- NODE_VERSION: 24.14.1.
- Keep preview noindex/nofollow headers.

In the project's Settings > Variables and secrets, configure the following
production build variables only after owner approval:

- `GENYX_GOOGLE_BOOKING_URL`: verified public Google appointment schedule link.
- `GENYX_WHATSAPP_NUMBER`: authorized business number, international digits.

Use only the public booking URL and business number, never credentials.
Both values are exposed in the generated HTML when configured. Do not
copy private .env.local or the laboratory credentials into Cloudflare.
Rebuild after changes. Preview branches may leave the settings empty.

Review [Google Calendar setup](google-calendar.md) and
[WhatsApp setup](whatsapp.md). Calendar must offer the actual 30-minute
free session in America/Guayaquil. Check visible organizer details and
recipient identity manually. WhatsApp must use a business number the owner
authorizes for public display. No automatic contact or booking is performed.

## Hosted verification

Run npm run check:hosted from the repository. The command makes read-only
requests to the fixed public preview origin, checks 28 localized pages,
the root redirect, baseline headers and representative missing private routes.
It reports only whether links are present in both consultation pages.
It does not follow contact links, test registration, send messages, make
appointments or log phone numbers. It is a preview check, not a full security
assessment. CI runs mocked regression tests without accessing the live site.

Before a custom domain, confirm the name, ownership, renewal cost, DNS and
trademark considerations. See
https://developers.cloudflare.com/pages/configuration/custom-domains/.
Keep noindex until commercial identity, privacy and launch approval are complete.

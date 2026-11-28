# Sprint 5.2 — Hosted identity and contact readiness

The public candidate is hosted at https://genyx-7us.pages.dev. Keep this
subdomain until an owned custom domain is approved. The brand is Genyx;
this does not establish trademark ownership or business registration.

## Cloudflare production settings

Use the existing Git-connected Pages project and production branch main.
Keep the build command npm run build:static, output directory out and the
verified Node version. Under Settings > Variables and Secrets, add only
approved public contact settings to the Production environment:

- GENYX_GOOGLE_BOOKING_URL: the public appointment booking page URL.
- GENYX_WHATSAPP_NUMBER: the approved business number in international digits.

Leave the settings absent until the owner has verified the destinations,
public identity, privacy notice and contact-data handling. No tokens, service
keys, passwords or local database files belong in this deployment. The booking
URL and phone number will be visible in public HTML. Use a separate business
account/number if the owner does not want personal details visible.

The Google booking page may display the account name and profile picture.
Review it while signed out. Confirm the 30-minute appointment duration,
America/Guayaquil time zone, availability and cancellation policy. Do not
create or send a real booking without approval.

Save changes and retry the production deployment. Do not copy .env.local
into the repository. Preview environment settings can remain blank.

## Read-only hosted verification

```powershell
npm run test:hosted:unit
npm run test:hosted
npm run test:hosted -- --require-contacts
```

The default live check verifies the 28 localized routes, selected security
headers, the root redirect, representative absent private routes and
consistent configured or disabled contact destinations. The final command
requires both channels to be present. It never prints their values, follows
external contact links, books meetings or sends messages.

Run live verification manually after deployment; CI runs only offline
regression tests. Presence and consistency do not prove ownership, availability
or actual delivery. Verify those manually before public commercial operation.

## Remaining approvals

- Confirm the public business identity, authorized contact channels and domain.
- Review hosting and contact providers, controller identity and privacy notice.
- Keep noindex and the synthetic private backend unchanged until launch approval.
- Do not represent Genyx as registered or trademark-protected without evidence.
- Do not buy a domain or activate paid services without owner approval.

References:

- https://developers.cloudflare.com/pages/configuration/build-configuration/
- https://support.google.com/calendar/answer/10733297

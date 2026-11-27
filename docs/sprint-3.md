# Sprint 3 — Commercial integrations

## Iteration 3.1 — Project discovery draft

The initial bilingual questionnaire lets a prospective client select a service,
describe their objective and requirements, and choose an approximate timeframe.
It prepares a local, copyable project summary after domain/application validation.

This is a draft-only experience. There is no server submission, network transport,
browser storage, personal contact data collection, email delivery or lead database.
The interface explicitly states these limitations. Users are advised not to enter
personal data or secrets. Service options come from the existing catalog.

## Iteration 3.2 — Initial consultation

The bilingual consultation page describes a proposed free 30-minute discovery
session. Its suggested agenda allocates five minutes to discovery, fifteen to
requirements and ten to next steps. No booking provider or availability is
configured; the page explicitly states that reservations are not enabled.
The preparation link opens the existing local inquiry draft.

Mobile Lighthouse checks now include inquiry and consultation routes in both
languages, with unchanged release budgets. The agenda is illustrative and can
be revised before commercial launch.

## Iteration 3.3 — Google Calendar booking link

A server-side configuration adapter accepts only recognized HTTPS Google appointment
booking paths. The consultation page renders a booking link when configured, or
retains the honest unavailable state otherwise. The reference time zone is
America/Guayaquil. No availability is fabricated, and no booking data is sent from
Genyx. See [Google Calendar setup](google-calendar.md) for owner verification.

## Laboratory measurement protocol

The first Spanish mobile home run has shown intermittent long JavaScript tasks.
Both mobile home routes now have three independent measurements. At least two
of three must each meet every unchanged numeric budget, and accessibility and
CLS must pass in all three. Every sample is logged and retained, including
outliers; all other routes retain their single-run gate. This deliberately
changes the sampling policy, not the numerical thresholds. It is not proof
that the underlying performance variance has been eliminated. Review the
diagnostics and repeat on real devices before commercial publication.

## Iteration 3.4 — WhatsApp Business contact

Optional business number configuration accepts international digits only. The
website renders direct WhatsApp links on the homepage, service detail, project
preparation and consultation pages when a valid number is configured. Messages
are localized and service-aware; they do not include the private inquiry draft.
The visitor reviews and sends the message in WhatsApp. Genyx does not send it
automatically, collect phone numbers, or use a WhatsApp API. Verify the public
business number before enabling. See [WhatsApp setup](whatsapp.md).

## Iteration 3.5 — n8n laboratory

An inactive, importable three-node workflow accepts a strictly synthetic test
envelope through a header-authenticated webhook, validates the allowed fields,
classifies urgency, and returns a non-persisted result. The public website remains
unchanged; no personal information, notifications or storage are enabled.
Node-based tests execute the exported classifier; an explicit local smoke command
tests the real n8n instance after the owner imports and configures it. See
[n8n setup](n8n.md). Runtime import and webhook verification remain manual gates.

## Iteration 3.6 — Local CRM laboratory

A Node.js SQLite adapter stores synthetic leads outside the repository and
records stage changes in a transactional event history. The application
enforces sequential transitions, closed terminal states and idempotent
creation. The local CLI can seed the existing n8n fixture, list records,
advance stages and inspect history. No public admin route, real customer
fields, automatic webhook persistence or network submission is enabled.
See [CRM laboratory](crm.md). SQLite is built into the supported Node versions;
the CLI uses type stripping and the experimental SQLite flag for Node 22.

## Iteration 3.7 — Security and privacy laboratory

An explicit local CLI calls the authenticated n8n test webhook, verifies the exact
synthetic classification against the original request, and only then writes the
synthetic lead through the idempotent CRM repository. Fixed loopback endpoint,
credential format validation, disabled redirects, timeout, bounded response and
strict matching prevent accidental external transmission or unverified writes.
The existing n8n workflow remains unchanged. A bilingual prototype privacy notice
describes current behavior; it is not a final legal policy. No public admin route,
real intake, or production authentication is enabled. See [security gates](commercial-security.md).

## Next gates

- Confirm CI, CodeQL and the release 0.3.0 quality gates before integration.
- Test keyboard access, mobile layout and validation feedback.
- Define a secure server-side intake contract, consent and privacy notice before
  collecting contact information.
- Add rate limits, abuse protection, validated delivery and failure handling.
- Configure an authorized appointment calendar and WhatsApp business contact.
- Add prospect automation only after its storage and access policy is approved.

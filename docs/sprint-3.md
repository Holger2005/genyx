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

## Next gates

- Confirm CI, CodeQL and the release 0.3.0 quality gates before integration.
- Test keyboard access, mobile layout and validation feedback.
- Define a secure server-side intake contract, consent and privacy notice before
  collecting contact information.
- Add rate limits, abuse protection, validated delivery and failure handling.
- Configure an authorized appointment calendar and WhatsApp business contact.
- Add prospect automation only after its storage and access policy is approved.

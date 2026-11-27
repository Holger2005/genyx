# WhatsApp contact setup

Use a dedicated business number that you authorize for public display.
Set GENYX_WHATSAPP_NUMBER in .env.local to international digits without plus,
spaces, punctuation or the domestic trunk zero. For Ecuador, use 593 followed
by the national number without its leading zero. Do not commit .env.local.

Restart the development server or rebuild production after changing the
configuration. Visit home, a service detail, inquiry and consultation in
both locales. Verify the destination in WhatsApp before publishing the number.

This integration uses standard wa.me links with editable localized messages.
No automatic sending, WhatsApp Cloud API, webhook, tracking or transmission of
the local inquiry draft is implemented. A syntactically valid number does not
prove ownership or WhatsApp registration. Leave the variable blank until ready.
The number and prefilled message are publicly visible to visitors.

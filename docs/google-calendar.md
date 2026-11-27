# Google Calendar appointment scheduling

Genyx links to an authorized public booking page. It does not embed Google scripts,
read private calendars, create events directly, transmit the inquiry draft, or claim
a booking succeeded. Google owns availability and appointment confirmation.

## Owner setup

1. Use a dedicated business Google account if possible.
2. Open https://calendar.google.com/ on a desktop browser.
3. Create an appointment schedule named Genyx — Initial consultation.
4. Choose 30 minutes, the America/Guayaquil time zone (UTC−05:00), and your actual
   availability. Choose an appropriate meeting location, such as Google Meet.
5. Keep the consultation free. Review booking fields, buffer and lead time.
6. Save and copy the booking-page link using Google's sharing controls.
7. Verify the link in a private browser window. Confirm duration, time zone,
   organizer identity, visible information, and actual available times.

A personal account can have a single booking page; some features require a paid
subscription. The public booking page can reveal the organizer's account name
and profile photo. Do not share a private calendar or credentials.

Official setup: https://support.google.com/calendar/answer/10729749

Official sharing: https://support.google.com/calendar/answer/10733297

## Configure Genyx

Copy .env.example to .env.local if it does not exist, then set
GENYX_GOOGLE_BOOKING_URL to the verified public booking link.
Supported URLs are HTTPS calendar.app.google links or calendar.google.com
appointment schedule paths, without query parameters or fragments.
Invalid or missing links keep the booking action disabled.

Restart the dev server or rebuild production after changing the variable.
Set the equivalent environment variable when deploying the application.

Run npm run check, then npm run test:browser. Open both /es/consultation and
/en/consultation and verify the link manually. Test an actual appointment with
permission from the calendar owner, then cancel the test appointment if appropriate.

## Limits

URL validation checks format, not ownership, availability, free pricing or duration.
The owner must review the actual booking page before enabling it.
The project draft remains local and is not transferred to Google.
No Google API credentials, new npm dependencies, or third-party iframe are needed.
The booking link is intentionally public when configured.

import assert from "node:assert/strict";
import { test } from "node:test";
import { contactStatus } from "../../scripts/hosted-contact.mjs";

const calendar = '<a href="https://calendar.app.google/Example">Book</a>';
const whatsapp = '<a href="https://wa.me/10000000000?text=Example">Contact</a>';

test("recognizes disabled channels without reading embedded script strings", () => {
  assert.deepEqual(contactStatus("", ""), { calendar: "disabled", whatsapp: "disabled" });
  assert.deepEqual(contactStatus("calendar.app.google/Example", ""), {
    calendar: "disabled",
    whatsapp: "disabled",
  });
});

test("checks consistent destinations across locales without returning them", () => {
  assert.deepEqual(contactStatus(calendar + whatsapp, calendar + whatsapp), {
    calendar: "configured",
    whatsapp: "configured",
  });
});

test("rejects missing or different contact destinations", () => {
  assert.deepEqual(contactStatus(calendar + whatsapp, calendar), {
    calendar: "configured",
    whatsapp: "inconsistent",
  });
  assert.equal(
    contactStatus(calendar, calendar.replace("Example", "Different")).calendar,
    "inconsistent",
  );
});

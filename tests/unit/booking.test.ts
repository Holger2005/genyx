import { describe, expect, it } from "vitest";
import { bookingTimeZone, getBookingUrl } from "../../src/config/booking";

describe("Google Calendar booking configuration", () => {
  it("keeps reservations disabled without a valid link", () => {
    expect(getBookingUrl(undefined)).toBeNull();
    expect(getBookingUrl("  ")).toBeNull();
  });

  it("accepts Google appointment URL formats", () => {
    const urls = [
      "https://calendar.app.google/TestBookingId",
      "https://calendar.google.com/calendar/appointments/schedules/TestBookingId",
      "https://calendar.google.com/appointments/schedules/TestBookingId",
    ];
    for (const url of urls) {
      expect(getBookingUrl(url)).toBe(url);
    }
    expect(getBookingUrl("  " + urls[0] + "  ")).toBe(urls[0]);
    expect(bookingTimeZone).toBe("America/Guayaquil");
  });

  it("rejects unsafe or unrelated links", () => {
    const urls = [
      "http://calendar.app.google/TestBookingId",
      "https://calendar.app.google.evil.test/TestBookingId",
      "https://calendar.app.google@evil.test/TestBookingId",
      "https://evil.test/calendar/appointments/schedules/TestBookingId",
      "https://calendar.google.com/calendar/u/0/r",
      "https://calendar.app.google/TestBookingId?next=https://evil.test",
      "https://calendar.app.google/TestBookingId#fragment",
      "https://calendar.app.google/",
      "javascript:alert(1)",
      "https://calendar.app.google/../TestBookingId",
    ];
    for (const url of urls) {
      expect(getBookingUrl(url)).toBeNull();
    }
  });
});

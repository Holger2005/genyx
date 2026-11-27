import { describe, expect, it } from "vitest";
import { createWhatsAppLink } from "../../src/application/contact/whatsapp-link";
import { getWhatsAppNumber } from "../../src/config/whatsapp";

const example = "593990000000";

describe("WhatsApp contact", () => {
  it("accepts only international digits", () => {
    expect(getWhatsAppNumber(` ${example} `)).toBe(example);
    for (const value of [undefined, "", "+593990000000", "0990000000", "593 990000000"]) {
      expect(getWhatsAppNumber(value)).toBeNull();
    }
  });

  it("does not render an unconfigured or malformed destination", () => {
    expect(createWhatsAppLink(null, "es")).toBeNull();
    expect(createWhatsAppLink("123?redirect=evil", "es")).toBeNull();
  });

  it("creates encoded localized messages using only public service names", () => {
    const es = new URL(createWhatsAppLink(example, "es", "Automatización & IA") ?? "");
    expect(es.origin).toBe("https://wa.me");
    expect(es.pathname).toBe(`/${example}`);
    expect(es.searchParams.get("text")).toContain("Automatización & IA");
    const en = new URL(createWhatsAppLink(example, "en") ?? "");
    expect(en.searchParams.get("text")).toBe(
      "Hello, Genyx. I would like information about your services.",
    );
    const blank = new URL(createWhatsAppLink(example, "es", "  ") ?? "");
    expect(blank.searchParams.get("text")).toBe(
      "Hola, Genyx. Quisiera información sobre sus servicios.",
    );
    const localized = new URL(createWhatsAppLink(example, "en", "Web development") ?? "");
    expect(localized.searchParams.get("text")).toContain("Web development");
  });
});

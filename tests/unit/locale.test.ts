import { describe, expect, it } from "vitest";
import { alternateLocale, isLocale } from "../../src/domain/locale";
import { getSiteContent } from "../../src/application/site-content";
import { staticContentRepository } from "../../src/infrastructure/content/static-content";

describe("locale", () => {
  it("accepts only supported locales", () => {
    expect(isLocale("es")).toBe(true);
    expect(isLocale("en")).toBe(true);
    for (const value of ["fr", "", null, 1, undefined]) expect(isLocale(value)).toBe(false);
  });
  it("switches in either direction", () => {
    expect(alternateLocale("es")).toBe("en");
    expect(alternateLocale("en")).toBe("es");
  });
  it("loads content through the repository contract", () => {
    expect(getSiteContent(staticContentRepository, "es").language).toBe("English");
    expect(getSiteContent(staticContentRepository, "en").language).toBe("Español");
  });
});

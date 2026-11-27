import { describe, expect, it } from "vitest";
import { getSiteContent } from "../../src/application/site-content";
import { locales } from "../../src/domain/locale";
import { staticContentRepository } from "../../src/infrastructure/content/static-content";

describe("visual experience content", () => {
  it("provides six distinct services in each supported language", () => {
    for (const locale of locales) {
      const content = getSiteContent(staticContentRepository, locale);
      expect(content.services).toHaveLength(6);
      expect(new Set(content.services.map((service) => service.title)).size).toBe(6);
      expect(content.services.every((service) => service.description.length > 0)).toBe(true);
      expect(content.menu.length).toBeGreaterThan(0);
      expect(content.close.length).toBeGreaterThan(0);
      expect(content.contactDescription.length).toBeGreaterThan(0);
    }
  });
});

import { describe, expect, it } from "vitest";
import { findOffering, getProducts, getServices } from "../../src/application/catalog/catalog";
import type { CatalogRepository } from "../../src/application/catalog/catalog";
import { staticCatalog } from "../../src/infrastructure/catalog/static-catalog";

describe("commercial catalog", () => {
  it("exposes matching localized services", () => {
    const es = getServices(staticCatalog, "es");
    const en = getServices(staticCatalog, "en");
    expect(es.length).toBeGreaterThanOrEqual(6);
    expect(es.map((item) => item.slug)).toEqual(en.map((item) => item.slug));
    expect(new Set(es.map((item) => item.slug)).size).toBe(es.length);
    expect(findOffering(es, "web")?.title).toBeTruthy();
    expect(findOffering(en, "web")?.title).toBeTruthy();
    expect(findOffering(es, "_missing")).toBeUndefined();
    expect(es.every((item) => item.deliverables.length > 0)).toBe(true);
  });

  it("does not expose draft or review products", () => {
    const sample = staticCatalog.services()[0];
    if (!sample) throw new Error("Expected at least one service for the catalog fixture");
    const repository: CatalogRepository = {
      services: () => [],
      products: () => [
        { ...sample, slug: "draft", status: "draft" },
        { ...sample, slug: "review", status: "review" },
        { ...sample, slug: "available", status: "available" },
      ],
    };
    const products = getProducts(repository, "en");
    expect(products.map((item) => item.slug)).toEqual(["available"]);
    expect(products[0]).not.toHaveProperty("status");
    expect(findOffering(products, "draft")).toBeUndefined();
    expect(findOffering(products, "review")).toBeUndefined();
  });

  it("publishes no unconfirmed SaaS products", () => {
    const approved = staticCatalog.products().filter((item) => item.status === "available");
    for (const locale of ["es", "en"] as const) {
      expect(getProducts(staticCatalog, locale).map((item) => item.slug)).toEqual(
        approved.map((item) => item.slug),
      );
    }
  });
});

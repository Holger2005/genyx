import type { Locale } from "../../domain/locale";
import type { Product, PublicOffering, Service } from "../../domain/catalog/offering";

export interface CatalogRepository {
  services(): readonly Service[];
  products(): readonly Product[];
}

export function getServices(repository: CatalogRepository, locale: Locale) {
  return repository.services().map(localize(locale));
}

export function getProducts(repository: CatalogRepository, locale: Locale) {
  return repository
    .products()
    .filter((product) => product.status === "available")
    .map(localize(locale));
}

function localize(locale: Locale) {
  return (item: Service): PublicOffering => ({
    slug: item.slug,
    ...item.content[locale],
  });
}

export function findOffering(offerings: readonly PublicOffering[], slug: string) {
  return offerings.find((item) => item.slug === slug);
}

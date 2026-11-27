import { getServices } from "../../application/catalog/catalog";
import type { SiteContentRepository } from "../../application/site-content";
import { staticCatalog } from "../catalog/static-catalog";
import { validateSite } from "./content-validation";
import siteData from "./data/site.json";

const content = validateSite(siteData);

export const staticContentRepository: SiteContentRepository = {
  get: (locale) => ({ ...content[locale], services: getServices(staticCatalog, locale) }),
};

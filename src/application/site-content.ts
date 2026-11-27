import type { Locale } from "../domain/locale";

export interface ServiceContent {
  readonly title: string;
  readonly description: string;
}

export interface SiteContent {
  readonly title: string;
  readonly description: string;
  readonly status: string;
  readonly language: string;
  readonly eyebrow: string;
  readonly explore: string;
  readonly contact: string;
  readonly menu: string;
  readonly close: string;
  readonly skip: string;
  readonly home: string;
  readonly servicesTitle: string;
  readonly servicesIntro: string;
  readonly services: readonly ServiceContent[];
  readonly workTitle: string;
  readonly workDescription: string;
  readonly aboutTitle: string;
  readonly aboutDescription: string;
  readonly contactTitle: string;
  readonly contactDescription: string;
}

export interface SiteContentRepository {
  get(locale: Locale): SiteContent;
}

export function getSiteContent(repository: SiteContentRepository, locale: Locale): SiteContent {
  return repository.get(locale);
}

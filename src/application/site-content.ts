import type { Locale } from "../domain/locale";

export interface SiteContent {
  readonly title: string;
  readonly description: string;
  readonly status: string;
  readonly language: string;
}

export interface SiteContentRepository {
  get(locale: Locale): SiteContent;
}

export function getSiteContent(repository: SiteContentRepository, locale: Locale): SiteContent {
  return repository.get(locale);
}

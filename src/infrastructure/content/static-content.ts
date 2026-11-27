import type { SiteContent, SiteContentRepository } from "../../application/site-content";
import type { Locale } from "../../domain/locale";

const content: Record<Locale, SiteContent> = {
  es: {
    title: "Ingeniería para lo que viene.",
    description: "Software a medida, automatización e inteligencia artificial.",
    status: "Sprint 0 · Base técnica en desarrollo",
    language: "English",
  },
  en: {
    title: "Engineering what comes next.",
    description: "Custom software, automation and artificial intelligence.",
    status: "Sprint 0 · Technical foundation in development",
    language: "Español",
  },
};

export const staticContentRepository: SiteContentRepository = {
  get: (locale) => content[locale],
};

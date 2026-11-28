import type { Metadata } from "next";
import type { Locale } from "../../domain/locale";

export function previewMetadata(locale: Locale, title: string, description: string): Metadata {
  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: {
      type: "website",
      siteName: "Genyx",
      title: `${title} | Genyx`,
      description,
      locale: locale === "es" ? "es_EC" : "en_US",
      alternateLocale: locale === "es" ? ["en_US"] : ["es_EC"],
    },
    twitter: {
      card: "summary",
      title: `${title} | Genyx`,
      description,
    },
  };
}

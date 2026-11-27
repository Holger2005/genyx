export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];

export function isLocale(value: unknown): value is Locale {
  return value === "es" || value === "en";
}

export function alternateLocale(locale: Locale): Locale {
  return locale === "es" ? "en" : "es";
}

import type { Locale } from "../../domain/locale";

export function createWhatsAppLink(
  number: string | null,
  locale: Locale,
  service?: string,
): string | null {
  if (!number || !/^[1-9][0-9]{7,14}$/.test(number)) return null;
  const subject = service?.trim().slice(0, 120);
  const message =
    locale === "es"
      ? subject
        ? `Hola, Genyx. Me interesa conocer más sobre ${subject}.`
        : "Hola, Genyx. Quisiera información sobre sus servicios."
      : subject
        ? `Hello, Genyx. I would like to learn more about ${subject}.`
        : "Hello, Genyx. I would like information about your services.";
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

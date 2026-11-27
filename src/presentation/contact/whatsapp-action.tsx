import { createWhatsAppLink } from "../../application/contact/whatsapp-link";
import type { Locale } from "../../domain/locale";

export function WhatsAppAction({
  locale,
  number,
  service,
}: {
  locale: Locale;
  number: string | null;
  service?: string;
}) {
  const href = createWhatsAppLink(number, locale, service);
  if (!href) return null;
  const es = locale === "es";
  return (
    <div className="contact-channel">
      <a className="action action-secondary" href={href} rel="noreferrer">
        {es ? "Consultar por WhatsApp" : "Contact via WhatsApp"}
      </a>
      <p className="contact-channel-note">
        {es
          ? "Abre WhatsApp con un mensaje editable. Tú decides si lo envías."
          : "Opens WhatsApp with an editable message. You decide whether to send it."}
      </p>
    </div>
  );
}

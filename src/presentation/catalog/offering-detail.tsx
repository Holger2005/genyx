import Link from "next/link";
import type { Locale } from "../../domain/locale";
import type { PublicOffering } from "../../domain/catalog/offering";
import { WhatsAppAction } from "../contact/whatsapp-action";
import { PortfolioShell } from "../portfolio/portfolio-shell";

export function OfferingDetail({
  locale,
  item,
  section,
  whatsappNumber,
}: {
  locale: Locale;
  item: PublicOffering;
  section: "services" | "products";
  whatsappNumber: string | null;
}) {
  const es = locale === "es";
  return (
    <PortfolioShell locale={locale} path={`/${section}/${item.slug}`}>
      <Link href={`/${locale}/${section}`}>
        {es ? "← Volver al catálogo" : "← Back to catalog"}
      </Link>
      <p className="eyebrow">GENYX / SOLUTIONS</p>
      <h1>{item.title}</h1>
      <p className="description">{item.description}</p>
      <section className="section">
        <h2>{es ? "Para quién" : "Who it is for"}</h2>
        <p className="description">{item.audience}</p>
      </section>
      <section className="section">
        <h2>{es ? "Entregables propuestos" : "Proposed deliverables"}</h2>
        <ul className="project-capabilities">
          {item.deliverables.map((deliverable) => (
            <li key={deliverable}>{deliverable}</li>
          ))}
        </ul>
      </section>
      <section className="section">
        <h2>{es ? "Próximo paso" : "Next step"}</h2>
        <p className="description">
          {es
            ? "El alcance y las condiciones se acuerdan antes de iniciar."
            : "Scope and terms are agreed before work begins."}
        </p>
        <Link className="action action-secondary" href={`/${locale}/inquiry`}>
          {es ? "Preparar proyecto" : "Prepare project"}
        </Link>
        <WhatsAppAction locale={locale} number={whatsappNumber} service={item.title} />
      </section>
    </PortfolioShell>
  );
}

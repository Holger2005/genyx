import Link from "next/link";
import { notFound } from "next/navigation";
import { getServices } from "../../../application/catalog/catalog";
import { getWhatsAppNumber } from "../../../config/whatsapp";
import { isLocale } from "../../../domain/locale";
import { staticCatalog } from "../../../infrastructure/catalog/static-catalog";
import { InquiryForm } from "../../../presentation/inquiry/inquiry-form";
import { WhatsAppAction } from "../../../presentation/contact/whatsapp-action";
import { PortfolioShell } from "../../../presentation/portfolio/portfolio-shell";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return {
    title: locale === "es" ? "Preparar proyecto | Genyx" : "Prepare your project | Genyx",
    description:
      locale === "es"
        ? "Organiza los requisitos de tu proyecto antes de una consulta."
        : "Organize your project requirements before a consultation.",
    robots: { index: false, follow: false },
  };
}

export default async function InquiryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const services = getServices(staticCatalog, locale).map(({ slug, title }) => ({ slug, title }));
  return (
    <PortfolioShell locale={locale} path="/inquiry">
      <p className="eyebrow">GENYX / DISCOVERY</p>
      <h1>{locale === "es" ? "Prepara tu proyecto." : "Prepare your project."}</h1>
      <p className="description">
        {locale === "es"
          ? "Define tus necesidades y crea un resumen antes de una consulta."
          : "Define your requirements and create a summary before a consultation."}
      </p>
      <InquiryForm locale={locale} services={services} />
      <Link href={`/${locale}/privacy`}>
        {locale === "es" ? "Aviso de privacidad del prototipo" : "Prototype privacy notice"}
      </Link>
      <Link className="action action-secondary" href={`/${locale}/consultation`}>
        {locale === "es" ? "Conocer la consultoría inicial" : "Explore the initial consultation"}
      </Link>
      <WhatsAppAction
        locale={locale}
        number={getWhatsAppNumber(process.env.GENYX_WHATSAPP_NUMBER)}
      />
    </PortfolioShell>
  );
}

import { notFound } from "next/navigation";
import { getServices } from "../../../application/catalog/catalog";
import { isLocale } from "../../../domain/locale";
import { staticCatalog } from "../../../infrastructure/catalog/static-catalog";
import { OfferingGrid } from "../../../presentation/catalog/offering-grid";
import { PortfolioShell } from "../../../presentation/portfolio/portfolio-shell";
import { previewMetadata } from "../../../presentation/seo/preview-metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return previewMetadata(
    locale,
    locale === "es" ? "Servicios especializados" : "Specialized services",
    locale === "es"
      ? "Soluciones a medida. El alcance se define para cada proyecto."
      : "Custom solutions. Scope is defined for each project.",
  );
}

export default async function CatalogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const items = getServices(staticCatalog, locale);
  const es = locale === "es";

  return (
    <PortfolioShell locale={locale} path="/services">
      <p className="eyebrow">GENYX / SERVICES</p>
      <h1>{es ? "Servicios especializados." : "Specialized services."}</h1>
      <p className="description">
        {es
          ? "Soluciones a medida. El alcance se define para cada proyecto."
          : "Custom solutions. Scope is defined for each project."}
      </p>
      <OfferingGrid locale={locale} items={items} section="services" />
    </PortfolioShell>
  );
}

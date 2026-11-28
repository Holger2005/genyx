import { notFound } from "next/navigation";
import { getProducts } from "../../../application/catalog/catalog";
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
    locale === "es" ? "Productos SaaS" : "SaaS products",
    locale === "es"
        ? "Consulta los productos con disponibilidad comercial confirmada."
        : "Browse products with confirmed commercial availability.",
  );
}

export default async function CatalogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const items = getProducts(staticCatalog, locale);
  const es = locale === "es";

  return (
    <PortfolioShell locale={locale} path="/products">
      <p className="eyebrow">GENYX / PRODUCTS</p>
      <h1>{es ? "Productos SaaS." : "SaaS products."}</h1>
      <p className="description">
        {es
          ? "Consulta los productos con disponibilidad comercial confirmada."
          : "Browse products with confirmed commercial availability."}
      </p>
      {items.length > 0 ? (
        <OfferingGrid locale={locale} items={items} section="products" />
      ) : (
        <section className="section" data-testid="empty-products">
          <h2>{es ? "Sin productos disponibles" : "No products available"}</h2>
          <p className="description">
            {es
              ? "Todavía no ofrecemos productos SaaS comercialmente validados."
              : "We do not yet offer commercially validated SaaS products."}
          </p>
        </section>
      )}
    </PortfolioShell>
  );
}

import { notFound } from "next/navigation";
import { findOffering, getProducts } from "../../../../application/catalog/catalog";
import { isLocale } from "../../../../domain/locale";
import { staticCatalog } from "../../../../infrastructure/catalog/static-catalog";
import { OfferingDetail } from "../../../../presentation/catalog/offering-detail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const item = findOffering(getProducts(staticCatalog, locale), slug);
  if (!item) notFound();
  return { title: item.title, description: item.description };
}

export default async function DetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const item = findOffering(getProducts(staticCatalog, locale), slug);
  if (!item) notFound();
  return <OfferingDetail locale={locale} item={item} section="products" />;
}

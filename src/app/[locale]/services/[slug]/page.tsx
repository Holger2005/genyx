import { notFound } from "next/navigation";
import { findOffering, getServices } from "../../../../application/catalog/catalog";
import { isLocale } from "../../../../domain/locale";
import { staticCatalog } from "../../../../infrastructure/catalog/static-catalog";
import { OfferingDetail } from "../../../../presentation/catalog/offering-detail";

export const dynamicParams = false;

export function generateStaticParams({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) return [];
  return getServices(staticCatalog, params.locale).map((item) => ({ slug: item.slug }));
}

export default async function DetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const item = findOffering(getServices(staticCatalog, locale), slug);
  if (!item) notFound();
  return <OfferingDetail locale={locale} item={item} section="services" />;
}

import { notFound } from "next/navigation";
import { findOffering, getServices } from "../../../../application/catalog/catalog";
import { getWhatsAppNumber } from "../../../../config/whatsapp";
import { isLocale } from "../../../../domain/locale";
import { staticCatalog } from "../../../../infrastructure/catalog/static-catalog";
import { OfferingDetail } from "../../../../presentation/catalog/offering-detail";
import { previewMetadata } from "../../../../presentation/seo/preview-metadata";

export const dynamicParams = false;

export function generateStaticParams({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) return [];
  return getServices(staticCatalog, params.locale).map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const item = findOffering(getServices(staticCatalog, locale), slug);
  if (!item) notFound();
  return previewMetadata(locale, item.title, item.description);
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
  return (
    <OfferingDetail
      locale={locale}
      item={item}
      section="services"
      whatsappNumber={getWhatsAppNumber(process.env.GENYX_WHATSAPP_NUMBER)}
    />
  );
}

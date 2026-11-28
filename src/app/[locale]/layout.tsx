import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { isLocale, locales } from "../../domain/locale";
import { getSiteContent } from "../../application/site-content";
import { staticContentRepository } from "../../infrastructure/content/static-content";
import { previewMetadata } from "../../presentation/seo/preview-metadata";
import "../globals.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = getSiteContent(staticContentRepository, locale);
  return {
    ...previewMetadata(locale, copy.title, copy.description),
    title: { default: `Genyx — ${copy.title}`, template: "%s | Genyx" },
  };
}

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}

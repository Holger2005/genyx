import { notFound } from "next/navigation";
import { isLocale } from "../../domain/locale";
import { getProjects } from "../../application/portfolio/get-projects";
import { getSiteContent } from "../../application/site-content";
import { staticContentRepository } from "../../infrastructure/content/static-content";
import { staticProjectRepository } from "../../infrastructure/portfolio/static-project-repository";
import { FoundationScreen } from "../../presentation/components/foundation-screen";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getSiteContent(staticContentRepository, locale);
  const projects = getProjects(staticProjectRepository, locale);
  return <FoundationScreen locale={locale} content={content} projects={projects} />;
}

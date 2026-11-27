import { notFound } from "next/navigation";
import { getProjects } from "../../../application/portfolio/get-projects";
import { isLocale } from "../../../domain/locale";
import { staticProjectRepository } from "../../../infrastructure/portfolio/static-project-repository";
import { PortfolioShell } from "../../../presentation/portfolio/portfolio-shell";
import { ProjectGrid } from "../../../presentation/portfolio/project-grid";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return {
    title: locale === "es" ? "Proyectos seleccionados" : "Selected projects",
    description:
      locale === "es"
        ? "Casos de estudio propios y demostraciones técnicas verificables."
        : "First-party case studies and verifiable technical demonstrations.",
  };
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <PortfolioShell locale={locale} path="/projects">
      <p className="eyebrow">GENYX / PORTFOLIO</p>
      <h1>{locale === "es" ? "Proyectos seleccionados." : "Selected projects."}</h1>
      <p className="description">
        {locale === "es"
          ? "Casos de estudio propios y demostraciones técnicas verificables."
          : "First-party case studies and verifiable technical demonstrations."}
      </p>
      <ProjectGrid locale={locale} projects={getProjects(staticProjectRepository, locale)} />
    </PortfolioShell>
  );
}

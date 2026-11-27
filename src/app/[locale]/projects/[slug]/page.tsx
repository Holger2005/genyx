import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectDetail, getProjects } from "../../../../application/portfolio/get-projects";
import { isLocale } from "../../../../domain/locale";
import { staticProjectRepository } from "../../../../infrastructure/portfolio/static-project-repository";
import { PortfolioShell } from "../../../../presentation/portfolio/portfolio-shell";

export const dynamicParams = false;

export function generateStaticParams({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) return [];
  return getProjects(staticProjectRepository, params.locale).map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const project = getProjectDetail(staticProjectRepository, locale, slug);
  if (!project) notFound();
  const es = locale === "es";

  return (
    <PortfolioShell locale={locale} path={`/${project.slug}`}>
      <Link href={`/${locale}/projects`}>{es ? "← Todos los proyectos" : "← All projects"}</Link>
      <p className="eyebrow">{es ? "CASO DE ESTUDIO / PROTOTIPO" : "CASE STUDY / PROTOTYPE"}</p>
      <h1>{project.title}</h1>
      <p className="description">{project.summary}</p>
      <ul className="technology-list">
        {project.technologies.map((technology) => (
          <li key={technology}>{technology}</li>
        ))}
      </ul>
      <section className="section">
        <h2>{es ? "El desafío" : "The challenge"}</h2>
        <p className="description">{project.challenge}</p>
      </section>
      <section className="section">
        <h2>{es ? "La solución" : "The approach"}</h2>
        <p className="description">{project.approach}</p>
        <ul className="project-capabilities">
          {project.capabilities.map((capability) => (
            <li key={capability}>{capability}</li>
          ))}
        </ul>
      </section>
      <section className="section">
        <h2>{es ? "Alcance actual" : "Current scope"}</h2>
        <p className="description">{project.limitations}</p>
        <Link className="action action-secondary" href={`/${locale}`}>
          {es ? "Explorar el prototipo" : "Explore the prototype"}
        </Link>
      </section>
    </PortfolioShell>
  );
}

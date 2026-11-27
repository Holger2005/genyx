import Link from "next/link";
import type { Locale } from "../../domain/locale";
import type { PublishedProject } from "../../domain/portfolio/project";

export function ProjectGrid({
  projects,
  locale,
}: {
  projects: readonly PublishedProject[];
  locale: Locale;
}) {
  const prototypeLabel = locale === "es" ? "PROTOTIPO PROPIO" : "FIRST-PARTY PROTOTYPE";
  return (
    <div className="project-grid">
      {projects.map((project) => (
        <article className="project-card" key={project.slug}>
          <div className="project-art" aria-hidden="true">
            <span>G / 01</span>
            <div className="project-symbol" />
          </div>
          <div className="project-copy">
            <p className="eyebrow">{prototypeLabel}</p>
            <h3>{project.title}</h3>
            <p>{project.summary}</p>
            <ul className="technology-list">
              {project.technologies.map((technology) => (
                <li key={technology}>{technology}</li>
              ))}
            </ul>
            <Link
              prefetch={false}
              className="action action-secondary"
              href={`/${locale}/projects/${project.slug}`}
            >
              {locale === "es" ? "Ver caso de estudio" : "View case study"}
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}

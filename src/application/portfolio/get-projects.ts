import type { Locale } from "../../domain/locale";
import type { PublishedProject } from "../../domain/portfolio/project";
import type { ProjectRepository } from "./project-repository";

export function getProjects(
  repository: ProjectRepository,
  locale: Locale,
): readonly PublishedProject[] {
  return repository
    .list()
    .filter((project) => project.status === "published")
    .map((project) => ({
      slug: project.slug,
      technologies: project.technologies,
      ...project.content[locale],
    }));
}

export function getProjectDetail(repository: ProjectRepository, locale: Locale, slug: string) {
  return getProjects(repository, locale).find((project) => project.slug === slug);
}

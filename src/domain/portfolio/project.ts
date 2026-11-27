import type { Locale } from "../locale";

export type ProjectStatus = "draft" | "review" | "published";

export interface ProjectCopy {
  readonly title: string;
  readonly summary: string;
  readonly challenge: string;
  readonly approach: string;
  readonly capabilities: readonly string[];
  readonly limitations: string;
}

export interface Project {
  readonly slug: string;
  readonly status: ProjectStatus;
  readonly technologies: readonly string[];
  readonly content: Readonly<Record<Locale, ProjectCopy>>;
}

export interface PublishedProject extends ProjectCopy {
  readonly slug: string;
  readonly technologies: readonly string[];
}

import type { Project } from "../../domain/portfolio/project";

export interface ProjectRepository {
  list(): readonly Project[];
}

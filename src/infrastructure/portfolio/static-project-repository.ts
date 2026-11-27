import type { ProjectRepository } from "../../application/portfolio/project-repository";
import { validateProjects } from "../content/content-validation";
import projectData from "../content/data/projects.json";

const projects = validateProjects(projectData);

export const staticProjectRepository: ProjectRepository = {
  list: () => projects,
};

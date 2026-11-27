import { describe, expect, it } from "vitest";
import { getProjectDetail, getProjects } from "../../src/application/portfolio/get-projects";
import type { ProjectRepository } from "../../src/application/portfolio/project-repository";
import type { Project } from "../../src/domain/portfolio/project";
import { staticProjectRepository } from "../../src/infrastructure/portfolio/static-project-repository";

const copy = {
  title: "Example",
  summary: "Summary",
  challenge: "Challenge",
  approach: "Approach",
  capabilities: ["Example"],
  limitations: "Prototype",
};

const sample: Project = {
  slug: "example",
  status: "published",
  technologies: ["TypeScript"],
  content: { es: { ...copy, title: "Ejemplo" }, en: copy },
};

const repository: ProjectRepository = {
  list: () => [
    sample,
    { ...sample, slug: "draft", status: "draft" },
    { ...sample, slug: "review", status: "review" },
  ],
};

describe("portfolio publication", () => {
  it("exposes only approved project records", () => {
    expect(getProjects(repository, "es").map((project) => project.slug)).toEqual(["example"]);
    expect(getProjectDetail(repository, "en", "draft")).toBeUndefined();
    expect(getProjectDetail(repository, "en", "review")).toBeUndefined();
    expect(getProjectDetail(repository, "en", "missing")).toBeUndefined();
  });

  it("returns localized public content", () => {
    expect(getProjectDetail(repository, "es", "example")?.title).toBe("Ejemplo");
    expect(getProjectDetail(repository, "en", "example")?.title).toBe("Example");
    expect(getProjects(repository, "en")[0]).not.toHaveProperty("status");
    expect(getProjects(repository, "en")[0]).not.toHaveProperty("content");
  });

  it("includes a first-party Genyx case study in both locales", () => {
    for (const locale of ["es", "en"] as const) {
      const approved = staticProjectRepository.list().filter((item) => item.status === "published");
      expect(getProjects(staticProjectRepository, locale).map((project) => project.slug)).toEqual(
        approved.map((item) => item.slug),
      );
      expect(getProjectDetail(staticProjectRepository, locale, "genyx")?.limitations).toBeTruthy();
      const media = getProjectDetail(staticProjectRepository, locale, "genyx")?.media;
      expect(media?.some((item) => item.kind === "image")).toBe(true);
    }
  });
});

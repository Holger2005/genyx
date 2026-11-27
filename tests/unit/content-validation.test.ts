import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  validateProducts,
  validateProjects,
  validateServices,
  validateSite,
} from "../../src/infrastructure/content/content-validation";
import projects from "../../src/infrastructure/content/data/projects.json";
import services from "../../src/infrastructure/content/data/services.json";
import products from "../../src/infrastructure/content/data/products.json";
import site from "../../src/infrastructure/content/data/site.json";

const firstProject = projects[0];
const firstService = services[0];
if (!firstProject || !firstService) throw new Error("Missing content fixtures");

describe("editorial content", () => {
  it("validates all committed content and local media files", () => {
    expect(validateServices(services)).toHaveLength(6);
    expect(validateProducts(products)).toEqual([]);
    expect(validateSite(site).es.title).toBe(site.es.title);
    const result = validateProjects(projects);
    expect(result).toHaveLength(1);
    for (const project of result) {
      for (const copy of Object.values(project.content)) {
        for (const item of copy.media ?? []) {
          expect(existsSync(resolve("public", item.src.slice(1)))).toBe(true);
          if (item.kind === "video") {
            expect(existsSync(resolve("public", item.captions.slice(1)))).toBe(true);
          }
        }
      }
    }
  });

  it("rejects incomplete translations and duplicate identifiers", () => {
    expect(() => validateSite({ es: site.es })).toThrow("site.en");
    expect(() => validateServices([firstService, firstService])).toThrow("service slugs");
    expect(() => validateProjects([{ ...firstProject, slug: "../private" }])).toThrow("slug");
    expect(() => validateProducts([{ ...firstService, status: "unknown" }])).toThrow("status");
    expect(() => validateProjects([{ ...firstProject, status: "unknown" }])).toThrow("status");
  });

  it("rejects external and traversal media paths and invalid dimensions", () => {
    const image = firstProject.content.es.media[0];
    if (!image) throw new Error("Missing image fixture");
    const withMedia = (media: unknown[]) => [
      {
        ...firstProject,
        content: {
          ...firstProject.content,
          es: { ...firstProject.content.es, media },
        },
      },
    ];
    for (const src of ["https://example.com/a.svg", "/media/../private.svg"]) {
      expect(() => validateProjects(withMedia([{ ...image, src }]))).toThrow("src");
    }
    expect(() => validateProjects(withMedia([{ ...image, width: 0 }]))).toThrow("width");
    expect(() => validateProjects(withMedia([image, image]))).toThrow("media IDs");
    expect(() => validateProjects(withMedia([{ ...image, alt: "" }]))).toThrow("alt");
  });

  it("accepts an approved video with captions and transcript", () => {
    const video = {
      id: "demo",
      kind: "video",
      title: "Demo",
      caption: "Prototype demonstration",
      src: "/media/genyx/demo.mp4",
      captions: "/media/genyx/demo-en.vtt",
      captionsLabel: "English",
      transcript: "A demonstration of the prototype.",
    };
    const content = {
      ...firstProject.content,
      en: { ...firstProject.content.en, media: [video] },
    };
    const result = validateProjects([{ ...firstProject, content }]);
    expect(result[0]?.content.en.media?.[0]).toEqual(video);
    const invalidVideo = { ...video, captions: "/media/genyx/demo.txt" };
    const invalidContent = {
      ...content,
      en: { ...content.en, media: [invalidVideo] },
    };
    expect(() => validateProjects([{ ...firstProject, content: invalidContent }])).toThrow(
      "captions",
    );
  });
});

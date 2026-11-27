import type { SiteContent } from "../../application/site-content";
import type { OfferingCopy, Product, Service } from "../../domain/catalog/offering";
import type { Locale } from "../../domain/locale";
import type { Project, ProjectCopy } from "../../domain/portfolio/project";
import type { ProjectMedia } from "../../domain/portfolio/project-media";

type SiteCopy = Omit<SiteContent, "services">;
type Fields = Record<string, unknown>;

function invalid(path: string): never {
  throw new Error(`Invalid content: ${path}`);
}

function object(value: unknown, path: string): Fields {
  if (!value || typeof value !== "object" || Array.isArray(value)) invalid(path);
  return value as Fields;
}

function string(value: unknown, path: string): string {
  if (typeof value !== "string" || !value.trim()) invalid(path);
  return value;
}

function list<T>(value: unknown, path: string, read: (item: unknown, path: string) => T): T[] {
  if (!Array.isArray(value)) invalid(path);
  return value.map((item, index) => read(item, `${path}[${index}]`));
}

function strings(value: unknown, path: string): string[] {
  const result = list(value, path, string);
  if (!result.length) invalid(path);
  return result;
}

function slug(value: unknown, path: string): string {
  const result = string(value, path);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(result)) invalid(path);
  return result;
}

function unique<T>(items: T[], key: (item: T) => string, path: string): T[] {
  if (new Set(items.map(key)).size !== items.length) invalid(path);
  return items;
}

function localized<T>(
  value: unknown,
  path: string,
  read: (value: unknown, path: string) => T,
): Record<Locale, T> {
  const fields = object(value, path);
  return {
    es: read(fields.es, `${path}.es`),
    en: read(fields.en, `${path}.en`),
  };
}

function asset(value: unknown, path: string, extensions: readonly string[]): string {
  const result = string(value, path);
  if (!/^\/media\/(?:[a-z0-9-]+\/)*[a-z0-9-]+\.[a-z0-9]+$/.test(result)) invalid(path);
  if (!extensions.some((extension) => result.endsWith(extension))) invalid(path);
  return result;
}

function dimension(value: unknown, path: string): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1 || value > 8192) {
    invalid(path);
  }
  return value;
}

function media(value: unknown, path: string): ProjectMedia {
  const fields = object(value, path);
  const base = {
    id: slug(fields.id, `${path}.id`),
    title: string(fields.title, `${path}.title`),
    caption: string(fields.caption, `${path}.caption`),
  };
  if (fields.kind === "image") {
    return {
      ...base,
      kind: "image",
      src: asset(fields.src, `${path}.src`, [".svg", ".png", ".jpg", ".jpeg", ".webp", ".avif"]),
      alt: string(fields.alt, `${path}.alt`),
      width: dimension(fields.width, `${path}.width`),
      height: dimension(fields.height, `${path}.height`),
    };
  }
  if (fields.kind === "video") {
    return {
      ...base,
      kind: "video",
      src: asset(fields.src, `${path}.src`, [".mp4"]),
      captions: asset(fields.captions, `${path}.captions`, [".vtt"]),
      captionsLabel: string(fields.captionsLabel, `${path}.captionsLabel`),
      transcript: string(fields.transcript, `${path}.transcript`),
    };
  }
  return invalid(`${path}.kind`);
}

function projectCopy(value: unknown, path: string): ProjectCopy {
  const fields = object(value, path);
  const copy = {
    title: string(fields.title, `${path}.title`),
    summary: string(fields.summary, `${path}.summary`),
    challenge: string(fields.challenge, `${path}.challenge`),
    approach: string(fields.approach, `${path}.approach`),
    capabilities: strings(fields.capabilities, `${path}.capabilities`),
    limitations: string(fields.limitations, `${path}.limitations`),
  };
  if (fields.media === undefined) return copy;
  const items = list(fields.media, `${path}.media`, media);
  return { ...copy, media: unique(items, (item) => item.id, `${path}.media IDs`) };
}

function project(value: unknown, path: string): Project {
  const fields = object(value, path);
  const status = fields.status;
  if (status !== "draft" && status !== "review" && status !== "published") {
    invalid(`${path}.status`);
  }
  return {
    slug: slug(fields.slug, `${path}.slug`),
    status,
    technologies: strings(fields.technologies, `${path}.technologies`),
    content: localized(fields.content, `${path}.content`, projectCopy),
  };
}

function offeringCopy(value: unknown, path: string): OfferingCopy {
  const fields = object(value, path);
  return {
    title: string(fields.title, `${path}.title`),
    description: string(fields.description, `${path}.description`),
    audience: string(fields.audience, `${path}.audience`),
    deliverables: strings(fields.deliverables, `${path}.deliverables`),
  };
}

function service(value: unknown, path: string): Service {
  const fields = object(value, path);
  return {
    slug: slug(fields.slug, `${path}.slug`),
    content: localized(fields.content, `${path}.content`, offeringCopy),
  };
}

function product(value: unknown, path: string): Product {
  const fields = object(value, path);
  const status = fields.status;
  if (status !== "draft" && status !== "review" && status !== "available") {
    invalid(`${path}.status`);
  }
  return { ...service(fields, path), status };
}

function siteCopy(value: unknown, path: string): SiteCopy {
  const fields = object(value, path);
  return {
    title: string(fields.title, `${path}.title`),
    description: string(fields.description, `${path}.description`),
    status: string(fields.status, `${path}.status`),
    language: string(fields.language, `${path}.language`),
    eyebrow: string(fields.eyebrow, `${path}.eyebrow`),
    explore: string(fields.explore, `${path}.explore`),
    contact: string(fields.contact, `${path}.contact`),
    menu: string(fields.menu, `${path}.menu`),
    close: string(fields.close, `${path}.close`),
    skip: string(fields.skip, `${path}.skip`),
    home: string(fields.home, `${path}.home`),
    servicesTitle: string(fields.servicesTitle, `${path}.servicesTitle`),
    servicesIntro: string(fields.servicesIntro, `${path}.servicesIntro`),
    workTitle: string(fields.workTitle, `${path}.workTitle`),
    workDescription: string(fields.workDescription, `${path}.workDescription`),
    aboutTitle: string(fields.aboutTitle, `${path}.aboutTitle`),
    aboutDescription: string(fields.aboutDescription, `${path}.aboutDescription`),
    contactTitle: string(fields.contactTitle, `${path}.contactTitle`),
    contactDescription: string(fields.contactDescription, `${path}.contactDescription`),
  };
}

export function validateProjects(value: unknown) {
  return unique(list(value, "projects", project), (item) => item.slug, "project slugs");
}

export function validateServices(value: unknown) {
  return unique(list(value, "services", service), (item) => item.slug, "service slugs");
}

export function validateProducts(value: unknown) {
  return unique(list(value, "products", product), (item) => item.slug, "product slugs");
}

export function validateSite(value: unknown) {
  return localized(value, "site", siteCopy);
}

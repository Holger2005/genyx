import type { SiteContent, SiteContentRepository } from "../../application/site-content";
import type { Locale } from "../../domain/locale";
import { getServices } from "../../application/catalog/catalog";
import { staticCatalog } from "../catalog/static-catalog";

const content: Record<Locale, SiteContent> = {
  es: {
    title: "Ingeniería para lo que viene.",
    description:
      "Software a medida, automatización e inteligencia artificial para transformar empresas.",
    status: "Prototipo visual · Integraciones comerciales en desarrollo",
    language: "English",
    eyebrow: "SOFTWARE / AUTOMATIZACIÓN / INTELIGENCIA",
    explore: "Explorar soluciones",
    contact: "Hablemos",
    menu: "Menú",
    close: "Cerrar",
    skip: "Saltar al contenido",
    home: "Inicio",
    servicesTitle: "Tecnología sin compromisos.",
    servicesIntro: "Seis especialidades. Una misma disciplina: ingeniería orientada a resultados.",
    services: getServices(staticCatalog, "es"),
    workTitle: "Ingeniería aplicada.",
    workDescription: "Explora nuestros casos de estudio y demostraciones técnicas.",
    aboutTitle: "Precisión en cada decisión.",
    aboutDescription:
      "Construimos tecnología con una visión clara: calidad, seguridad y evolución sostenible.",
    contactTitle: "Tu visión. Nuestra ingeniería.",
    contactDescription:
      "El agendamiento de consultorías de 30 minutos y el formulario de proyectos se habilitarán en una próxima versión.",
  },
  en: {
    title: "Engineering what comes next.",
    description: "Custom software, automation and artificial intelligence to transform businesses.",
    status: "Visual prototype · Commercial integrations in development",
    language: "Español",
    eyebrow: "SOFTWARE / AUTOMATION / INTELLIGENCE",
    explore: "Explore solutions",
    contact: "Let's talk",
    menu: "Menu",
    close: "Close",
    skip: "Skip to content",
    home: "Home",
    servicesTitle: "Technology without compromise.",
    servicesIntro: "Six specialties. One discipline: engineering for meaningful outcomes.",
    services: getServices(staticCatalog, "en"),
    workTitle: "Engineering in practice.",
    workDescription: "Explore our case studies and technical demonstrations.",
    aboutTitle: "Precision in every decision.",
    aboutDescription:
      "We build technology with a clear vision: quality, security and sustainable evolution.",
    contactTitle: "Your vision. Our engineering.",
    contactDescription:
      "Thirty-minute consultations and the project inquiry form will be enabled in an upcoming release.",
  },
};

export const staticContentRepository: SiteContentRepository = {
  get: (locale) => content[locale],
};

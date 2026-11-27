import type { SiteContent, SiteContentRepository } from "../../application/site-content";
import type { Locale } from "../../domain/locale";

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
    services: [
      {
        title: "Desarrollo web",
        description: "Experiencias digitales rápidas, accesibles y seguras.",
      },
      {
        title: "Aplicaciones móviles",
        description: "Productos intuitivos para las personas que los usan.",
      },
      {
        title: "Software empresarial",
        description: "Sistemas que organizan y simplifican tu operación.",
      },
      {
        title: "Inteligencia artificial",
        description: "Soluciones inteligentes con objetivos concretos.",
      },
      { title: "Automatización", description: "Menos trabajo repetitivo, más tiempo para crecer." },
      {
        title: "APIs e integraciones",
        description: "Conectamos sistemas y datos de forma controlada.",
      },
    ],
    workTitle: "Ingeniería aplicada.",
    workDescription: "Nuestro portafolio audiovisual estará disponible en una próxima versión.",
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
    services: [
      { title: "Web development", description: "Fast, accessible and secure digital experiences." },
      {
        title: "Mobile applications",
        description: "Intuitive products for the people who use them.",
      },
      {
        title: "Enterprise software",
        description: "Systems that organize and simplify operations.",
      },
      {
        title: "Artificial intelligence",
        description: "Intelligent solutions with tangible goals.",
      },
      { title: "Automation", description: "Less repetitive work, more time to grow." },
      { title: "APIs and integrations", description: "Connect systems and data with control." },
    ],
    workTitle: "Engineering in practice.",
    workDescription: "Our multimedia portfolio will be available in an upcoming release.",
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

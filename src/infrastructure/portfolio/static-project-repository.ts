import type { ProjectRepository } from "../../application/portfolio/project-repository";
import type { Project } from "../../domain/portfolio/project";

const projects: readonly Project[] = [
  {
    slug: "genyx",
    status: "published",
    technologies: ["Next.js", "React", "TypeScript", "WebGL", "GitHub Actions"],
    content: {
      es: {
        title: "Genyx — Experiencia digital",
        summary: "Prototipo corporativo propio con una escultura 3D y arquitectura por capas.",
        challenge: "Presentar capacidades de ingeniería mediante una experiencia visual ligera.",
        approach:
          "Separamos contenido, aplicación y presentación. La escena gráfica usa WebGL nativo y una alternativa SVG.",
        capabilities: [
          "Interfaz bilingüe y adaptable.",
          "Geometría interactiva y movimiento reducido.",
          "Pruebas automatizadas de código, navegador y cabeceras HTTP.",
        ],
        limitations:
          "Prototipo en desarrollo. No representa un despliegue comercial ni una certificación de calidad.",
      },
      en: {
        title: "Genyx — Digital experience",
        summary: "First-party corporate prototype with a 3D sculpture and layered architecture.",
        challenge: "Present engineering capabilities through a lightweight visual experience.",
        approach:
          "Content, application and presentation are separated. The graphics use native WebGL and an SVG fallback.",
        capabilities: [
          "Bilingual responsive interface.",
          "Interactive geometry and reduced-motion support.",
          "Automated code, browser and HTTP header checks.",
        ],
        limitations:
          "Prototype in development. It does not represent a commercial deployment or quality certification.",
      },
    },
  },
];

export const staticProjectRepository: ProjectRepository = {
  list: () => projects,
};

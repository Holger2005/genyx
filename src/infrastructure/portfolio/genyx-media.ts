import type { Locale } from "../../domain/locale";
import type { ProjectMedia } from "../../domain/portfolio/project-media";

export const genyxMedia: Readonly<Record<Locale, readonly ProjectMedia[]>> = {
  es: [
    {
      id: "architecture",
      kind: "image",
      title: "Arquitectura de Genyx",
      caption: "Diagrama propio de las capas actuales y sus dependencias.",
      alt: "Presentación y aplicación dependen del dominio; infraestructura implementa el puerto.",
      src: "/media/genyx/architecture-es.svg",
      width: 800,
      height: 480,
    },
    {
      id: "graphics",
      kind: "image",
      title: "Renderizado adaptativo",
      caption: "Diagrama propio del flujo de renderizado y la alternativa estática.",
      alt: "El navegador usa WebGL bajo demanda o conserva el SVG cuando no puede renderizar.",
      src: "/media/genyx/graphics-es.svg",
      width: 800,
      height: 480,
    },
  ],
  en: [
    {
      id: "architecture",
      kind: "image",
      title: "Genyx architecture",
      caption: "Original diagram of the current layers and their dependencies.",
      alt: "Presentation and application depend on the domain; infrastructure implements the port.",
      src: "/media/genyx/architecture-en.svg",
      width: 800,
      height: 480,
    },
    {
      id: "graphics",
      kind: "image",
      title: "Adaptive rendering",
      caption: "Original diagram of the rendering flow and static fallback.",
      alt: "The browser uses on-demand WebGL or retains the SVG when rendering is unavailable.",
      src: "/media/genyx/graphics-en.svg",
      width: 800,
      height: 480,
    },
  ],
};

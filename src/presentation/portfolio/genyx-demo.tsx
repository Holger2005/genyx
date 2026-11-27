import type { Locale } from "../../domain/locale";
import { SculpturePreview } from "../components/sculpture-preview";

export function GenyxDemo({ locale }: { locale: Locale }) {
  const es = locale === "es";
  return (
    <section className="section" aria-labelledby="demo-title">
      <h2 id="demo-title">{es ? "Demostración en vivo" : "Live demonstration"}</h2>
      <p className="description">
        {es
          ? "Explora la escultura del prototipo. El cursor y el desplazamiento modifican la geometría. Con movimiento reducido se muestra la alternativa SVG."
          : "Explore the prototype sculpture. Pointer movement and scrolling change the geometry. Reduced motion preserves the SVG fallback."}
      </p>
      <div className="demo-stage">
        <SculpturePreview />
      </div>
    </section>
  );
}

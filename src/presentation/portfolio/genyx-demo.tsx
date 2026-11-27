import type { Locale } from "../../domain/locale";
import { SculpturePreview } from "../components/sculpture-preview";

export function GenyxDemo({ locale }: { locale: Locale }) {
  const es = locale === "es";
  return (
    <section className="section" aria-labelledby="demo-title">
      <h2 id="demo-title">{es ? "Demostración en vivo" : "Live demonstration"}</h2>
      <p className="description">
        {es
          ? "Explora la escultura del prototipo. En pantallas pequeñas, activa la vista 3D. Si no está disponible o prefieres movimiento reducido, se conserva el SVG."
          : "Explore the prototype sculpture. On smaller screens, enable the 3D view. If unavailable or reduced motion is preferred, the SVG remains visible."}
      </p>
      <div className="demo-stage">
        <SculpturePreview locale={locale} />
      </div>
    </section>
  );
}

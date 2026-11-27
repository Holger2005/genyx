import Image from "next/image";
import type { Locale } from "../../domain/locale";
import type { ProjectMedia } from "../../domain/portfolio/project-media";

export function ProjectGallery({
  media,
  locale,
}: {
  media: readonly ProjectMedia[];
  locale: Locale;
}) {
  if (!media.length) return null;

  return (
    <section className="section" aria-labelledby="gallery-title">
      <h2 id="gallery-title">{locale === "es" ? "Galería técnica" : "Technical gallery"}</h2>
      <div className="media-grid">
        {media.map((item) => (
          <figure className="media-card" key={item.id}>
            {item.kind === "image" ? (
              <Image
                src={item.src}
                alt={item.alt}
                width={item.width}
                height={item.height}
                unoptimized
                loading="eager"
              />
            ) : (
              <div className="media-video">
                <video controls preload="none">
                  <source src={item.src} type="video/mp4" />
                  <track
                    kind="captions"
                    src={item.captions}
                    srcLang={locale}
                    label={item.captionsLabel}
                    default
                  />
                </video>
                <details>
                  <summary>{locale === "es" ? "Transcripción" : "Transcript"}</summary>
                  <p>{item.transcript}</p>
                </details>
              </div>
            )}
            <figcaption>
              <h3>{item.title}</h3>
              <p>{item.caption}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

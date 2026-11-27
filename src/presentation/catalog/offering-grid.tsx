import Link from "next/link";
import type { Locale } from "../../domain/locale";
import type { PublicOffering } from "../../domain/catalog/offering";

export function OfferingGrid({
  locale,
  items,
  section,
}: {
  locale: Locale;
  items: readonly PublicOffering[];
  section: "services" | "products";
}) {
  const label = locale === "es" ? "Ver detalles" : "View details";
  return (
    <div className="service-grid">
      {items.map((item) => (
        <article className="service-card" key={item.slug}>
          <h2>{item.title}</h2>
          <p>{item.description}</p>
          <Link href={`/${locale}/${section}/${item.slug}`}>
            {label}
            <span className="sr-only">: {item.title}</span>
          </Link>
        </article>
      ))}
    </div>
  );
}

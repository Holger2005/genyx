import Link from "next/link";
import type { SiteContent } from "../../application/site-content";
import { alternateLocale, type Locale } from "../../domain/locale";
import { Brand } from "./brand";

export function FoundationScreen({ locale, content }: { locale: Locale; content: SiteContent }) {
  return (
    <div className="shell">
      <header className="header">
        <Brand />
        <Link href={`/${alternateLocale(locale)}`} lang={alternateLocale(locale)}>
          {content.language}
        </Link>
      </header>
      <main className="hero">
        <p className="eyebrow">SOFTWARE / AUTOMATION / INTELLIGENCE</p>
        <h1>{content.title}</h1>
        <p className="description">{content.description}</p>
        <p className="status">{content.status}</p>
      </main>
      <footer>GENYX © 2026</footer>
    </div>
  );
}

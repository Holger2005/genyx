import Link from "next/link";
import type { ReactNode } from "react";
import { alternateLocale, type Locale } from "../../domain/locale";
import { Brand } from "../components/brand";

export function PortfolioShell({
  locale,
  path,
  children,
}: {
  locale: Locale;
  path: string;
  children: ReactNode;
}) {
  const other = alternateLocale(locale);
  return (
    <div className="shell">
      <a className="skip-link" href="#portfolio">
        {locale === "es" ? "Saltar al contenido" : "Skip to content"}
      </a>
      <header className="header">
        <Link href={`/${locale}`}>
          <Brand />
        </Link>
        <div className="header-actions catalog-nav">
          <Link href={`/${locale}/projects`}>{locale === "es" ? "Proyectos" : "Projects"}</Link>
          <Link href={`/${locale}/services`}>{locale === "es" ? "Servicios" : "Services"}</Link>
          <Link href={`/${locale}/products`}>{locale === "es" ? "Productos" : "Products"}</Link>
          <Link href={`/${other}${path}`} lang={other}>
            {locale === "es" ? "English" : "Español"}
          </Link>
        </div>
      </header>
      <main id="portfolio" className="portfolio-main" tabIndex={-1}>
        {children}
      </main>
      <footer className="footer">
        <Brand />
        <Link href={`/${locale}`}>{locale === "es" ? "Inicio" : "Home"}</Link>
      </footer>
    </div>
  );
}

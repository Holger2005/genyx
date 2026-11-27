import Link from "next/link";
import type { SiteContent } from "../../application/site-content";
import { alternateLocale, type Locale } from "../../domain/locale";
import { AmbientEnvironment } from "./ambient-environment";
import { Brand } from "./brand";
import { CinematicMenu } from "./cinematic-menu";
import { SculpturePreview } from "./sculpture-preview";

export function FoundationScreen({ locale, content }: { locale: Locale; content: SiteContent }) {
  const links = [
    { href: "#home", label: content.home },
    { href: "#services", label: content.explore },
    { href: "#work", label: content.workTitle },
    { href: "#about", label: content.aboutTitle },
    { href: "#contact", label: content.contact },
  ];

  return (
    <div className="shell">
      <div className="scroll-progress" aria-hidden="true" />
      <a className="skip-link" href="#home">
        {content.skip}
      </a>
      <header className="header">
        <Link href={`/${locale}`}>
          <Brand />
        </Link>
        <div className="header-actions">
          <Link href={`/${alternateLocale(locale)}`} lang={alternateLocale(locale)}>
            {content.language}
          </Link>
          <CinematicMenu menu={content.menu} close={content.close} links={links} />
        </div>
      </header>
      <main id="home" tabIndex={-1}>
        <section className="hero" aria-labelledby="hero-title">
          <AmbientEnvironment />
          <div className="hero-copy">
            <p className="eyebrow">{content.eyebrow}</p>
            <h1 id="hero-title">{content.title}</h1>
            <p className="description">{content.description}</p>
            <div className="hero-actions">
              <a className="action action-primary" href="#services">
                {content.explore} <span aria-hidden="true">↗</span>
              </a>
              <a className="action action-secondary" href="#contact">
                {content.contact}
              </a>
            </div>
          </div>
          <SculpturePreview />
        </section>
        <section id="services" className="section" tabIndex={-1} aria-labelledby="services-title">
          <p className="eyebrow">01 / EXPERTISE</p>
          <h2 id="services-title">{content.servicesTitle}</h2>
          <p className="description">{content.servicesIntro}</p>
          <div className="service-grid">
            {content.services.map((service, index) => (
              <article key={service.title} className="service-card">
                <span className="eyebrow">{String(index + 1).padStart(2, "0")} / G</span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </article>
            ))}
          </div>
        </section>
        <section
          id="work"
          className="section feature-panel"
          tabIndex={-1}
          aria-labelledby="work-title"
        >
          <p className="eyebrow">02 / SELECTED WORK</p>
          <h2 id="work-title">{content.workTitle}</h2>
          <p className="description">{content.workDescription}</p>
        </section>
        <section id="about" className="section" tabIndex={-1} aria-labelledby="about-title">
          <p className="eyebrow">03 / GENYX</p>
          <h2 id="about-title">{content.aboutTitle}</h2>
          <p className="description">{content.aboutDescription}</p>
        </section>
        <section
          id="contact"
          className="section feature-panel"
          tabIndex={-1}
          aria-labelledby="contact-title"
        >
          <p className="eyebrow">04 / CONTACT</p>
          <h2 id="contact-title">{content.contactTitle}</h2>
          <p className="description">{content.contactDescription}</p>
        </section>
      </main>
      <footer className="footer">
        <Brand />
        <nav aria-label={content.menu}>
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <p>{content.status}</p>
        <p>GENYX © 2026</p>
      </footer>
    </div>
  );
}

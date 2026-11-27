import { notFound } from "next/navigation";
import { isLocale } from "../../../domain/locale";
import { PortfolioShell } from "../../../presentation/portfolio/portfolio-shell";

const copy = {
  es: {
    title: "Privacidad del prototipo",
    intro: "Información sobre el funcionamiento actual de Genyx.",
    sections: [
      {
        title: "Formulario de proyectos",
        text: "El resumen se prepara en tu navegador. Genyx no lo envía al servidor ni al CRM. No introduzcas datos personales ni confidenciales.",
      },
      {
        title: "Servicios externos",
        text: "Si eliges Google Calendar o WhatsApp, accedes a sus servicios y políticas. Genyx no envía automáticamente tu borrador a esos proveedores.",
      },
      {
        title: "Entorno de pruebas",
        text: "El laboratorio de n8n y CRM admite únicamente registros sintéticos. No está destinado a almacenar datos de clientes reales.",
      },
      {
        title: "Antes del lanzamiento comercial",
        text: "La información del responsable, los plazos de conservación y los mecanismos para ejercer derechos deberán definirse antes de habilitar la recepción de solicitudes reales. Este aviso describe el prototipo y no es una política definitiva.",
      },
    ],
  },
  en: {
    title: "Prototype privacy",
    intro: "Information about the current operation of Genyx.",
    sections: [
      {
        title: "Project questionnaire",
        text: "Your summary is prepared in your browser. Genyx does not send it to the server or CRM. Do not enter personal or confidential information.",
      },
      {
        title: "External services",
        text: "If you choose Google Calendar or WhatsApp, you access their services and policies. Genyx does not automatically send your draft to those providers.",
      },
      {
        title: "Test environment",
        text: "The n8n and CRM laboratory accepts synthetic records only. It is not intended to store real customer data.",
      },
      {
        title: "Before commercial launch",
        text: "The controller identity, retention periods and mechanisms for exercising rights must be defined before real submissions are enabled. This notice describes the prototype and is not a final policy.",
      },
    ],
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return { title: copy[locale].title, description: copy[locale].intro };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const text = copy[locale];
  return (
    <PortfolioShell locale={locale} path="/privacy">
      <p className="eyebrow">GENYX / PRIVACY</p>
      <h1>{text.title}</h1>
      <p className="description">{text.intro}</p>
      {text.sections.map((section) => (
        <section className="section" key={section.title}>
          <h2>{section.title}</h2>
          <p className="description">{section.text}</p>
        </section>
      ))}
    </PortfolioShell>
  );
}

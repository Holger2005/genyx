import Link from "next/link";
import { notFound } from "next/navigation";
import { bookingTimeZone, getBookingUrl } from "../../../config/booking";
import { consultation } from "../../../domain/consultation/consultation";
import { isLocale } from "../../../domain/locale";
import { PortfolioShell } from "../../../presentation/portfolio/portfolio-shell";

const copy = {
  es: {
    title: "Consultoría inicial",
    description: "Una conversación para entender tu proyecto y orientar los próximos pasos.",
    duration: "minutos",
    price: "Sin costo",
    agenda: "Agenda orientativa",
    discovery: "Conocer tu negocio y objetivo",
    requirements: "Explorar requisitos y alternativas técnicas",
    "next-steps": "Definir próximos pasos",
    prepare: "Preparar mi proyecto",
    status: "Reservas todavía no habilitadas",
    bookingTitle: "Reserva tu consultoría",
    bookingAction: "Consultar horarios en Google Calendar",
    bookingNotice: "Google gestiona la disponibilidad y la confirmación de la cita.",
    zone: "Zona horaria de referencia",
    notice:
      "La agenda de citas está en preparación. No se puede confirmar una reserva desde esta página.",
    scope: "La consulta inicial no incluye desarrollo ni una propuesta técnica definitiva.",
  },
  en: {
    title: "Initial consultation",
    description: "A conversation to understand your project and identify next steps.",
    duration: "minutes",
    price: "Free of charge",
    agenda: "Suggested agenda",
    discovery: "Understand your business and objective",
    requirements: "Explore requirements and technical alternatives",
    "next-steps": "Define next steps",
    prepare: "Prepare my project",
    status: "Booking not yet enabled",
    bookingTitle: "Book your consultation",
    bookingAction: "Check availability in Google Calendar",
    bookingNotice: "Google handles availability and appointment confirmation.",
    zone: "Reference time zone",
    notice: "Appointment scheduling is in development. No booking can be confirmed on this page.",
    scope: "The initial consultation does not include development or a final technical proposal.",
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return { title: copy[locale].title, description: copy[locale].description };
}

export default async function ConsultationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const text = copy[locale];
  const bookingUrl = getBookingUrl(process.env.GENYX_GOOGLE_BOOKING_URL);

  return (
    <PortfolioShell locale={locale} path="/consultation">
      <p className="eyebrow">GENYX / DISCOVERY SESSION</p>
      <h1>{text.title}</h1>
      <p className="description">{text.description}</p>
      <div className="consultation-facts">
        <span>
          {consultation.durationMinutes} {text.duration}
        </span>
        <span>{text.price}</span>
      </div>
      <section className="section" aria-labelledby="consultation-agenda">
        <h2 id="consultation-agenda">{text.agenda}</h2>
        <ol className="consultation-agenda">
          {consultation.agenda.map((item) => (
            <li key={item.id}>
              <span>{item.minutes} min</span>
              <strong>{text[item.id]}</strong>
            </li>
          ))}
        </ol>
        <p className="description">{text.scope}</p>
      </section>
      <section className="section" aria-labelledby="consultation-status">
        <h2 id="consultation-status">{bookingUrl ? text.bookingTitle : text.status}</h2>
        <p className="description">{bookingUrl ? text.bookingNotice : text.notice}</p>
        <p className="description">
          {text.zone}: {bookingTimeZone} (UTC−05:00)
        </p>
        {bookingUrl && (
          <a className="action action-primary" href={bookingUrl} rel="noreferrer">
            {text.bookingAction}
          </a>
        )}
        <Link className="action action-secondary" href={`/${locale}/inquiry`}>
          {text.prepare}
        </Link>
      </section>
    </PortfolioShell>
  );
}

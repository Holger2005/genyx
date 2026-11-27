"use client";

import { useState } from "react";
import { prepareInquiry, type InquiryResult } from "../../application/inquiry/prepare-inquiry";
import { inquiryLimits, timelines, type InquiryDraft } from "../../domain/inquiry/inquiry";
import type { Locale } from "../../domain/locale";

type ServiceOption = { readonly slug: string; readonly title: string };

const initial: InquiryDraft = { service: "", objective: "", details: "", timeline: "" };

const labels = {
  es: {
    service: "Servicio de interés",
    objective: "Objetivo del proyecto",
    details: "Contexto y necesidades",
    timeline: "Plazo aproximado",
    choose: "Selecciona una opción",
    prepare: "Preparar resumen",
    summary: "Tu resumen de proyecto",
    notice: "Este borrador no se envía ni se almacena. No incluyas datos personales o secretos.",
    ready: "Resumen preparado. Puedes copiarlo. El envío comercial todavía no está habilitado.",
    errors: {
      service: "Selecciona un servicio válido.",
      objective: "Escribe un objetivo de 5 a 100 caracteres.",
      details: "Describe las necesidades con 20 a 1200 caracteres.",
      timeline: "Selecciona un plazo aproximado.",
    },
    timelines: {
      exploring: "Estoy explorando opciones",
      urgent: "Menos de un mes",
      "one-to-three": "Entre uno y tres meses",
      "three-plus": "Más de tres meses",
    },
  },
  en: {
    service: "Service of interest",
    objective: "Project objective",
    details: "Context and requirements",
    timeline: "Estimated timeframe",
    choose: "Select an option",
    prepare: "Prepare summary",
    summary: "Your project summary",
    notice: "This draft is not sent or stored. Do not include personal data or secrets.",
    ready: "Summary prepared. You can copy it. Commercial submission is not enabled yet.",
    errors: {
      service: "Select a valid service.",
      objective: "Enter an objective of 5 to 100 characters.",
      details: "Describe your requirements in 20 to 1200 characters.",
      timeline: "Select an estimated timeframe.",
    },
    timelines: {
      exploring: "Exploring options",
      urgent: "Less than a month",
      "one-to-three": "One to three months",
      "three-plus": "More than three months",
    },
  },
} as const;

export function InquiryForm({
  locale,
  services,
}: {
  locale: Locale;
  services: readonly ServiceOption[];
}) {
  const copy = labels[locale];
  const [draft, setDraft] = useState<InquiryDraft>(initial);
  const [result, setResult] = useState<InquiryResult | null>(null);
  const errors = result && !result.ok ? result.errors : [];
  const service = services.find((item) => item.slug === draft.service);
  const timeline = timelines.find((item) => item === draft.timeline);

  function update(field: keyof InquiryDraft, value: string) {
    setDraft((previous) => ({ ...previous, [field]: value }));
    setResult(null);
  }

  function prepare() {
    const serviceIds = services.map((item) => item.slug);
    setResult(prepareInquiry(draft, serviceIds));
  }

  return (
    <section className="inquiry-panel" aria-label={copy.prepare}>
      <p id="inquiry-notice" className="inquiry-notice">
        {copy.notice}
      </p>
      <label htmlFor="inquiry-service">{copy.service}</label>
      <select
        id="inquiry-service"
        value={draft.service}
        aria-invalid={errors.includes("service")}
        aria-describedby="inquiry-notice"
        onChange={(event) => update("service", event.target.value)}
      >
        <option value="">{copy.choose}</option>
        {services.map((item) => (
          <option key={item.slug} value={item.slug}>
            {item.title}
          </option>
        ))}
      </select>
      <label htmlFor="inquiry-objective">{copy.objective}</label>
      <input
        id="inquiry-objective"
        value={draft.objective}
        maxLength={inquiryLimits.objective.max}
        aria-invalid={errors.includes("objective")}
        onChange={(event) => update("objective", event.target.value)}
      />
      <label htmlFor="inquiry-details">{copy.details}</label>
      <textarea
        id="inquiry-details"
        rows={5}
        value={draft.details}
        maxLength={inquiryLimits.details.max}
        aria-invalid={errors.includes("details")}
        onChange={(event) => update("details", event.target.value)}
      />
      <label htmlFor="inquiry-timeline">{copy.timeline}</label>
      <select
        id="inquiry-timeline"
        value={draft.timeline}
        aria-invalid={errors.includes("timeline")}
        onChange={(event) => update("timeline", event.target.value)}
      >
        <option value="">{copy.choose}</option>
        {timelines.map((item) => (
          <option key={item} value={item}>
            {copy.timelines[item]}
          </option>
        ))}
      </select>
      <button type="button" className="action action-primary" onClick={prepare}>
        {copy.prepare}
      </button>
      <div aria-live="polite">
        {errors.length > 0 && (
          <ul className="inquiry-errors">
            {errors.map((field) => (
              <li key={field}>{copy.errors[field]}</li>
            ))}
          </ul>
        )}
        {result?.ok && (
          <div className="inquiry-result">
            <p>{copy.ready}</p>
            <label htmlFor="inquiry-summary">{copy.summary}</label>
            <textarea
              id="inquiry-summary"
              rows={8}
              readOnly
              value={[
                `${copy.service}: ${service?.title ?? result.value.service}`,
                `${copy.objective}: ${result.value.objective}`,
                `${copy.details}: ${result.value.details}`,
                `${copy.timeline}: ${timeline ? copy.timelines[timeline] : result.value.timeline}`,
              ].join("\n\n")}
            />
          </div>
        )}
      </div>
    </section>
  );
}

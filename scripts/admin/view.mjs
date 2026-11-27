import { canTransition, leadStages } from "../../src/domain/crm/lead.ts";

const labels = {
  new: "Nuevo",
  contacted: "Contactado",
  consultation: "Consultoría",
  proposal: "Propuesta",
  won: "Ganado",
  lost: "Perdido",
  high: "Alta",
  normal: "Normal",
  low: "Baja",
};

function escape(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const style = `
  *{box-sizing:border-box} body{margin:0;background:#101012;color:#f5f5f7;
    font:16px/1.6 system-ui,sans-serif} main{max-width:1120px;margin:auto;padding:32px 20px 64px}
  header{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap}
  .brand{font-weight:800;letter-spacing:.28em} .muted{color:#b5b5bd}
  h1{font-size:clamp(1.8rem,5vw,3rem);line-height:1.15;margin:32px 0 12px}
  h2{font-size:1.2rem} .card{border:1px solid #38383f;border-radius:16px;padding:20px;background:#19191d}
  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:12px}
  .metric strong{display:block;font-size:2rem} .lead{margin-top:16px;overflow-wrap:anywhere}
  .login{max-width:460px;margin:10vh auto} label{display:block;margin-bottom:8px}
  input,select,button{font:inherit;border:1px solid #777780;border-radius:9px;padding:10px 14px}
  input,select{background:#101012;color:#f5f5f7;max-width:100%}
  input{width:100%} button{background:#ededf0;color:#101012;font-weight:650;cursor:pointer}
  form{margin:12px 0;display:flex;gap:10px;flex-wrap:wrap;align-items:center}
  .login form{display:grid} :focus-visible{outline:3px solid #86b8ff;outline-offset:3px}
  .badge{border:1px solid #73737b;border-radius:30px;padding:3px 10px;font-size:.85rem}
  .error{color:#ffc2c2} a{color:#c9dfff} li{margin:6px 0}
`;

function layout(title, content) {
  return `<!doctype html><html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>${escape(title)} | GENYX</title>
<style>${style}</style></head><body><main>${content}</main></body></html>`;
}

export function loginPage(error = "") {
  return layout(
    "Acceso administrativo",
    `<section class="card login"><p class="brand">GENYX</p>
<h1>Acceso privado</h1><p class="muted">Laboratorio local · Solo datos sintéticos</p>
${error ? `<p class="error" role="alert">${escape(error)}</p>` : ""}
<form method="post" action="/login"><label for="token">Clave de acceso local</label>
<input id="token" name="token" type="password" autocomplete="current-password"
required maxlength="64"><button>Iniciar sesión</button></form></section>`,
  );
}

function metric(label, value) {
  return `<div class="card metric"><span class="muted">${escape(label)}</span>
<strong>${value}</strong></div>`;
}

export function dashboardPage(repository, csrf, error = "") {
  const leads = repository.list();
  const cards = [
    metric("Prospectos", leads.length),
    metric("Abiertos", leads.filter((lead) => !["won", "lost"].includes(lead.stage)).length),
    metric("Ganados", leads.filter((lead) => lead.stage === "won").length),
    metric("Perdidos", leads.filter((lead) => lead.stage === "lost").length),
  ].join("");
  const records = leads
    .map((lead) => {
      const options = leadStages
        .filter((stage) => canTransition(lead.stage, stage))
        .map((stage) => `<option value="${escape(stage)}">${escape(labels[stage])}</option>`)
        .join("");
      const events = repository
        .history(lead.id)
        .map(
          (event) =>
            `<li>${escape(labels[event.stage])} · <time>${escape(event.occurredAt)}</time></li>`,
        )
        .join("");
      return `<article class="card lead"><h2>${escape(lead.id)}</h2>
<p>${escape(lead.service)} · Prioridad ${escape(labels[lead.priority])}
· <span class="badge">${escape(labels[lead.stage])}</span></p>
${
  options
    ? `<form method="post" action="/move">
<input type="hidden" name="csrf" value="${escape(csrf)}">
<input type="hidden" name="id" value="${escape(lead.id)}">
<label for="stage-${escape(lead.id)}">Nuevo estado</label>
<select id="stage-${escape(lead.id)}" name="stage">${options}</select>
<button>Guardar cambio</button></form>`
    : "<p>Oportunidad cerrada.</p>"
}
<details><summary>Historial</summary><ol>${events}</ol></details></article>`;
    })
    .join("");
  return layout(
    "CRM",
    `<header><span class="brand">GENYX / CRM</span>
<form method="post" action="/logout"><input type="hidden" name="csrf" value="${escape(csrf)}">
<button>Cerrar sesión</button></form></header>
<h1>Panel comercial</h1><p class="muted">Laboratorio privado · Registros ficticios</p>
${error ? `<p class="error" role="alert">${escape(error)}</p>` : ""}
<div class="grid">${cards}</div><h2>Oportunidades</h2>
${records || '<p class="muted">Sin registros. Crea el ejemplo con npm run crm -- demo.</p>'}`,
  );
}

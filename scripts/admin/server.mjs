import { randomBytes, timingSafeEqual } from "node:crypto";
import { createServer } from "node:http";
import { moveLead } from "../../src/application/crm/lead-repository.ts";
import { dashboardPage, loginPage } from "./view.mjs";

const sessionLifetime = 30 * 60 * 1000;
const failureWindow = 60 * 1000;
const cookieName = "genyx_admin_session";

function randomToken() {
  return randomBytes(32).toString("hex");
}

function equalToken(left, right) {
  return (
    typeof left === "string" &&
    /^[a-f0-9]{64}$/.test(left) &&
    timingSafeEqual(Buffer.from(left, "hex"), Buffer.from(right, "hex"))
  );
}

function headers(response) {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("X-Frame-Options", "DENY");
  response.setHeader("Referrer-Policy", "no-referrer");
  response.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.setHeader(
    "Content-Security-Policy",
    "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'",
  );
}

function html(response, status, content) {
  response.writeHead(status, { "Content-Type": "text/html; charset=utf-8" });
  response.end(content);
}

function redirect(response) {
  response.writeHead(303, { Location: "/" });
  response.end();
}

function setCookie(response, token, maxAge) {
  response.setHeader(
    "Set-Cookie",
    `${cookieName}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}`,
  );
}

async function readForm(request) {
  if (request.headers["content-type"]?.split(";")[0] !== "application/x-www-form-urlencoded") {
    throw new Error("Unsupported form");
  }
  let length = 0;
  const chunks = [];
  for await (const chunk of request) {
    length += chunk.length;
    if (length > 2048) throw new Error("Form too large");
    chunks.push(chunk);
  }
  const params = new URLSearchParams(Buffer.concat(chunks).toString("utf8"));
  if (new Set(params.keys()).size !== [...params.keys()].length) throw new Error("Duplicate fields");
  return params;
}

export function createAdminServer(repository, accessToken, clock = Date.now) {
  if (!/^[a-f0-9]{64}$/.test(accessToken ?? "")) {
    throw new Error("Set GENYX_ADMIN_TOKEN to a fresh 32-byte hexadecimal token");
  }
  let session = null;
  let failures = [];
  const server = createServer(async (request, response) => {
    headers(response);
    const address = server.address();
    const host = `127.0.0.1:${address.port}`;
    const origin = `http://${host}`;
    if (request.headers.host !== host || request.socket.remoteAddress !== "127.0.0.1") {
      return html(response, 403, "Forbidden");
    }
    if (session && clock() >= session.expiresAt) session = null;
    const cookies = (request.headers.cookie ?? "").split(";").map((value) => value.trim());
    const matching = cookies.filter((value) => value.startsWith(cookieName + "="));
    const authenticated =
      session && matching.length === 1 && equalToken(matching[0].split("=")[1], session.id);

    try {
      if (request.method === "GET" && request.url === "/") {
        return html(
          response,
          200,
          authenticated ? dashboardPage(repository, session.csrf) : loginPage(),
        );
      }
      if (request.method !== "POST") return html(response, 404, "Not found");
      if (request.headers.origin !== origin) return html(response, 403, "Forbidden");
      if (!["/login", "/logout", "/move"].includes(request.url)) {
        return html(response, 404, "Not found");
      }
      if (request.url === "/login") {
        failures = failures.filter((time) => clock() - time < failureWindow);
        if (failures.length >= 5) {
          response.setHeader("Retry-After", "60");
          return html(response, 429, loginPage("Demasiados intentos. Intenta nuevamente más tarde."));
        }
        const form = await readForm(request);
        if ([...form.keys()].length !== 1 || !equalToken(form.get("token"), accessToken)) {
          failures.push(clock());
          return html(response, 401, loginPage("Clave incorrecta."));
        }
        failures = [];
        session = { id: randomToken(), csrf: randomToken(), expiresAt: clock() + sessionLifetime };
        setCookie(response, session.id, sessionLifetime / 1000);
        return redirect(response);
      }
      if (!authenticated) return html(response, 401, loginPage());
      const form = await readForm(request);
      if (!session || !equalToken(form.get("csrf"), session.csrf)) {
        return html(response, 403, "Forbidden");
      }
      if (request.url === "/logout") {
        session = null;
        setCookie(response, "", 0);
        return redirect(response);
      }
      try {
        if ([...form.keys()].length !== 3) throw new Error("Invalid form");
        moveLead(
          repository,
          form.get("id") ?? "",
          form.get("stage") ?? "",
          new Date(clock()).toISOString(),
        );
      } catch {
        return html(response, 400, dashboardPage(repository, session.csrf, "Cambio no permitido."));
      }
      return redirect(response);
    } catch {
      if (!response.headersSent) html(response, 400, "Request refused");
      else response.end();
    }
  });
  server.requestTimeout = 10000;
  server.headersTimeout = 5000;
  server.maxHeadersCount = 32;
  return server;
}

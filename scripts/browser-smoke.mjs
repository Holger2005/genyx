import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";

const origin = "http://127.0.0.1:3190";
const profile = await mkdtemp(join(tmpdir(), "genyx-browser-"));
const processes = [];
let socket;

function launch(command, args) {
  const child = spawn(command, args, {
    stdio: ["ignore", "ignore", "inherit"],
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
  });
  const state = { child, error: null };
  child.on("error", (error) => {
    state.error = error;
  });
  processes.push(state);
}

async function waitFor(check, label) {
  const end = Date.now() + 15000;
  let lastError;
  while (Date.now() < end) {
    for (const { child, error } of processes) {
      if (error) throw error;
      if (child.exitCode !== null) throw new Error(`Process exited: ${child.exitCode}`);
    }
    try {
      const result = await check();
      if (result) return result;
    } catch (error) {
      lastError = error;
    }
    await delay(120);
  }
  throw new Error(`Timed out: ${label}`, { cause: lastError });
}

async function request(path) {
  return fetch(origin + path, {
    redirect: "manual",
    signal: AbortSignal.timeout(3000),
  });
}

function connect(url) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url);
    const timer = setTimeout(() => {
      ws.close();
      reject(new Error("DevTools connection timed out"));
    }, 5000);
    ws.addEventListener(
      "open",
      () => {
        clearTimeout(timer);
        resolve(ws);
      },
      { once: true },
    );
    ws.addEventListener(
      "error",
      () => {
        clearTimeout(timer);
        reject(new Error("DevTools connection failed"));
      },
      { once: true },
    );
  });
}

let sequence = 0;

function command(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++sequence;
    const timer = setTimeout(() => {
      socket.removeEventListener("message", receive);
      reject(new Error(`DevTools timeout: ${method}`));
    }, 5000);

    function receive(event) {
      const message = JSON.parse(event.data);
      if (message.id !== id) return;
      clearTimeout(timer);
      socket.removeEventListener("message", receive);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result);
    }

    socket.addEventListener("message", receive);
    socket.send(JSON.stringify({ id, method, params }));
  });
}

async function evaluate(expression) {
  const response = await command("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (response.exceptionDetails) throw new Error("Browser evaluation failed");
  return response.result.value;
}

async function key(name, code) {
  const text = name === "Enter" ? "\r" : undefined;
  await command("Input.dispatchKeyEvent", {
    type: text ? "keyDown" : "rawKeyDown",
    key: name,
    code: name,
    windowsVirtualKeyCode: code,
    ...(text ? { text, unmodifiedText: text } : {}),
  });
  await command("Input.dispatchKeyEvent", {
    type: "keyUp",
    key: name,
    code: name,
    windowsVirtualKeyCode: code,
  });
}

try {
  launch(process.execPath, [
    "node_modules/next/dist/bin/next",
    "start",
    "--hostname",
    "127.0.0.1",
    "--port",
    "3190",
  ]);
  await waitFor(async () => (await request("/es")).ok, "production server");

  const root = await request("/");
  assert.ok([307, 308].includes(root.status), "Root redirects");
  assert.equal(root.headers.get("location"), "/es");
  assert.equal((await request("/fr")).status, 404);

  for (const locale of ["es", "en"]) {
    const response = await request(`/${locale}`);
    assert.equal(response.status, 200);
    const headers = response.headers;
    assert.equal(headers.get("x-content-type-options"), "nosniff");
    assert.equal(headers.get("x-frame-options"), "DENY");
    assert.equal(headers.get("referrer-policy"), "strict-origin-when-cross-origin");
    assert.equal(headers.get("permissions-policy"), "camera=(), microphone=(), geolocation=()");
    assert.equal(headers.get("x-powered-by"), null);
    const csp = headers.get("content-security-policy") ?? "";
    for (const directive of [
      "object-src 'none'",
      "base-uri 'self'",
      "frame-ancestors 'none'",
      "form-action 'self'",
    ]) {
      assert.ok(csp.includes(directive), directive);
    }
    assert.match(await response.text(), new RegExp(`<html lang="${locale}"`));
    for (const [suffix, expected] of [
      ["projects", 200],
      ["projects/genyx", 200],
      ["projects/unpublished", 404],
    ]) {
      const path = `/${locale}/${suffix}`;
      const result = await request(path);
      assert.equal(
        result.status,
        expected,
        `Unexpected HTTP status for ${path}; run npm run build`,
      );
    }
  }
  console.log("HTTP, locale and security header checks passed");

  const chromeArgs = [
    "--headless",
    "--disable-dev-shm-usage",
    "--disable-background-networking",
    "--no-first-run",
    "--remote-debugging-address=127.0.0.1",
    "--remote-debugging-port=0",
    `--user-data-dir=${profile}`,
    "about:blank",
  ];
  launch(process.env.CHROME_PATH || "google-chrome", chromeArgs);

  const port = await waitFor(async () => {
    const value = await readFile(join(profile, "DevToolsActivePort"), "utf8");
    return Number(value.split("\n")[0]) || null;
  }, "Chrome DevTools");
  const target = await waitFor(async () => {
    const response = await fetch(`http://127.0.0.1:${port}/json/list`, {
      signal: AbortSignal.timeout(3000),
    });
    const targets = await response.json();
    return targets.find((item) => item.type === "page" && item.webSocketDebuggerUrl);
  }, "Chrome page target");
  socket = await connect(target.webSocketDebuggerUrl);

  await command("Page.enable");
  await command("Page.bringToFront");
  await command("Emulation.setFocusEmulationEnabled", { enabled: true });
  await command("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });

  for (const locale of ["es", "en"]) {
    await command("Page.navigate", { url: `${origin}/${locale}` });
    await waitFor(
      () =>
        evaluate(
          `document.readyState === "complete" && document.documentElement.lang === "${locale}"`,
        ),
      `load ${locale}`,
    );
    const summary = await evaluate(`({
      headings: document.querySelectorAll("h1").length,
      main: document.querySelectorAll("main").length,
      services: document.querySelectorAll(".service-card").length,
      fallback: getComputedStyle(document.querySelector(".sculpture-art")).visibility,
      reduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
      webglReady: !!document.querySelector(".sculpture-canvas[data-ready=true]")
    })`);
    assert.equal(summary.headings, 1);
    assert.equal(summary.main, 1);
    assert.equal(summary.services, 6);
    assert.equal(summary.fallback, "visible");
    assert.equal(summary.reduced, true);
    assert.equal(summary.webglReady, false);

    for (const width of [320, 768, 1440, 3840]) {
      await command("Emulation.setDeviceMetricsOverride", {
        width,
        height: 900,
        deviceScaleFactor: 1,
        mobile: false,
      });
      await waitFor(() => evaluate(`innerWidth === ${width}`), "viewport resize");
      const layout = await evaluate(`(async () => {
        await document.fonts.ready;
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        const viewport = document.documentElement.clientWidth;
        return {
          viewport,
          scrollWidth: document.documentElement.scrollWidth,
          overflowing: [...document.querySelectorAll("main *, header *, footer *")]
            .filter(element => element.getBoundingClientRect().right > viewport + 1)
            .slice(0, 8)
            .map(element => element.tagName + "." + (element.getAttribute("class") || ""))
        };
      })()`);
      assert.ok(
        layout.scrollWidth <= layout.viewport + 1,
        `Horizontal overflow at ${locale}/${width}px: ${JSON.stringify(layout)}`,
      );
    }

    await waitFor(async () => {
      if (await evaluate("document.querySelector('dialog').open")) return true;
      const focused = await evaluate(`(() => {
        const button = document.querySelector("button[aria-haspopup=dialog]");
        button.focus();
        return document.activeElement === button;
      })()`);
      assert.ok(focused, "Menu trigger receives keyboard focus");
      await key("Enter", 13);
      return evaluate("document.querySelector('dialog').open");
    }, "keyboard opens modal");
    await key("Escape", 27);
    await waitFor(() => evaluate("!document.querySelector('dialog').open"), "Escape closes modal");
    assert.equal(await evaluate("document.activeElement.getAttribute('aria-haspopup')"), "dialog");

    const metrics = await evaluate(`({
      decodedScriptBytes: performance.getEntriesByType("resource")
        .filter(entry => entry.initiatorType === "script" || /\\.js(\\?|$)/.test(entry.name))
        .reduce((sum, entry) => sum + entry.decodedBodySize, 0),
      navigationMs: performance.getEntriesByType("navigation")[0]?.duration ?? 0
    })`);
    console.log(locale, JSON.stringify(metrics));
    assert.ok(metrics.decodedScriptBytes <= 1048576, "Initial decoded JS budget: 1 MiB");
  }
  for (const locale of ["es", "en"]) {
    await command("Emulation.setDeviceMetricsOverride", {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    const path = `/${locale}/projects/genyx`;
    await command("Page.navigate", { url: origin + path });
    const loaded = `document.readyState === "complete" && location.pathname === "${path}"`;
    await waitFor(() => evaluate(loaded), "case study loaded");
    await waitFor(
      () =>
        evaluate(`(() => {
          const images = [...document.querySelectorAll(".media-card img")];
          return images.length === 2 && images.every(img => img.complete && img.naturalWidth > 0);
        })()`),
      "project media loaded",
    );
    assert.equal(await evaluate("document.querySelectorAll('.demo-stage').length"), 1);
    assert.equal(await evaluate("document.querySelectorAll('.media-card video').length"), 0);

    if (process.env.GENYX_CAPTURE === "1") {
      const folder = ".artifacts/genyx-media";
      await mkdir(folder, { recursive: true });
      await evaluate("document.fonts.ready.then(() => true)");
      const screenshot = await command("Page.captureScreenshot", { format: "png" });
      await writeFile(join(folder, `genyx-case-study-${locale}.png`), screenshot.data, "base64");
      await evaluate("document.getElementById('gallery-title').scrollIntoView()");
      const gallery = await command("Page.captureScreenshot", { format: "png" });
      await writeFile(join(folder, `genyx-gallery-${locale}.png`), gallery.data, "base64");
    }
  }
  console.log("Browser smoke checks passed (Chromium, reduced motion)");
} finally {
  socket?.close();
  for (const { child } of processes.reverse()) child.kill();
  await delay(400);
  await rm(profile, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 });
}

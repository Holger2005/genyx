"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "../../domain/locale";
import { normalizedPointer } from "../graphics/ambient-motion";
import { createSculptureRenderer } from "../graphics/sculpture-renderer";

export function SculptureCanvas({ locale }: { locale: Locale }) {
  const [enabled, setEnabled] = useState(false);
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    if (typeof IntersectionObserver === "undefined" || typeof ResizeObserver === "undefined") {
      return;
    }

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 900px) and (hover: hover) and (pointer: fine)");
    const permitted = () => enabled || desktop.matches;
    let renderer: ReturnType<typeof createSculptureRenderer> = null;
    let frame = 0;
    let visible = false;
    let unavailable = false;
    let x = 0;
    let y = 0;

    function hide() {
      if (canvas) delete canvas.dataset.ready;
    }

    function render() {
      frame = 0;
      if (!canvas || !host || !visible || motion.matches || document.hidden || unavailable) return;
      if (!permitted()) return;
      renderer ??= createSculptureRenderer(canvas);
      if (!renderer) {
        unavailable = true;
        hide();
        return;
      }
      const rect = host.getBoundingClientRect();
      const progress = Math.max(-1, Math.min(1, -rect.top / Math.max(window.innerHeight, 1)));
      if (renderer.draw(x, y, progress * 0.8)) canvas.dataset.ready = "true";
      else hide();
    }

    function schedule() {
      if (!permitted()) return;
      if (!frame && visible && !motion.matches && !document.hidden && !unavailable) {
        frame = window.requestAnimationFrame(render);
      }
    }

    function pointer(event: PointerEvent) {
      if (!host || event.pointerType === "touch") return;
      const rect = host.getBoundingClientRect();
      x = normalizedPointer(event.clientX, rect.left, rect.width);
      y = normalizedPointer(event.clientY, rect.top, rect.height);
      schedule();
    }

    function reset() {
      x = 0;
      y = 0;
      schedule();
    }

    function preference() {
      if (motion.matches || !permitted()) hide();
      else schedule();
    }

    function lost(event: Event) {
      event.preventDefault();
      renderer = null;
      unavailable = true;
      hide();
    }

    function restored() {
      unavailable = false;
      schedule();
    }

    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      schedule();
    });
    const resize = new ResizeObserver(schedule);
    intersection.observe(host);
    resize.observe(host);
    host.addEventListener("pointermove", pointer, { passive: true });
    host.addEventListener("pointerleave", reset);
    window.addEventListener("scroll", schedule, { passive: true });
    document.addEventListener("visibilitychange", schedule);
    motion.addEventListener("change", preference);
    desktop.addEventListener("change", preference);
    canvas.addEventListener("webglcontextlost", lost);
    canvas.addEventListener("webglcontextrestored", restored);

    return () => {
      window.cancelAnimationFrame(frame);
      intersection.disconnect();
      resize.disconnect();
      host.removeEventListener("pointermove", pointer);
      host.removeEventListener("pointerleave", reset);
      window.removeEventListener("scroll", schedule);
      document.removeEventListener("visibilitychange", schedule);
      motion.removeEventListener("change", preference);
      desktop.removeEventListener("change", preference);
      canvas.removeEventListener("webglcontextlost", lost);
      canvas.removeEventListener("webglcontextrestored", restored);
      renderer?.dispose();
      hide();
    };
  }, [enabled]);

  return (
    <>
      <canvas ref={ref} className="sculpture-canvas" aria-hidden="true" />
      <button
        type="button"
        className="sculpture-activation"
        aria-pressed={enabled}
        onClick={() => setEnabled((value) => !value)}
      >
        {locale === "es" ? "Vista 3D" : "3D view"}
      </button>
    </>
  );
}

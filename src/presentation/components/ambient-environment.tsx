"use client";

import { useEffect, useRef } from "react";
import { normalizedPointer } from "../graphics/ambient-motion";

export function AmbientEnvironment() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = ref.current;
    const host = layer?.parentElement;
    if (!layer || !host) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let frame = 0;
    let x = 0;
    let y = 0;

    function paint() {
      frame = 0;
      if (!layer) return;
      layer.style.setProperty("--ambient-x", `${50 + x * 25}%`);
      layer.style.setProperty("--ambient-y", `${50 + y * 25}%`);
    }

    function schedule() {
      if (!frame) frame = window.requestAnimationFrame(paint);
    }

    function reset() {
      x = 0;
      y = 0;
      schedule();
    }

    function move(event: PointerEvent) {
      if (!host || motion.matches || !finePointer.matches || event.pointerType === "touch") return;
      const rect = host.getBoundingClientRect();
      x = normalizedPointer(event.clientX, rect.left, rect.width);
      y = normalizedPointer(event.clientY, rect.top, rect.height);
      schedule();
    }

    host.addEventListener("pointermove", move, { passive: true });
    host.addEventListener("pointerleave", reset);
    motion.addEventListener("change", reset);
    finePointer.addEventListener("change", reset);
    document.addEventListener("visibilitychange", reset);

    return () => {
      window.cancelAnimationFrame(frame);
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", reset);
      motion.removeEventListener("change", reset);
      finePointer.removeEventListener("change", reset);
      document.removeEventListener("visibilitychange", reset);
    };
  }, []);

  return (
    <div ref={ref} className="ambient-environment" aria-hidden="true">
      <div className="ambient-glow" />
      <div className="ambient-grid" />
      <div className="ambient-particles" />
    </div>
  );
}

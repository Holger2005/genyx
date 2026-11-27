"use client";

import { useRef } from "react";

interface MenuLink {
  readonly href: string;
  readonly label: string;
}

export function CinematicMenu({
  menu,
  close,
  links,
}: {
  menu: string;
  close: string;
  links: readonly MenuLink[];
}) {
  const dialog = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        className="menu-trigger"
        type="button"
        aria-haspopup="dialog"
        onClick={() => {
          if (dialog.current && !dialog.current.open) dialog.current.showModal();
        }}
      >
        {menu}
        <span aria-hidden="true" className="menu-icon" />
      </button>
      <dialog ref={dialog} className="cinematic-menu" aria-label={menu}>
        <div className="menu-top">
          <span className="eyebrow">GENYX / INDEX</span>
          <button className="menu-trigger" type="button" onClick={() => dialog.current?.close()}>
            {close} <span aria-hidden="true">×</span>
          </button>
        </div>
        <nav aria-label={menu}>
          {links.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => {
                dialog.current?.close();
                const target = document.getElementById(link.href.slice(1));
                target?.focus({ preventScroll: true });
              }}
            >
              <span className="menu-number">{String(index + 1).padStart(2, "0")}</span>
              <span>{link.label}</span>
              <span aria-hidden="true" className="menu-arrow">
                ↗
              </span>
            </a>
          ))}
        </nav>
      </dialog>
    </>
  );
}

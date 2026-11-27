import type { Locale } from "../../domain/locale";
import { SculptureCanvas } from "./sculpture-canvas";

export function SculpturePreview({ locale }: { locale: Locale }) {
  return (
    <div className="sculpture">
      <svg viewBox="0 0 560 560" fill="none" className="sculpture-art" aria-hidden="true">
        <defs>
          <linearGradient
            id="metal"
            x1="30"
            y1="60"
            x2="490"
            y2="510"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#f5f5f7" />
            <stop offset=".24" stopColor="#515153" />
            <stop offset=".43" stopColor="#d7d7dc" />
            <stop offset=".63" stopColor="#29292b" />
            <stop offset=".82" stopColor="#aaaab0" />
            <stop offset="1" stopColor="#f5f5f7" />
          </linearGradient>
          <linearGradient
            id="glass"
            x1="120"
            y1="80"
            x2="430"
            y2="490"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#f5f5f7" stopOpacity=".46" />
            <stop offset=".5" stopColor="#9a9aa0" stopOpacity=".05" />
            <stop offset="1" stopColor="#f5f5f7" stopOpacity=".36" />
          </linearGradient>
        </defs>
        <circle cx="280" cy="280" r="235" stroke="#29292b" strokeDasharray="2 11" />
        <circle cx="280" cy="280" r="202" stroke="#222224" />
        <g className="sculpture-core">
          <path
            d="M280 65 465 172 465 388 280 495 95 388 95 172Z"
            fill="url(#glass)"
            stroke="url(#metal)"
            strokeWidth="3"
          />
          <path
            d="M280 65 280 280 465 388M95 172 280 280 465 172M95 388 280 280 280 495"
            stroke="url(#metal)"
            strokeWidth="2"
          />
          <path
            d="M280 112 424 195 424 365 280 448 136 365 136 195Z"
            stroke="url(#metal)"
            strokeWidth="14"
            strokeLinejoin="round"
          />
          <path
            d="M347 207H240L198 280L240 353H347L389 280H280"
            stroke="url(#metal)"
            strokeWidth="23"
            strokeLinejoin="round"
          />
          <path d="M280 112 136 365 424 365Z" stroke="#f5f5f7" strokeOpacity=".28" />
        </g>
      </svg>
      <SculptureCanvas locale={locale} />
      <span className="sculpture-index" aria-hidden="true">
        G / 001
      </span>
    </div>
  );
}

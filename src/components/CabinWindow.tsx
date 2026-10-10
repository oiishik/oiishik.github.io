import { useId } from "react";
import type { Theme } from "./ThemeProvider";
import "./window-hero.css";

export function CabinWindow({ theme, className = "" }: { theme: Theme; className?: string }) {
  const id = useId().replace(/:/g, "");
  const glass = `${id}-glass`;
  const sky = `${id}-sky`;
  const halo = `${id}-halo`;

  return (
    <div
      className={`sde-window sde-window--${theme === "dark" ? "dark" : "light"} ${className}`.trim()}
      aria-hidden="true"
    >
      <div className="win">
        <svg className="sde-window-svg" viewBox="0 0 400 520" focusable="false" aria-hidden="true">
          <defs>
            <clipPath id={glass}>
              <rect x="70" y="50" width="260" height="420" rx="130" />
            </clipPath>
            <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" className="sky-a" />
              <stop offset="0.6" className="sky-b" />
              <stop offset="1" className="sky-c" />
            </linearGradient>
            <radialGradient id={halo}>
              <stop offset="0.35" className="halo-a" />
              <stop offset="1" className="halo-b" />
            </radialGradient>
          </defs>
          <rect className="win-frame" x="36" y="16" width="328" height="488" rx="164" />
          <rect className="win-bezel" x="56" y="36" width="288" height="448" rx="144" />
          <g clipPath={`url(#${glass})`}>
            <rect x="60" y="40" width="280" height="440" fill={`url(#${sky})`} />
            <g className="win-stars">
              <circle className="s1" cx="112" cy="168" r="1.8" />
              <circle className="s2" cx="164" cy="140" r="1.3" />
              <circle className="s3" cx="226" cy="186" r="1.6" />
              <circle className="s2" cx="292" cy="150" r="1.2" />
              <circle className="s1" cx="136" cy="240" r="1.2" />
              <circle className="s3" cx="302" cy="226" r="1.5" />
              <circle className="s2" cx="196" cy="262" r="1.1" />
            </g>
            <circle className="win-halo" cx="250" cy="292" r="96" fill={`url(#${halo})`} />
            <circle className="win-sun" cx="250" cy="292" r="36" />
            <path className="win-moon" d="M248.8 254 A32 32 0 1 0 279.5 298.4 A27 27 0 1 1 248.8 254 Z" />
            <g transform="translate(0 212)">
              <g className="win-jet">
                <path className="jet-trail" d="M34 6 L150 9" />
                <path
                  className="jet"
                  d="M0 6 L14 4.6 L20 0 L22.5 0 L19 4.4 L28 3.8 L30 2 L31.5 2 L30.6 5 L31.5 8 L30 8 L28 6.2 L19 5.6 L22.5 10 L20 10 L14 5.4 Z"
                />
              </g>
            </g>
            <g transform="translate(0 132)">
              <g className="puff p1">
                <circle cx="0" cy="0" r="14" />
                <circle cx="17" cy="-6" r="18" />
                <circle cx="37" cy="1" r="13" />
                <rect x="-2" y="0" width="41" height="14" rx="7" />
              </g>
            </g>
            <g transform="translate(0 250)">
              <g className="puff p2">
                <circle cx="0" cy="0" r="10" />
                <circle cx="12" cy="-5" r="13" />
                <circle cx="26" cy="0" r="9" />
                <rect x="-1" y="0" width="28" height="9" rx="4.5" />
              </g>
            </g>
            <g transform="translate(0 196)">
              <g className="puff p4">
                <circle cx="0" cy="0" r="9" />
                <circle cx="11" cy="-4" r="12" />
                <circle cx="24" cy="0" r="8" />
                <rect x="-1" y="0" width="26" height="8" rx="4" />
              </g>
            </g>
            <g transform="translate(0 330)">
              <g className="puff p3">
                <circle cx="0" cy="0" r="13" />
                <circle cx="15" cy="-6" r="17" />
                <circle cx="33" cy="1" r="12" />
                <rect x="-1" y="0" width="35" height="12" rx="6" />
              </g>
            </g>
            <path
              className="sea-far"
              d="M0 380 q25 -18 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 V480 H0 Z"
            />
            <path
              className="sea-near"
              d="M0 414 q35 -26 70 0 t70 0 t70 0 t70 0 t70 0 t70 0 t70 0 t70 0 t70 0 t70 0 V480 H0 Z"
            />
            <path className="win-glare" d="M122 118 L100 178 M146 104 L110 204" />
            <rect className="win-shade" x="60" y="40" width="280" height="64" />
            <rect className="shade-edge" x="60" y="100" width="280" height="6" />
            <rect className="shade-handle" x="182" y="108" width="36" height="7" rx="3.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

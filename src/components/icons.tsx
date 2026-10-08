import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function base(props: IconProps): IconProps {
  return {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    ...props,
  };
}

export function WordmarkMark(props: IconProps) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <rect width="32" height="32" rx="8" fill="#3A2BB8" />
      <path
        d="M11.2 7.2 17.2 24.8"
        stroke="white"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M16 7.2 22 24.8"
        stroke="white"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M20 14.5A7.5 7.5 0 1 1 9.5 4 6 6 0 0 0 20 14.5Z" />
    </svg>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.1 5.1l1.6 1.6M17.3 17.3l1.6 1.6M18.9 5.1l-1.6 1.6M6.7 17.3l-1.6 1.6" />
    </svg>
  );
}

export function TicketIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 8.5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1.2a2 2 0 0 0 0 4V15.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1.8a2 2 0 0 0 0-4Z" />
      <path d="M12 7.2v9.6" strokeDasharray="1.6 2.2" />
    </svg>
  );
}

export function PlaneIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 12.5 21 4l-4.2 16-4.3-4.2L8 19.5l1.2-4.2Z" />
    </svg>
  );
}

export function SuitcaseIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="5" y="7" width="14" height="12" rx="2" />
      <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M5 12h14" />
    </svg>
  );
}

export function CabinBagIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="7" y="8" width="10" height="11" rx="2" />
      <path d="M9 8V6.2A1.2 1.2 0 0 1 10.2 5h3.6A1.2 1.2 0 0 1 15 6.2V8" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m5 12.5 4.2 4.2L19 7.5" />
    </svg>
  );
}

export function PersonIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="8" r="3" />
      <path d="M5.5 19.5c1.2-3 3.4-4.5 6.5-4.5s5.3 1.5 6.5 4.5" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

export function LinkIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M10 13a4 4 0 0 0 6 0l2-2a4 4 0 0 0-5.7-5.6L11 6.6" />
      <path d="M14 11a4 4 0 0 0-6 0l-2 2a4 4 0 0 0 5.7 5.6L13 17.4" />
    </svg>
  );
}

export function ExternalIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M14 5h5v5" />
      <path d="M19 5 10 14" />
      <path d="M17 13.5V19H5V7h5.5" />
    </svg>
  );
}

export function IdIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3.5" y="5" width="17" height="14" rx="2" />
      <circle cx="9" cy="12" r="2" />
      <path d="M13 10.5h5M13 13.5h4" />
    </svg>
  );
}

export function TagIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 12.5 11.5 5H19v7.5L11.5 20Z" />
      <circle cx="15.5" cy="8.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function GearIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 13.2a7.4 7.4 0 0 0 .1-2.4l1.7-1.3-1.6-2.7-2 .5a7.6 7.6 0 0 0-2.1-1.2L15 4h-3l-.5 2.1a7.6 7.6 0 0 0-2.1 1.2l-2-.5-1.6 2.7 1.7 1.3a7.4 7.4 0 0 0 .1 2.4l-1.7 1.3 1.6 2.7 2-.5a7.6 7.6 0 0 0 2.1 1.2L12 20h3l.5-2.1a7.6 7.6 0 0 0 2.1-1.2l2 .5 1.6-2.7Z" />
    </svg>
  );
}

export function SwapIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M7 7h11l-3-3" />
      <path d="M17 17H6l3 3" />
    </svg>
  );
}

export function BanIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8" />
      <path d="m7 7 10 10" />
    </svg>
  );
}

export function DownloadIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 4v10" />
      <path d="m8 10 4 4 4-4" />
      <path d="M5 19h14" />
    </svg>
  );
}

export function HeadsetIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4.5 13V12a7.5 7.5 0 0 1 15 0v1" />
      <rect x="3.5" y="13" width="4" height="6" rx="1.4" />
      <rect x="16.5" y="13" width="4" height="6" rx="1.4" />
    </svg>
  );
}

export function NodeIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m12 3 7 4v10l-7 4-7-4V7Z" />
      <path d="M12 12 5.2 8M12 12l6.8-4M12 12v8.5" />
    </svg>
  );
}

export function JavaIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M8 15c2.2 1.4 5.8 1.4 8 0" />
      <path d="M8.5 12.2c2 1.2 5 1.2 7 0" />
      <path d="M9 9.4c1.8 1 4.2 1 6 0" />
      <path d="M14.5 4.5c.4 1.6-.6 2.8-1.6 3.6" />
    </svg>
  );
}

export function CloudIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M7.5 17.5h9a3.5 3.5 0 0 0 .4-7 5 5 0 0 0-9.6-1.2A3.2 3.2 0 0 0 7.5 17.5Z" />
    </svg>
  );
}

export function GitIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="7" cy="7" r="2.2" />
      <circle cx="17" cy="7" r="2.2" />
      <circle cx="12" cy="17" r="2.2" />
      <path d="M8.8 8.4 11 15.2M15.2 8.4 13 15.2" />
    </svg>
  );
}

export function ChevronIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m6 14 6-6 6 6" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M19 12H5" />
      <path d="m11 6-6 6 6 6" />
    </svg>
  );
}

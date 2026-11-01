import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement>;
const base = (p: Props) => ({
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...p,
});

export const PlayIcon = (p: Props) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <path d="M8 5.2c0-.8.9-1.3 1.6-.9l9.1 5.8c.7.4.7 1.4 0 1.8l-9.1 5.8c-.7.4-1.6-.1-1.6-.9V5.2Z" />
  </svg>
);

export const PauseIcon = (p: Props) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <rect x="7" y="5" width="3.4" height="14" rx="1" />
    <rect x="13.6" y="5" width="3.4" height="14" rx="1" />
  </svg>
);

export const VolumeIcon = (p: Props) => (
  <svg {...base(p)}>
    <path d="M4 9.5v5h3l4.5 3.5V6L7 9.5H4Z" />
    <path d="M16 8.5a5 5 0 0 1 0 7" />
    <path d="M18.7 6a8.5 8.5 0 0 1 0 12" />
  </svg>
);

export const MuteIcon = (p: Props) => (
  <svg {...base(p)}>
    <path d="M4 9.5v5h3l4.5 3.5V6L7 9.5H4Z" />
    <path d="m16 9 5 5M21 9l-5 5" />
  </svg>
);

export const CaptionsIcon = (p: Props) => (
  <svg {...base(p)}>
    <rect x="3" y="5" width="18" height="14" rx="3" />
    <path d="M10 10.2a2.3 2.3 0 1 0 0 3.6M17 10.2a2.3 2.3 0 1 0 0 3.6" />
  </svg>
);

export const BugIcon = (p: Props) => (
  <svg {...base(p)}>
    <rect x="7" y="6" width="10" height="13" rx="5" />
    <path d="M9 6V4M15 6V4M4 10h3M17 10h3M4 14h3M17 14h3M5 18l2-1.5M19 18l-2-1.5" />
    <path d="M9 10h6M9 13h6" />
  </svg>
);

export const ExpandIcon = (p: Props) => (
  <svg {...base(p)}>
    <path d="M8 4H4v4M16 4h4v4M8 20H4v-4M16 20h4v-4" />
  </svg>
);

export const PanelIcon = (p: Props) => (
  <svg {...base(p)}>
    <rect x="3" y="4" width="18" height="16" rx="3" />
    <path d="M14.5 4v16" />
  </svg>
);

export const XIcon = (p: Props) => (
  <svg {...base(p)}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);

export const HelpIcon = (p: Props) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M9.6 9.3a2.5 2.5 0 0 1 4.9.8c0 1.7-2.5 2-2.5 3.7" />
    <path d="M12 17.2h.01" strokeWidth="2.4" />
  </svg>
);

export const ChevronLeft = (p: Props) => (
  <svg {...base(p)}>
    <path d="m14.5 6-6 6 6 6" />
  </svg>
);

export const ChevronRight = (p: Props) => (
  <svg {...base(p)}>
    <path d="m9.5 6 6 6-6 6" />
  </svg>
);

export const LogoMark = ({ size = 34 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 108 108" aria-hidden>
    <defs>
      <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#2a1a52" />
        <stop offset="1" stopColor="#0a0a0e" />
      </linearGradient>
    </defs>
    <rect width="108" height="108" rx="24" fill="url(#lg)" />
    <path d="M35.52 40.14 54 30.9l18.48 9.24L54 49.38 35.52 40.14Z" stroke="#a78bfa" strokeWidth="5.5" strokeLinejoin="round" fill="rgba(167,139,250,.12)" />
    <path d="M35.52 54 54 63.24 72.48 54" stroke="rgba(167,139,250,.55)" strokeWidth="5.5" strokeLinejoin="round" strokeLinecap="round" fill="none" />
    <path d="M35.52 67.86 54 77.1l18.48-9.24" stroke="rgba(167,139,250,.33)" strokeWidth="5.5" strokeLinejoin="round" strokeLinecap="round" fill="none" />
    <path d="M54 37.06v33.88" stroke="#f4f4f5" strokeWidth="4.5" strokeLinecap="round" fill="none" />
  </svg>
);

export const EyeIcon = (p: Props) => (
  <svg {...base(p)}>
    <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6S2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="2.8" />
  </svg>
);

export const EyeOffIcon = (p: Props) => (
  <svg {...base(p)}>
    <path d="M3 3l18 18" />
    <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6 0 9.5 7 9.5 7a17 17 0 0 1-3 3.7M6.6 6.7A16.8 16.8 0 0 0 2.5 12S6 19 12 19a10 10 0 0 0 4.2-.9" />
    <path d="M9.8 9.8a3 3 0 0 0 4.4 4.4" />
  </svg>
);

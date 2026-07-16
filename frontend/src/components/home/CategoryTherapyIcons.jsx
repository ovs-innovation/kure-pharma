const Svg = ({ children, className, viewBox = "0 0 24 24", size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox={viewBox}
    width={size}
    height={size}
    className={className}
    aria-hidden
  >
    {children}
  </svg>
);

/** Anti-cancer — capsule + awareness ribbon */
export const IconAntiCancerCombo = ({ className }) => (
  <Svg className={className} viewBox="0 0 24 24">
    <rect x="3.5" y="9.5" width="10" height="5" rx="2.5" fill="currentColor" opacity="0.85" />
    <rect x="8" y="9.5" width="5.5" height="5" rx="2.5" fill="currentColor" opacity="0.35" />
    <path
      d="M17.5 4.2c-1.2 1.6-2.9 3-2.9 5.2 0 1.8 1.2 3.2 2.9 3.9 1.7-.7 2.9-2.1 2.9-3.9 0-2.2-1.7-3.6-2.9-5.2z"
      fill="currentColor"
    />
    <path
      d="M15.2 9.8l-1.4 4.2 1.6-.9 2.1.9-1.4-4.2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/** Oncology — DNA double helix */
export const IconDnaHelix = ({ className }) => (
  <Svg className={className} viewBox="0 0 24 24">
    {[0, 1, 2, 3, 4].map((i) => (
      <g key={i}>
        <circle cx={8 + (i % 2) * 8} cy={4 + i * 3.6} r="1.3" fill="currentColor" opacity={0.7 + (i % 2) * 0.2} />
        <line
          x1={8 + (i % 2) * 8}
          y1={4 + i * 3.6}
          x2={16 - (i % 2) * 8}
          y2={4 + i * 3.6}
          stroke="currentColor"
          strokeWidth="0.9"
          opacity="0.45"
        />
      </g>
    ))}
    <path
      d="M8 4c2 2.5 2 6.5 0 9M16 4c-2 2.5-2 6.5 0 9"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      opacity="0.5"
    />
  </Svg>
);

/** Classic awareness ribbon — anti-cancer / oncology */
export const IconAwarenessRibbon = ({ className }) => (
  <Svg className={className}>
    <path
      d="M12 2.2c-2.1 2.8-5.2 5.2-5.2 9.1 0 3.1 2 5.4 5.2 6.5 3.2-1.1 5.2-3.4 5.2-6.5 0-3.9-3.1-6.3-5.2-9.1z"
      fill="currentColor"
    />
    <path
      d="M6.8 11.2L4.5 20l3.1-1.7L12 20l4.4-1.7L19.5 20l-2.3-8.8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/** Oncology — ribbon with cell motif */
export const IconOncologyRibbon = ({ className }) => (
  <Svg className={className}>
    <path
      d="M12 2.2c-2.1 2.8-5.2 5.2-5.2 9.1 0 3.1 2 5.4 5.2 6.5 3.2-1.1 5.2-3.4 5.2-6.5 0-3.9-3.1-6.3-5.2-9.1z"
      fill="currentColor"
      opacity="0.92"
    />
    <circle cx="12" cy="9.2" r="2.1" fill="none" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="12" cy="9.2" r="0.55" fill="currentColor" />
    <path
      d="M6.8 11.2L4.5 20l3.1-1.7L12 20l4.4-1.7L19.5 20l-2.3-8.8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/** Critical care — heart with pulse */
export const IconCriticalCare = ({ className }) => (
  <Svg className={className}>
    <path
      d="M12 20.2s-6.8-4.2-6.8-9.4c0-2.8 2.2-4.6 4.8-4.6 1.5 0 2.9.7 3.8 1.9.9-1.2 2.3-1.9 3.8-1.9 2.6 0 4.8 1.8 4.8 4.6 0 5.2-6.8 9.4-6.8 9.4z"
      fill="currentColor"
      opacity="0.18"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M5.5 12.5h2.2l1.2-2.4 1.8 4.8 1.4-2.6h2.4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/** Lifesaving — medical cross in shield */
export const IconLifesaving = ({ className }) => (
  <Svg className={className}>
    <path
      d="M12 3.2L5.5 6.2v5.4c0 4.1 2.8 7.2 6.5 8.9 3.7-1.7 6.5-4.8 6.5-8.9V6.2L12 3.2z"
      fill="currentColor"
      opacity="0.15"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M12 8.2v7.2M8.8 11.8h6.4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

/** Imported — globe with medicine box */
export const IconImported = ({ className }) => (
  <Svg className={className}>
    <circle
      cx="12"
      cy="12"
      r="8.2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M4.2 12h15.6M12 3.8c2.2 2.4 3.5 5.2 3.5 8.2s-1.3 5.8-3.5 8.2c-2.2-2.4-3.5-5.2-3.5-8.2S9.8 6.2 12 3.8z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
    />
    <rect
      x="9.8"
      y="9.8"
      width="4.4"
      height="4.4"
      rx="0.6"
      fill="currentColor"
    />
  </Svg>
);

/** HIV awareness ribbon */
export const IconHivRibbon = ({ className }) => (
  <Svg className={className}>
    <path
      d="M12 2.5c-1.9 2.6-4.8 4.9-4.8 8.6 0 2.9 1.9 5.1 4.8 6.2 2.9-1.1 4.8-3.3 4.8-6.2 0-3.7-2.9-6-4.8-8.6z"
      fill="currentColor"
    />
    <path
      d="M7.2 11L5 19.2l2.8-1.5L12 19.2l4.2-1.5L19 19.2l-2.2-8.2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.55"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="8.8" r="1" fill="#fff" opacity="0.85" />
  </Svg>
);

/** Nephrology — kidney shape with droplet */
export const IconNephrology = ({ className }) => (
  <Svg className={className}>
    <path
      d="M12 4.2c-3.8 0-6.5 2.8-6.5 6.5 0 4.8 3.4 8.8 6.5 11.1 3.1-2.3 6.5-6.3 6.5-11.1 0-3.7-2.7-6.5-6.5-6.5z"
      fill="currentColor"
      opacity="0.16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M12 7.2c-2 0-3.4 1.5-3.4 3.5 0 2.6 1.8 4.8 3.4 6.2 1.6-1.4 3.4-3.6 3.4-6.2 0-2-1.4-3.5-3.4-3.5z"
      fill="currentColor"
    />
    <path
      d="M12 5.2v1.2"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </Svg>
);

export const CATEGORY_THERAPY_ICON_MAP = {
  "anti-cancer": IconAntiCancerCombo,
  oncology: IconDnaHelix,
  "critical-care": IconCriticalCare,
  lifesaving: IconLifesaving,
  imported: IconImported,
  hiv: IconHivRibbon,
  nephrology: IconNephrology,
  immunotherapy: IconOncologyRibbon,
  "targeted-therapy": IconAwarenessRibbon,
};

export const CATEGORY_THERAPY_ICON_BY_NAME = {
  "Anti-Cancer Medicines": IconAntiCancerCombo,
  "Oncology Drugs": IconDnaHelix,
  "Critical Care Medicines": IconCriticalCare,
  "Lifesaving Drugs": IconLifesaving,
  "Imported medicine": IconImported,
  HIV: IconHivRibbon,
  "Nephrology Medicine": IconNephrology,
};

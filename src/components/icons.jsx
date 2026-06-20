// Lightweight stroke icon set (inherits color via currentColor).
const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

function Svg({ size = 18, title, children, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      {...base}
      aria-hidden={title ? undefined : 'true'}
      role={title ? 'img' : undefined}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export const IconHome = (p) => (
  <Svg {...p}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
    <path d="M9.5 21v-6h5v6" />
  </Svg>
);

export const IconBook = (p) => (
  <Svg {...p}>
    <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v15H5.5A1.5 1.5 0 0 0 4 20.5z" />
    <path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v15h5.5a1.5 1.5 0 0 1 1.5 1.5z" />
  </Svg>
);

export const IconInbox = (p) => (
  <Svg {...p}>
    <path d="M4 13h4l1.5 2.5h5L16 13h4" />
    <path d="M5 13 6.8 5.6A2 2 0 0 1 8.7 4h6.6a2 2 0 0 1 1.9 1.6L19 13v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z" />
  </Svg>
);

export const IconChart = (p) => (
  <Svg {...p}>
    <path d="M5 21V10" />
    <path d="M12 21V4" />
    <path d="M19 21v-7" />
  </Svg>
);

export const IconTarget = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="12" cy="12" r="0.6" fill="currentColor" stroke="none" />
  </Svg>
);

export const IconSearch = (p) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-3.5-3.5" />
  </Svg>
);

export const IconBell = (p) => (
  <Svg {...p}>
    <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
    <path d="M10 20a2 2 0 0 0 4 0" />
  </Svg>
);

export const IconCalendar = (p) => (
  <Svg {...p}>
    <rect x="4" y="5.5" width="16" height="15" rx="2.5" />
    <path d="M4 10h16" />
    <path d="M8.5 3.5v4M15.5 3.5v4" />
  </Svg>
);

export const IconPlay = ({ size = 18, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...rest}>
    <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
  </svg>
);

export const IconPause = ({ size = 18, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...rest}>
    <rect x="7" y="5.5" width="3.4" height="13" rx="1.2" fill="currentColor" />
    <rect x="13.6" y="5.5" width="3.4" height="13" rx="1.2" fill="currentColor" />
  </svg>
);

export const IconStop = ({ size = 18, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...rest}>
    <rect x="6.5" y="6.5" width="11" height="11" rx="2.4" fill="currentColor" />
  </svg>
);

export const IconCheck = (p) => (
  <Svg {...p}>
    <path d="m5 12.5 4.2 4.3L19 7" />
  </Svg>
);

export const IconArrowRight = (p) => (
  <Svg {...p}>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </Svg>
);

export const IconArrowLeft = (p) => (
  <Svg {...p}>
    <path d="M19 12H5" />
    <path d="m11 6-6 6 6 6" />
  </Svg>
);

export const IconClock = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 8v4.5l3 1.7" />
  </Svg>
);

export const IconSparkle = (p) => (
  <Svg {...p}>
    <path d="M12 4v16M4 12h16" />
    <path d="M7.5 7.5 16.5 16.5M16.5 7.5 7.5 16.5" opacity="0.5" />
  </Svg>
);

export const IconChevron = (p) => (
  <Svg {...p}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
);

export const IconBulb = (p) => (
  <Svg {...p}>
    <path d="M9 18h6" />
    <path d="M10 21h4" />
    <path d="M12 3a6 6 0 0 0-4 10.5c.6.6 1 1.2 1 2V16h6v-.5c0-.8.4-1.4 1-2A6 6 0 0 0 12 3z" />
  </Svg>
);

export const IconAlert = (p) => (
  <Svg {...p}>
    <path d="M12 4 2.5 20h19z" />
    <path d="M12 10v4" />
    <circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" />
  </Svg>
);

export const IconLink = (p) => (
  <Svg {...p}>
    <path d="M10 14a4 4 0 0 0 5.6 0l2.4-2.4a4 4 0 0 0-5.6-5.6L11 7.4" />
    <path d="M14 10a4 4 0 0 0-5.6 0L6 12.4a4 4 0 0 0 5.6 5.6L13 16.6" />
  </Svg>
);

export const IconList = (p) => (
  <Svg {...p}>
    <path d="M8 6h12M8 12h12M8 18h12" />
    <path d="M4 6h.01M4 12h.01M4 18h.01" />
  </Svg>
);

export const IconCode = (p) => (
  <Svg {...p}>
    <path d="m8 8-4 4 4 4" />
    <path d="m16 8 4 4-4 4" />
    <path d="m13 6-2 12" opacity="0.6" />
  </Svg>
);

export const IconHelp = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M9.5 9.5a2.5 2.5 0 0 1 4.5 1.5c0 1.5-2 2-2 3.2" />
    <circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" />
  </Svg>
);

export const IconDumbbell = (p) => (
  <Svg {...p}>
    <path d="M6.5 6.5v11M3.5 9v6M17.5 6.5v11M20.5 9v6M6.5 12h11" />
  </Svg>
);

export const IconFlow = (p) => (
  <Svg {...p}>
    <rect x="3" y="4" width="7" height="5" rx="1.4" />
    <rect x="14" y="15" width="7" height="5" rx="1.4" />
    <path d="M6.5 9v4a2 2 0 0 0 2 2H14" />
  </Svg>
);

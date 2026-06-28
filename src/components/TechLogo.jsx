// Vector technology marks used on course cards instead of emoji. Each mark is a
// clean, recognizable SVG drawn in the technology's brand colour. Add a new entry
// here and reference it by key from the course registry (`icon` field).

function ReactMark({ size, color }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <g fill="none" stroke={color} strokeWidth="1.3">
        <ellipse cx="12" cy="12" rx="10" ry="3.8" />
        <ellipse cx="12" cy="12" rx="10" ry="3.8" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="3.8" transform="rotate(120 12 12)" />
      </g>
      <circle cx="12" cy="12" r="2" fill={color} />
    </svg>
  );
}

function AwsMark({ size, color }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path
        d="M7.5 18h8.2a3.8 3.8 0 0 0 .6-7.55A5.5 5.5 0 0 0 5.6 11 3.5 3.5 0 0 0 7.5 18Z"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M12 16.5v-5m0 0-1.8 1.8M12 11.5l1.8 1.8"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NodeMark({ size, color }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path
        d="M12 2.6 20 7v10l-8 4.4L4 17V7z"
        fill="none"
        stroke={color}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M12 8v8M9 10v3.2L12 16M15 9.2c-1-.7-3-.6-3 .8s3 1 3 2.4-1.7 1.4-3 .8" opacity="0" />
      <text
        x="12"
        y="15.5"
        textAnchor="middle"
        fontSize="7"
        fontWeight="700"
        fill={color}
        fontFamily="system-ui, sans-serif"
      >
        JS
      </text>
    </svg>
  );
}

function TsMark({ size, color }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3.5" fill={color} />
      <text
        x="12"
        y="16.2"
        textAnchor="middle"
        fontSize="8.5"
        fontWeight="700"
        fill="#fff"
        fontFamily="system-ui, sans-serif"
      >
        TS
      </text>
    </svg>
  );
}

function NestMark({ size, color }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <g fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
        <path d="M12 2.6 20 7.2v9.6L12 21.4 4 16.8V7.2z" />
        <path d="M8.5 15.5V9.2l7 6.1V9" />
      </g>
    </svg>
  );
}

function CodeMark({ size, color }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <g fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="m8 8-4 4 4 4" />
        <path d="m16 8 4 4-4 4" />
        <path d="m13.5 6-3 12" opacity="0.6" />
      </g>
    </svg>
  );
}

function DockerMark({ size, color }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <g fill={color}>
        <rect x="3" y="11" width="2.6" height="2.4" rx="0.3" />
        <rect x="6" y="11" width="2.6" height="2.4" rx="0.3" />
        <rect x="9" y="11" width="2.6" height="2.4" rx="0.3" />
        <rect x="12" y="11" width="2.6" height="2.4" rx="0.3" />
        <rect x="6" y="8.2" width="2.6" height="2.4" rx="0.3" />
        <rect x="9" y="8.2" width="2.6" height="2.4" rx="0.3" />
        <rect x="9" y="5.4" width="2.6" height="2.4" rx="0.3" />
      </g>
      <path
        d="M3 13.4c0 3 2.3 5.4 6 5.4 4.6 0 8-2.6 9.4-6 1 .1 2.2-.2 2.8-1-1-.6-2-.4-2.6-.1"
        fill="none"
        stroke={color}
        strokeWidth="1.4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function KubernetesMark({ size, color }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <g fill="none" stroke={color} strokeWidth="1.3" strokeLinejoin="round">
        <path d="M12 2.6 20 6.4v8L12 21.4 4 14.4v-8z" />
        <circle cx="12" cy="11.6" r="2.4" />
        <path d="M12 2.6v6.6M12 14v7.4M20 6.4l-5.9 4.1M4 6.4l5.9 4.1M20 14.4l-6-2M4 14.4l6-2" />
      </g>
    </svg>
  );
}

function DevOpsMark({ size, color }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <g fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 5.5A7 7 0 0 0 5 11" />
        <path d="m8 3 .4 2.6L5.8 6" />
        <path d="M16 18.5A7 7 0 0 0 19 13" />
        <path d="m16 21-.4-2.6 2.6-.4" />
        <circle cx="12" cy="12" r="2.4" />
      </g>
    </svg>
  );
}

function NetworkMark({ size, color }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <g fill="none" stroke={color} strokeWidth="1.4" strokeLinejoin="round">
        <circle cx="12" cy="4.5" r="2.1" />
        <circle cx="5" cy="18" r="2.1" />
        <circle cx="19" cy="18" r="2.1" />
        <path d="M12 6.6 6 16M12 6.6l6 9.4M7 18h10" />
      </g>
    </svg>
  );
}

function LinuxMark({ size, color }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <g fill="none" stroke={color} strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round">
        <path d="M9 4.6c-1 1.4-1 3.4-.4 5.4.4 1.3-.4 2.4-1.4 3.8-1.3 1.8-1.6 3.4-1 4.4.7 1.2 2.4 1 3.4.4.8-.5 2-.5 2.8 0 1 .6 2.7.8 3.4-.4.6-1 .3-2.6-1-4.4-1-1.4-1.8-2.5-1.4-3.8.6-2 .6-4-.4-5.4-1-1.4-2.6-1.4-3.6 0z" />
        <circle cx="10.4" cy="7.2" r="0.6" fill={color} stroke="none" />
        <circle cx="13.2" cy="7.2" r="0.6" fill={color} stroke="none" />
        <path d="M10.4 9c.5.5 2.2.5 2.8 0" />
      </g>
    </svg>
  );
}

function GitMark({ size, color }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <g fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="6" r="2" />
        <circle cx="6" cy="18" r="2" />
        <circle cx="17" cy="9.5" r="2" />
        <path d="M6 8v8" />
        <path d="M17 11.5c0 3-2.4 4-5 4.5" />
        <path d="M8 6h5a2 2 0 0 1 2 2" />
      </g>
    </svg>
  );
}

function JavaScriptMark({ size, color }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3.5" fill={color} />
      <text
        x="12"
        y="16.4"
        textAnchor="middle"
        fontSize="8.5"
        fontWeight="700"
        fill="#111827"
        fontFamily="system-ui, sans-serif"
      >
        JS
      </text>
    </svg>
  );
}

function ExpressMark({ size, color }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <g fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="m4 6 7 6-7 6" />
        <path d="m12 6 7 6-7 6" opacity="0.55" />
      </g>
    </svg>
  );
}

const MARKS = {
  react: ReactMark,
  javascript: JavaScriptMark,
  express: ExpressMark,
  aws: AwsMark,
  node: NodeMark,
  typescript: TsMark,
  nestjs: NestMark,
  docker: DockerMark,
  kubernetes: KubernetesMark,
  devops: DevOpsMark,
  network: NetworkMark,
  linux: LinuxMark,
  git: GitMark,
  code: CodeMark,
};

export default function TechLogo({ name, size = 26, color = 'currentColor' }) {
  const Mark = MARKS[name] ?? CodeMark;
  return <Mark size={size} color={color} />;
}

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

const MARKS = {
  react: ReactMark,
  aws: AwsMark,
  node: NodeMark,
  typescript: TsMark,
  nestjs: NestMark,
  code: CodeMark,
};

export default function TechLogo({ name, size = 26, color = 'currentColor' }) {
  const Mark = MARKS[name] ?? CodeMark;
  return <Mark size={size} color={color} />;
}

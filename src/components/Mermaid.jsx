import { useEffect, useRef, useState } from 'react';

let mermaidPromise = null;
let idCounter = 0;

// Lazy-load mermaid only when a diagram is actually rendered.
function loadMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import('mermaid').then((mod) => {
      const mermaid = mod.default;
      mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        securityLevel: 'loose',
        fontFamily: 'Inter, system-ui, sans-serif',
      });
      return mermaid;
    });
  }
  return mermaidPromise;
}

/* ---- tiny color helpers so each diagram matches the level accent ---- */
function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const v = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16));
}
function toHex(n) {
  return Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, '0');
}
// mix `hex` toward `target` by t (0..1)
function mix(hex, target, t) {
  const a = hexToRgb(hex);
  const b = hexToRgb(target);
  return '#' + a.map((c, i) => toHex(c + (b[i] - c) * t)).join('');
}

function buildCode(code, accent) {
  const soft = mix(accent, '#ffffff', 0.86);
  const init = {
    theme: 'base',
    themeVariables: {
      primaryColor: soft,
      primaryBorderColor: accent,
      primaryTextColor: '#0e1116',
      secondaryColor: '#ffffff',
      tertiaryColor: '#ffffff',
      lineColor: accent,
      edgeLabelBackground: '#ffffff',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '14px',
    },
    flowchart: { curve: 'basis', htmlLabels: true, padding: 14, nodeSpacing: 48, rankSpacing: 56 },
  };
  return `%%{init: ${JSON.stringify(init)}}%%\n${code}`;
}

const SVG_NS = 'http://www.w3.org/2000/svg';
const XLINK_NS = 'http://www.w3.org/1999/xlink';

// Add entrance + flow animations to the rendered mermaid SVG.
function enhance(svgEl, accent) {
  if (!svgEl.querySelector('style[data-lc]')) {
    const style = document.createElementNS(SVG_NS, 'style');
    style.setAttribute('data-lc', '1');
    style.textContent = `
      @keyframes lcPop { from { opacity: 0; scale: 0.55; } to { opacity: 1; scale: 1; } }
      @keyframes lcDraw { to { stroke-dashoffset: 0; } }
      @keyframes lcDot { 0% { opacity: 0; } 12% { opacity: 1; } 88% { opacity: 1; } 100% { opacity: 0; } }
      .lc-node { transform-box: fill-box; transform-origin: center; animation: lcPop 0.5s both cubic-bezier(0.34, 1.56, 0.64, 1); }
      .lc-edge { animation: lcDraw 0.7s ease forwards; }
      .lc-dot { animation: lcDot linear infinite; }
      @media (prefers-reduced-motion: reduce) {
        .lc-node, .lc-edge { animation: none !important; opacity: 1 !important; stroke-dashoffset: 0 !important; }
        .lc-dot { display: none; }
      }
    `;
    svgEl.appendChild(style);
  }

  const nodes = svgEl.querySelectorAll('.nodes .node, g.node');
  nodes.forEach((n, i) => {
    n.classList.add('lc-node');
    n.style.animationDelay = `${0.12 + i * 0.07}s`;
  });

  const edges = svgEl.querySelectorAll('.edgePaths path');
  edges.forEach((p, i) => {
    let len = 0;
    try {
      len = p.getTotalLength();
    } catch {
      /* getTotalLength may throw for empty paths */
    }
    if (len) {
      p.style.strokeDasharray = String(len);
      p.style.strokeDashoffset = String(len);
    }
    p.classList.add('lc-edge');
    p.style.animationDelay = `${0.2 + i * 0.12}s`;

    let id = p.getAttribute('id');
    if (!id) {
      id = `lcp-${Math.random().toString(36).slice(2)}`;
      p.setAttribute('id', id);
    }

    const dur = 2.6 + (i % 4) * 0.25;
    const dot = document.createElementNS(SVG_NS, 'circle');
    dot.setAttribute('r', '3.6');
    dot.setAttribute('class', 'lc-dot');
    dot.setAttribute('fill', accent);
    dot.style.filter = `drop-shadow(0 0 5px ${accent})`;
    dot.style.animationDuration = `${dur}s`;
    dot.style.animationDelay = `${0.9 + i * 0.15}s`;

    const motion = document.createElementNS(SVG_NS, 'animateMotion');
    motion.setAttribute('dur', `${dur}s`);
    motion.setAttribute('repeatCount', 'indefinite');
    motion.setAttribute('rotate', 'auto');
    motion.setAttribute('begin', `${0.9 + i * 0.15}s`);
    const mpath = document.createElementNS(SVG_NS, 'mpath');
    mpath.setAttribute('href', `#${id}`);
    mpath.setAttributeNS(XLINK_NS, 'xlink:href', `#${id}`);
    motion.appendChild(mpath);
    dot.appendChild(motion);
    p.parentNode.appendChild(dot);
  });
}

export default function Mermaid({ code, accent = '#2d6bff', className }) {
  const ref = useRef(null);
  const [svg, setSvg] = useState('');
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    loadMermaid()
      .then(async (mermaid) => {
        const id = `mmd-${(idCounter += 1)}`;
        try {
          const { svg: out } = await mermaid.render(id, buildCode(code, accent));
          if (!cancelled) {
            setSvg(out);
            setFailed(false);
          }
        } catch {
          if (!cancelled) {
            setSvg('');
            setFailed(true);
          }
        }
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [code, accent]);

  useEffect(() => {
    if (!svg || !ref.current) return;
    const svgEl = ref.current.querySelector('svg');
    if (svgEl) enhance(svgEl, accent);
  }, [svg, accent]);

  if (failed) {
    return <pre className={className}>{code}</pre>;
  }

  return (
    <div
      ref={ref}
      className={className}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

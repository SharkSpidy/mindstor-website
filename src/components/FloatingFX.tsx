import { useEffect, useRef, type CSSProperties } from 'react';
import '../styles/launch.css';

type Kind = 'ring' | 'orbit' | 'tri' | 'plus' | 'dot' | 'diamond' | 'blob' | 'arc' | 'square';
type Motion = 'spin' | 'fidget' | 'bob' | 'orbit-path' | 'twitch';

interface Item {
  kind: Kind;
  motion: Motion;
  /** position in vw / vh */
  x: number;
  y: number;
  /** size in rem */
  size: number;
  color: string;
  /** seconds per loop and start offset */
  dur: number;
  delay: number;
  /** scroll-parallax depth (px of drift per px scrolled) */
  depth: number;
  /** hide below this viewport width (px) to keep phones uncluttered */
  minW?: number;
}

const PINK = '#E12D9B';
const PURPLE = '#AD32C0';
const BRIGHT = '#FF4770';
const CORAL = '#FD6055';
const ORANGE = '#FE7045';

const ITEMS: Item[] = [
  { kind: 'orbit', motion: 'spin', x: 4, y: 14, size: 5.5, color: PINK, dur: 14, delay: 0, depth: 0.12 },
  { kind: 'tri', motion: 'fidget', x: 47, y: 9, size: 1.7, color: ORANGE, dur: 5, delay: 0.4, depth: 0.2, minW: 700 },
  { kind: 'plus', motion: 'twitch', x: 92, y: 22, size: 1.5, color: BRIGHT, dur: 3.2, delay: 0.2, depth: 0.28 },
  { kind: 'ring', motion: 'bob', x: 88, y: 58, size: 3.4, color: PURPLE, dur: 9, delay: 1.1, depth: 0.1 },
  { kind: 'blob', motion: 'bob', x: 70, y: 82, size: 9, color: PURPLE, dur: 12, delay: 0.6, depth: 0.06, minW: 700 },
  { kind: 'diamond', motion: 'fidget', x: 8, y: 66, size: 1.6, color: CORAL, dur: 4.4, delay: 0.9, depth: 0.24 },
  { kind: 'arc', motion: 'spin', x: 30, y: 88, size: 4.2, color: ORANGE, dur: 8, delay: 0, depth: 0.14, minW: 700 },
  { kind: 'dot', motion: 'orbit-path', x: 18, y: 38, size: 0.7, color: BRIGHT, dur: 11, delay: 0.3, depth: 0.18 },
  { kind: 'square', motion: 'twitch', x: 60, y: 48, size: 1.1, color: PINK, dur: 3.8, delay: 1.6, depth: 0.3, minW: 900 },
  { kind: 'orbit', motion: 'spin', x: 78, y: 6, size: 3.4, color: ORANGE, dur: 10, delay: 0.7, depth: 0.16, minW: 700 },
  { kind: 'tri', motion: 'spin', x: 3, y: 90, size: 2.2, color: PURPLE, dur: 16, delay: 0, depth: 0.1 },
  { kind: 'plus', motion: 'fidget', x: 40, y: 64, size: 1.2, color: ORANGE, dur: 5.5, delay: 2, depth: 0.22, minW: 900 },
  { kind: 'dot', motion: 'orbit-path', x: 94, y: 90, size: 0.9, color: CORAL, dur: 13, delay: 1.4, depth: 0.12 },
  { kind: 'ring', motion: 'spin', x: 54, y: 30, size: 2.2, color: BRIGHT, dur: 18, delay: 0.2, depth: 0.2, minW: 900 },
];

function Shape({ kind }: { kind: Kind }) {
  switch (kind) {
    case 'ring':
      return <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="6" strokeDasharray="30 14" strokeLinecap="round" />;
    case 'orbit':
      return (
        <>
          <ellipse cx="50" cy="50" rx="44" ry="17" fill="none" stroke="currentColor" strokeWidth="2.4" opacity="0.55" />
          <circle cx="94" cy="50" r="7" fill="currentColor" />
          <circle cx="50" cy="50" r="6" fill="currentColor" opacity="0.35" />
        </>
      );
    case 'tri':
      return <path d="M50 10 L90 82 L10 82 Z" fill="none" stroke="currentColor" strokeWidth="7" strokeLinejoin="round" />;
    case 'plus':
      return <path d="M50 12 V88 M12 50 H88" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />;
    case 'dot':
      return <circle cx="50" cy="50" r="40" fill="currentColor" />;
    case 'diamond':
      return <path d="M50 8 L92 50 L50 92 L8 50 Z" fill="currentColor" />;
    case 'blob':
      return <circle cx="50" cy="50" r="48" fill="url(#fx-blob)" />;
    case 'arc':
      return <path d="M12 70 A40 40 0 0 1 88 70" fill="none" stroke="currentColor" strokeWidth="9" strokeLinecap="round" />;
    case 'square':
      return <rect x="16" y="16" width="68" height="68" rx="12" fill="none" stroke="currentColor" strokeWidth="9" />;
  }
}

/**
 * A fixed, click-through layer of small brand-coloured shapes that circle, fidget and drift
 * (with a gentle scroll parallax). It sits behind the page content, so it never covers text.
 */
export function FloatingFX() {
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = layer.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      el.style.setProperty('--sy', String(window.scrollY));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="fx-layer" ref={layer} aria-hidden="true">
      <svg width="0" height="0" focusable="false" style={{ position: 'absolute' }}>
        <defs>
          <radialGradient id="fx-blob">
            <stop offset="0%" stopColor="#AD32C0" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#AD32C0" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
      {ITEMS.map((it, i) => {
        const style = {
          left: `${it.x}vw`,
          top: `${it.y}vh`,
          width: `${it.size}rem`,
          height: `${it.size}rem`,
          color: it.color,
          '--depth': it.depth,
          '--dur': `${it.dur}s`,
          '--delay': `${-it.delay * it.dur}s`,
        } as CSSProperties;
        return (
          <span className={`fx fx-${it.motion}${it.minW ? ` fx-min${it.minW}` : ''}`} style={style} key={i}>
            <span className="fx-inner">
              <svg viewBox="0 0 100 100" width="100%" height="100%" overflow="visible">
                <Shape kind={it.kind} />
              </svg>
            </span>
          </span>
        );
      })}
    </div>
  );
}

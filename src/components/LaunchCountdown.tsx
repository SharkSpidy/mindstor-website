import { useEffect, useRef, useState } from 'react';
import { getTimeLeft, LAUNCH_AT, pad2 } from '../lib/countdown';
import { prefersReducedMotion } from '../lib/storage';
import '../styles/launch.css';

const GLYPHS = '▇▆▅▄#%&@*?+<>/\\';
const TEASERS = [
  'Something huge is cooking.',
  'Heads down. Lights low. Shipping soon.',
  'You will want to be here for this.',
  'Not a feature. Not a tweak. A launch.',
];

const UNITS = ['days', 'hours', 'minutes', 'seconds'] as const;

/** A redacted codename whose characters keep scrambling, like a classified file being decrypted. */
function useScramble(length: number, still: boolean): string {
  const make = () => Array.from({ length }, () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]).join('');
  const [text, setText] = useState(() => '▇'.repeat(length));
  useEffect(() => {
    if (still) {
      setText('▇'.repeat(length));
      return;
    }
    const id = window.setInterval(() => setText(make()), 130);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [length, still]);
  return text;
}


/** One split-flap digit: the old top half folds down, revealing the new digit beneath it. */
function FlipDigit({ value }: { value: string }) {
  const [cur, setCur] = useState(value);
  const [prev, setPrev] = useState(value);
  const [flips, setFlips] = useState(0);
  const last = useRef(value);

  useEffect(() => {
    if (value === last.current) return;
    setPrev(last.current);
    setCur(value);
    setFlips((n) => n + 1);
    last.current = value;
  }, [value]);

  const flipping = flips > 0 && prev !== cur;
  return (
    <span className="flip" aria-hidden="true">
      <span className="half top"><b>{cur}</b></span>
      <span className="half bottom"><b>{prev}</b></span>
      {flipping && (
        <>
          <span className="half top flap" key={`t${flips}`}><b>{prev}</b></span>
          <span className="half bottom flap" key={`b${flips}`} onAnimationEnd={() => setPrev(cur)}><b>{cur}</b></span>
        </>
      )}
    </span>
  );
}

export function LaunchCountdown() {
  const [now, setNow] = useState(() => Date.now());
  const [teaser, setTeaser] = useState(0);
  const [reduced] = useState(prefersReducedMotion);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setTeaser((i) => (i + 1) % TEASERS.length), 3800);
    return () => window.clearInterval(id);
  }, [reduced]);

  const left = getTimeLeft(now, LAUNCH_AT);
  const codename = useScramble(7, reduced || left.done);
  const values = [left.days, left.hours, left.minutes, left.seconds];
  const label = left.done
    ? 'The launch is live.'
    : `Launching in ${left.days} days, ${left.hours} hours and ${left.minutes} minutes.`;

  return (
    <aside className={`launch${left.done ? ' is-live' : ''}`} aria-labelledby="launch-title">
      <div className="launch-badge">
        <span className="launch-pulse" aria-hidden="true" />
        <span id="launch-title">{left.done ? 'It’s live' : 'Product launch · Classified'}</span>
      </div>

      <p className="launch-teaser" aria-live="off">
        {left.done ? (
          <span className="grad-text">We just launched something huge.</span>
        ) : (
          TEASERS.map((t, i) => (
            <span key={t} className={`teaser-line${i === teaser ? ' on' : ''}`} aria-hidden={i !== teaser && undefined}>
              {t}
            </span>
          ))
        )}
      </p>

      <div className="launch-clock" role="timer" aria-label={label}>
        {UNITS.map((unit, i) => (
          <div className={`unit unit-${unit}`} key={unit}>
            <div className="digits">
              {pad2(values[i]).split('').map((d, k) => (
                <FlipDigit value={d} key={k} />
              ))}
            </div>
            <span className="unit-label">{unit}</span>
          </div>
        ))}
      </div>

      <p className="launch-meta">
        <span className="codename" aria-hidden="true">
          Project {codename}
        </span>
        <span className="launch-when">
          {left.done ? 'Launched 1 Jan 2027' : 'Drops 1 Jan 2027 · 00:00 IST'}
        </span>
      </p>
    </aside>
  );
}

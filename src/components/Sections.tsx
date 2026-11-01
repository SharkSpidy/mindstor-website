import { CSSProperties, FormEvent, useState } from 'react';
import { CORE_VALUES, MAKE_CARDS } from '../data/content';
import { LOGO, LOGO_VIEWBOX } from '../data/logo';
import { validateAccessForm } from '../lib/validate';

export function MakeSection() {
  return (
    <section className="section" id="make" aria-labelledby="make-title">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">What we make</span>
          <h2 id="make-title">Web products, apps, and everything around them.</h2>
          <p>
            Mindstor AI is a product studio. We take on client projects and build our own products, with design,
            engineering, and AI working together from day one.
          </p>
        </div>
        <div className="layers">
          {MAKE_CARDS.map((c) => (
            <article className="layer" key={c.title} style={{ '--c': c.color } as CSSProperties}>
              <span className="dot" />
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </article>
          ))}
        </div>
        <p className="roof-note">
          <strong>Under one roof.</strong> One team designs, builds, and ships, so problems get fixed at the source.
        </p>
      </div>
    </section>
  );
}

/** Cinema-ticket illustration for our first product. */
function Ticket() {
  return (
    <svg className="ticket" viewBox="0 0 320 180" role="img" aria-label="Illustration of a cinema ticket">
      <defs>
        <linearGradient id="ticket-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#AD32C0" />
          <stop offset="0.55" stopColor="#FF4770" />
          <stop offset="1" stopColor="#FE7045" />
        </linearGradient>
      </defs>
      <rect width="320" height="180" rx="16" fill="url(#ticket-grad)" />
      <circle cx="0" cy="90" r="22" fill="#0a0512" />
      <circle cx="320" cy="90" r="22" fill="#0a0512" />
      <line x1="226" y1="14" x2="226" y2="166" stroke="#fff" strokeOpacity="0.55" strokeWidth="2" strokeDasharray="6 7" />
      <svg x="30" y="22" width="68" height="58" viewBox={LOGO_VIEWBOX} aria-hidden="true">
        {LOGO.map((f, i) => (
          <polygon key={i} fill="#fff" fillOpacity="0.95" points={f.points.map((p) => p.join(',')).join(' ')} />
        ))}
      </svg>
      <text x="34" y="118" fontFamily="Quicksand, sans-serif" fontWeight="700" fontSize="26" fill="#fff">
        ADMIT ONE
      </text>
      <text x="34" y="144" fontFamily="Manrope, sans-serif" fontSize="13" fill="#fff" fillOpacity="0.85">
        Kochi · Fair fee, no surprises
      </text>
      <text
        x="244"
        y="95"
        fontFamily="Quicksand, sans-serif"
        fontWeight="700"
        fontSize="30"
        fill="#fff"
        transform="rotate(90 244 95)"
        textAnchor="middle"
      >
        MINDSTOR
      </text>
    </svg>
  );
}

export function ProductSection() {
  return (
    <section className="section" id="product" style={{ paddingTop: 0 }} aria-labelledby="product-title">
      <div className="wrap">
        <div className="product">
          <div>
            <span className="eyebrow">Our own products</span>
            <h2 id="product-title">Ticketing with fair fees, for film lovers.</h2>
            <p>
              We are building our own app for people who love the cinema. It launches first in Kochi, and we are
              working with theatres to get it right.
            </p>
            <div className="chips">
              <span className="chip hot">Launching in Kochi</span>
              <span className="chip">Fair-fee ticketing</span>
              <span className="chip">Built in-house</span>
            </div>
          </div>
          <Ticket />
        </div>
      </div>
    </section>
  );
}

const STACK_ICON = (
  <svg viewBox="0 0 280 110" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M140 8l62 24-62 24-62-24z" fill="currentColor" fillOpacity="0.3" />
    <path d="M78 52l62 24 62-24" />
    <path d="M78 72l62 24 62-24" />
    <path d="M78 32v40M202 32v40" strokeOpacity="0.5" />
  </svg>
);

const RING_ICON = (
  <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round">
    <path d="M60 14a46 46 0 0 1 40 23" />
    <path d="M106 60a46 46 0 0 1-23 40" />
    <path d="M60 106A46 46 0 0 1 20 83" />
    <path d="M14 60a46 46 0 0 1 23-40" />
  </svg>
);

export function ValuesSection() {
  return (
    <section className="section" id="values" aria-labelledby="values-title" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">What we stand for</span>
          <h2 id="values-title">Our Core Values</h2>
        </div>
        <div className="values">
          {CORE_VALUES.map((v, i) => (
            <article className={`vcard v${i + 1}`} key={v.num}>
              <span className="num">{v.num}</span>
              {v.num === '04' && (
                <div className="icon" aria-hidden="true">
                  {STACK_ICON}
                </div>
              )}
              {v.num === '05' && (
                <div className="icon" aria-hidden="true">
                  {RING_ICON}
                </div>
              )}
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Formspree endpoint for the access form. Empty means "not connected yet". */
const FORM_ENDPOINT: string = import.meta.env.VITE_FORM_ENDPOINT ?? '';

type Status = { kind: 'idle' | 'sending' | 'ok' | 'error'; message: string };

export function AccessSection() {
  const [status, setStatus] = useState<Status>({ kind: 'idle', message: '' });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const values = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      brief: String(data.get('brief') ?? ''),
    };
    const problem = validateAccessForm(values);
    if (problem) {
      setStatus({ kind: 'error', message: problem });
      return;
    }
    if (!FORM_ENDPOINT) {
      setStatus({
        kind: 'error',
        message: 'This form is not connected to a mailbox yet, so nothing was sent. Please reach the founders directly.',
      });
      return;
    }
    setStatus({ kind: 'sending', message: 'Sending…' });
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus({ kind: 'ok', message: 'Thanks. We will reply with an honest view of what we can deliver.' });
      form.reset();
    } catch {
      setStatus({ kind: 'error', message: 'Something went wrong and your message was not sent. Please try again.' });
    }
  };

  return (
    <section className="section" id="access" aria-labelledby="access-title" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="access">
          <div className="copy">
            <span className="eyebrow">Enquire</span>
            <h2 id="access-title">Tell us what you are building.</h2>
            <p>
              Have a product idea, or one that needs fixing? Send a short note and we will tell you honestly what we
              can deliver and when.
            </p>
          </div>
          <form onSubmit={onSubmit} noValidate>
            <label htmlFor="f-name">
              Name
              <input id="f-name" name="name" type="text" autoComplete="name" required />
            </label>
            <label htmlFor="f-email">
              Work email
              <input id="f-email" name="email" type="email" autoComplete="email" required />
            </label>
            <label htmlFor="f-brief">
              What are you building?
              <textarea id="f-brief" name="brief" required />
            </label>
            <button className="btn btn-primary" type="submit" disabled={status.kind === 'sending'}>
              Enquire
            </button>
            <p id="form-status" className={status.kind === 'error' ? 'err' : undefined} role="status" aria-live="polite">
              {status.message}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="wrap foot">
        <span>© {new Date().getFullYear()} Mindstor AI. A product studio.</span>
        <span>Web products · Apps · AI</span>
      </div>
    </footer>
  );
}

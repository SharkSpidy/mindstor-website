import { useEffect, useState } from 'react';
import { NAV_LINKS } from '../data/content';
import { LogoMark } from './LogoMark';

export function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <a className="brand" href="#top" aria-label="Mindstor AI home">
          <LogoMark />
          <span>Mindstor AI</span>
        </a>
        <button
          type="button"
          className="menu-btn"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav
          id="site-nav"
          className={`links${open ? ' open' : ''}`}
          aria-label="Primary"
          onClick={(e) => {
            if ((e.target as HTMLElement).tagName === 'A') setOpen(false);
          }}
        >
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
          <a className="m-cta" href="#access">
            Request Access
          </a>
        </nav>
        <a className="btn btn-outline-grad nav-cta" href="#access">
          Request Access
        </a>
      </div>
    </header>
  );
}

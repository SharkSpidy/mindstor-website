import { useCallback, useEffect, useRef, useState } from 'react';
import { Hero } from './components/Hero';
import { LogoLoader } from './components/LogoLoader';
import { Nav } from './components/Nav';
import { AccessSection, CareersSection, Footer, MakeSection, ProductSection, ValuesSection } from './components/Sections';
import { readFlag, writeFlag } from './lib/storage';

const SEEN_KEY = 'mindstor:loader-seen';

/**
 * The loader plays once per browser session. Add `?loader` to the URL to force it
 * (useful while designing it).
 */
function shouldShowLoader(): boolean {
  if (new URLSearchParams(window.location.search).has('loader')) return true;
  return !readFlag(SEEN_KEY);
}

export default function App() {
  const [loading, setLoading] = useState(shouldShowLoader);
  const siteRef = useRef<HTMLDivElement>(null);

  const handleDone = useCallback(() => {
    writeFlag(SEEN_KEY);
    setLoading(false);
  }, []);

  // Keep the page from scrolling behind the loader.
  useEffect(() => {
    if (!loading) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [loading]);

  // The site underneath is inert (not focusable, not announced) until the loader leaves.
  useEffect(() => {
    siteRef.current?.toggleAttribute('inert', loading);
  }, [loading]);

  return (
    <>
      {loading && <LogoLoader onDone={handleDone} />}
      <div ref={siteRef} aria-hidden={loading || undefined}>
        <Nav />
        <main id="top">
          <Hero />
          <MakeSection />
          <ProductSection />
          <ValuesSection />
          <CareersSection />
          <AccessSection />
        </main>
        <Footer />
      </div>
    </>
  );
}

import { useCallback, useEffect, useRef, useState } from 'react';
import { Hero } from './components/Hero';
import { LogoLoader } from './components/LogoLoader';
import { Nav } from './components/Nav';
import { AccessSection, Footer, MakeSection, ValuesSection } from './components/Sections';
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

  useEffect(() => {
    const title = 'Mindstor AI | Product Studio for Web Apps, SaaS & AI';
    const description =
      'Mindstor AI builds custom web products, SaaS platforms, mobile apps, and AI-powered features for founders and businesses.';
    const url = 'https://www.mindstor.in/';

    document.title = title;

    const setMeta = (name: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let tag = document.head.querySelector(selector) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement('meta');
        if (isProperty) tag.setAttribute('property', name);
        else tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    const ensureCanonical = () => {
      let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', url);
    };

    setMeta('description', description);
    setMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setMeta('author', 'Mindstor AI');
    setMeta('keywords', 'product studio, web app development, SaaS development, AI product development, custom software, mobile app development, digital product agency');
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:type', 'website', true);
    setMeta('og:url', url, true);
    setMeta('og:image', 'https://www.mindstor.in/og-image.svg', true);
    setMeta('og:site_name', 'Mindstor AI', true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', 'https://www.mindstor.in/og-image.svg');
    ensureCanonical();

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'mindstor-seo-schema';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Mindstor AI',
      url: url,
      logo: 'https://www.mindstor.in/favicon.svg',
      description,
      sameAs: ['https://www.mindstor.in/'],
      areaServed: 'Worldwide',
      knowsAbout: [
        'Web application development',
        'SaaS product development',
        'Mobile application development',
        'AI-powered software',
      ],
    });
    document.head.appendChild(script);

    return () => {
      const schema = document.getElementById('mindstor-seo-schema');
      schema?.remove();
    };
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
          {/* <ProductSection /> */}
          <ValuesSection />
          <AccessSection />
        </main>
        <Footer />
      </div>
    </>
  );
}

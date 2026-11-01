import { Hero3D } from './Hero3D';

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="wrap hero-grid">
        <div>
          <h1 id="hero-title">
            <span className="line">We build the products</span>
            <span className="line">people actually use.</span>
          </h1>
          <p className="lede">
            Mindstor AI is a product studio for web products, apps, and AI-powered software. We build for clients
            and for ourselves.
          </p>
          <div className="cta-row">
            <a className="btn btn-primary" href="#access">
              Start a Project
            </a>
            <a className="btn btn-ghost" href="#make">
              See What We Make
            </a>
          </div>
        </div>
        <div
          className="hero-stage"
          role="img"
          aria-label="A faceted glowing brain made of triangular shards, surrounded by orbiting particles and floating browser, phone and card screens"
        >
          <Hero3D />
        </div>
      </div>
    </section>
  );
}

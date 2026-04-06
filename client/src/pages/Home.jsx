import { Link } from 'react-router-dom';
import './Home.css';

export function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Strategic legal counsel</p>
            <h1>Clarity, integrity, and decisive representation.</h1>
            <p className="lede">
              Made in Heaven pairs seasoned practitioners with modern tools—so you move from uncertainty to a clear
              plan of action.
            </p>
            <div className="hero-actions">
              <Link to="/book" className="btn btn-primary">
                Book a consultation
              </Link>
              <Link to="/services" className="btn btn-ghost">
                Explore services
              </Link>
            </div>
          </div>
          <div className="hero-panel card">
            <h2>Why clients choose us</h2>
            <ul className="hero-list">
              <li>Confidential intake and structured case review</li>
              <li>Transparent pricing with secure online payment</li>
              <li>Role-based access to your consultation history</li>
            </ul>
          </div>
        </div>
      </section>
      <section className="page-section">
        <div className="container split-3">
          <article className="card feature">
            <h3>Corporate & contracts</h3>
            <p>Formation, compliance, and negotiation support for growing teams.</p>
          </article>
          <article className="card feature">
            <h3>Dispute readiness</h3>
            <p>Early risk mapping and pathways before matters escalate.</p>
          </article>
          <article className="card feature">
            <h3>Private clients</h3>
            <p>Estate planning touchpoints with careful documentation.</p>
          </article>
        </div>
      </section>
    </div>
  );
}

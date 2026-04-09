import { Link } from 'react-router-dom';
import './Home.css';

export function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Made In Heaven – Family Counselling & Mediation</p>
            <h1>Where relationships get a second chance.</h1>
            <p className="lede">
              Made In Heaven is a confidential family counselling and mediation platform that helps couples and families
              move from conflict to calm conversation. We blend therapy, mediation, and legal awareness to protect
              relationships before they reach the courtroom.
            </p>
            <div className="hero-actions">
              <Link to="/book" className="btn btn-primary">
                Book a confidential session
              </Link>
              <Link to="/services" className="btn btn-ghost">
                Talk to a counsellor
              </Link>
            </div>
          </div>
          <div className="hero-panel card">
            <h2>Why families choose us</h2>
            <ul className="hero-list">
              <li>Confidential, judgment‑free conversations</li>
              <li>Mediation‑first approach before litigation</li>
              <li>Balanced support for both emotional and practical decisions</li>
            </ul>
          </div>
        </div>
      </section>
      <section className="page-section">
        <div className="container split-3">
          <article className="card feature">
            <h3>Marriage counselling</h3>
            <p>For couples facing conflict, distance, or the fear of separation.</p>
          </article>
          <article className="card feature">
            <h3>Pre‑marital guidance</h3>
            <p>For engaged and newly married couples building a strong foundation.</p>
          </article>
          <article className="card feature">
            <h3>Mediation & family support</h3>
            <p>For families navigating legal tension, separation, or in‑law conflict.</p>
          </article>
        </div>
      </section>
    </div>
  );
}

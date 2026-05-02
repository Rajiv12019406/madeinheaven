import { Link } from 'react-router-dom';
import './About.css';

export function About() {
  const missionItems = [
    'Provide early, accessible support before families reach litigation.',
    'Create a neutral, judgment‑free space for difficult conversations.',
    'Blend emotional healing with practical mediation for real‑life decisions.',
    'Help couples choose clarity over confusion at every crossroads.',
  ];

  const visionItems = [
    'Make counselling and mediation the first step, not the last resort.',
    'See Indian families handle conflict with maturity, empathy, and dignity.',
    'Build a trusted, discreet platform for ethical, balanced guidance.',
    'Reduce courtroom battles and protect the emotional future of children.',
  ];

  const philosophyItems = [
    'Empathy over judgment.',
    'Communication over assumptions.',
    'Resolution over escalation.',
    'Dignity over drama.',
    'Clarity over confusion.',
  ];

  return (
    <div className="about-page">
      <div className="page-hero about-hero">
        <div className="container">
          <div className="about-hero-grid">
            <div>
              <p className="eyebrow">About Made In Heaven</p>
              <h1>Dialogue-led family support with dignity and discretion.</h1>
              <p>
                Made In Heaven is a for Indian couples and families navigating conflict, separation, or emotional
                distance. We create a safe space for dialogue before things reach the courtroom.
              </p>
              <div className="about-actions">
                <Link to="/book" className="btn btn-primary">
                  Book Consultation
                </Link>
                <Link to="/contact" className="btn btn-ghost">
                  Contact Us
                </Link>
              </div>
            </div>
            <aside className="card about-hero-panel">
              <h3>What defines our approach</h3>
              <ul>
                <li>Confidential and non-judgmental environment</li>
                <li>Mediation before litigation mindset</li>
                <li>Balanced emotional and practical guidance</li>
                <li>Support for couples, parents, and families</li>
              </ul>
            </aside>
          </div>
        </div>
      </div>

      <section className="page-section">
        <div className="container about-stack">
          <div className="card about-card">
            <p className="eyebrow">Founder&apos;s message</p>
            <h2>Attempt mediation before litigation.</h2>
            <p>
              Modern families are under pressure—careers, expectations, in‑laws, money, silence. Most couples don&apos;t
              lack love; they lack a safe space to talk without blame, fear, or legal threats. Made In Heaven exists
              with one belief: <strong>mediation before litigation</strong>. Court cases may decide rights, but they
              rarely heal hearts. Honest dialogue, guided by a neutral professional, often does.
            </p>
          </div>

          <div className="card about-card">
            <p className="eyebrow">Values</p>
            <h2>What we stand for</h2>
            <p>
              We support married couples, engaged partners, parents, and extended families who want clarity over chaos.
              Our core belief is simple: <strong>relationships can heal when people feel heard, respected, and guided—
              not judged</strong>.
            </p>
          </div>

          <div className="about-grid">
            <article className="card about-card">
              <p className="eyebrow">Mission</p>
              <h2>Our mission</h2>
              <ul className="about-list">
                {missionItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

            <article className="card about-card">
              <p className="eyebrow">Vision</p>
              <h2>Our vision</h2>
              <ul className="about-list">
                {visionItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>

          <div className="card about-card">
            <p className="eyebrow">Our philosophy</p>
            <h2>Guiding principles</h2>
            <ul className="about-list about-list-tight">
              {philosophyItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

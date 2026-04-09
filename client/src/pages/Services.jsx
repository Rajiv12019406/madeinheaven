import './Services.css';

export function Services() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>Services</h1>
          <p>Focused offerings designed for couples and families who want healing with dignity.</p>
        </div>
      </div>
      <section className="page-section">
        <div className="container">
          <div className="services-grid">
            <article className="card">
              <h2 style={{ marginTop: 0 }}>Marriage counselling</h2>
              <p style={{ color: 'var(--color-muted)' }}>
                Support for married couples facing conflict, emotional distance, or a possible separation—handled with
                privacy and balance.
              </p>
              <h3>We help with</h3>
              <ul>
                <li>Constant fights, blame, and criticism</li>
                <li>Trust issues, infidelity, or emotional withdrawal</li>
                <li>In‑law interference and family pressure</li>
                <li>Silent treatment and loss of intimacy</li>
                <li>Confusion between staying, trying, or separating</li>
              </ul>
              <h3>What we offer</h3>
              <ul>
                <li>One‑to‑one and couple sessions with trained counsellors</li>
                <li>Structured communication and conflict de‑escalation tools</li>
                <li>Values and expectations alignment for both partners</li>
                <li>30–90 day plans with simple, trackable next steps</li>
              </ul>
            </article>
            <article className="card">
              <h2 style={{ marginTop: 0 }}>Pre‑marital counselling</h2>
              <p style={{ color: 'var(--color-muted)' }}>
                Guided conversations for engaged or newly married couples to build a strong, realistic foundation.
              </p>
              <h3>We help prevent</h3>
              <ul>
                <li>Misaligned expectations around roles, money, and lifestyle</li>
                <li>Unclear boundaries with in‑laws and extended family</li>
                <li>Fear of commitment due to past relationships</li>
                <li>Silent tension from cultural or religious differences</li>
              </ul>
              <h3>What we offer</h3>
              <ul>
                <li>Pre‑marriage readiness assessments and guided exercises</li>
                <li>Sessions on expectations, boundaries, finances, and values</li>
                <li>Tools for healthy conflict from day one</li>
                <li>A shared understanding of key agreements and non‑negotiables</li>
              </ul>
            </article>
            <article className="card">
              <h2 style={{ marginTop: 0 }}>Legal mediation & relationship support</h2>
              <p style={{ color: 'var(--color-muted)' }}>
                Neutral mediation for couples and families considering legal action—focused on dialogue, settlement, and
                emotional safety.
              </p>
              <h3>We help address</h3>
              <ul>
                <li>Ongoing or upcoming divorce / separation discussions</li>
                <li>Disputes around maintenance, children, or shared assets (informal guidance)</li>
                <li>High‑conflict situations harming children and mental health</li>
                <li>Fear, anger, and confusion about &ldquo;what happens next&rdquo;</li>
              </ul>
              <h3>What we offer</h3>
              <ul>
                <li>Neutral mediation sessions online (and in‑person where available)</li>
                <li>Structured conversation frameworks for both sides and families</li>
                <li>Collaboration with your legal counsel where appropriate (we are not a law firm)</li>
                <li>Focus on child wellbeing, dignity, and long‑term emotional impact</li>
              </ul>
            </article>
          </div>
          <div className="card" style={{ marginTop: '2rem' }}>
            <h2 style={{ marginTop: 0 }}>Why choose Made In Heaven</h2>
            <ul>
              <li>Confidential & discreet space for sensitive conversations</li>
              <li>Neutral, non‑judgmental mediators who don&apos;t take sides</li>
              <li>Culturally aware of Indian families, in‑laws, and social realities</li>
              <li>Mediation‑first mindset—de‑escalation before litigation</li>
              <li>Structured process with clear goals and follow‑ups</li>
              <li>Qualified professionals, not casual &ldquo;advice givers&rdquo;</li>
              <li>Child‑centric lens wherever children are involved</li>
            </ul>
            <h3>Our approach</h3>
            <ul>
              <li>Listen deeply to both sides without blame</li>
              <li>Map patterns, triggers, and unmet needs</li>
              <li>Facilitate calm, rule‑based dialogue</li>
              <li>Co‑create options—rebuild, reset boundaries, or separate with dignity</li>
              <li>Support implementation with realistic check‑ins</li>
            </ul>
            <p style={{ marginTop: '1rem' }}>
              You don&apos;t have to choose between staying unhappy or walking away in anger. There is a gentler,
              guided way forward.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

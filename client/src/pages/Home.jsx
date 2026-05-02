import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import brandLogo from '../assets/BrandLogo.png';
import lawOfAttractionImage from '../assets/LawOfAttractactionImage.jpeg';
import './Home.css';

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

function useStatsSectionActive() {
  const ref = useRef(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setActive(true);
        obs.disconnect();
      },
      { threshold: 0.22, rootMargin: '0px 0px -8% 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, active };
}

function AnimatedStatValue({ active, end, suffix, delayMs, instant }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (instant) {
      setValue(end);
      return;
    }

    let cancelled = false;
    let rafId = 0;
    const duration = 2200;
    const startAfter = window.setTimeout(() => {
      let startTs;
      const tick = (ts) => {
        if (cancelled) return;
        if (startTs === undefined) startTs = ts;
        const elapsed = ts - startTs;
        const t = Math.min(1, elapsed / duration);
        const eased = 1 - (1 - t) ** 3;
        setValue(Math.round(eased * end));
        if (t < 1) rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    }, delayMs);

    return () => {
      cancelled = true;
      window.clearTimeout(startAfter);
      cancelAnimationFrame(rafId);
    };
  }, [active, end, delayMs, instant]);

  const formatted = end >= 1000 ? value.toLocaleString() : String(value);
  return (
    <>
      {formatted}
      {suffix}
    </>
  );
}

export function Home() {
  const trustSection = useStatsSectionActive();
  const reducedMotion = usePrefersReducedMotion();

  const trustStats = [
    { end: 10000, suffix: '+', label: 'Guided conversations facilitated' },
    { end: 95, suffix: '%', label: 'Clients report better communication' },
    { literal: '24×7', label: 'Confidential support request window' },
    { end: 100, suffix: '%', label: 'Private and secure sessions' },
  ];

  const journeySteps = [
    {
      title: 'Share your concern',
      description: 'Tell us what you are facing through a short and private intake form.',
    },
    {
      title: 'Get matched quickly',
      description: 'We connect you with a counsellor or mediator best suited for your situation.',
    },
    {
      title: 'Begin guided dialogue',
      description: 'Attend confidential sessions focused on understanding, conflict resolution, and clarity.',
    },
    {
      title: 'Follow a structured plan',
      description: 'Receive actionable next steps and optional follow-up support for sustained progress.',
    },
  ];

  const careAreas = [
    'Relationship anxiety and communication breakdown',
    'Pre-marital compatibility and expectation alignment',
    'Family mediation, separation, and conflict transitions',
    'Emotional wellness support for stress and uncertainty',
  ];

  const testimonials = [
    {
      quote:
        'We came in with daily arguments and no direction. The sessions helped us listen without attacking each other.',
      author: 'A married couple from Delhi',
    },
    {
      quote:
        'The mediator helped both families speak calmly. We avoided legal escalation and chose a respectful way forward.',
      author: 'Client from Bengaluru',
    },
  ];

  const founderHighlights = [
    'Dialogue has always been central to conflict resolution in families and communities.',
    'Most disputes arise from communication gaps, not from lack of care or intention.',
    'Early guidance can prevent prolonged emotional distress and unnecessary litigation.',
    'Every relationship deserves a chance to heal with dignity, empathy, and structure.',
  ];

  const missionPoints = [
    'Professional, confidential, and compassionate counselling and mediation services.',
    'Culturally sensitive and evidence-based practices for stronger family systems.',
    'Support for families across India and Indian diaspora communities globally.',
  ];

  const goalPoints = [
    'Enable peaceful dispute resolution and reduce emotional and familial stress.',
    'Help individuals and couples make calm, informed, and balanced decisions.',
    'Promote mediation and structured dialogue before courtroom escalation.',
  ];

  const partnershipModels = [
    'Empanelment with senior legal and counselling experts',
    'Institutional collaboration with NGOs and mediation centres',
    'International chapter partnerships (USA, UK, UAE, Australia and beyond)',
    'Corporate wellness and family support tie-ups',
  ];

  return (
    <div className="home">
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Made In Heaven – DIALOGUE BEFORE LITIGATION</p>
            <h1>Where relationships get a second chance.</h1>
            <p className="lede">
              Made In Heaven is a confidential that helps couples and families
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
          <div className="hero-aside">
            <div className="hero-brand card">
              <img
                src={brandLogo}
                alt="Made In Heaven Consultancy Services — scales of justice mark"
                className="hero-brand-logo"
                width={320}
                height={200}
                decoding="async"
              />
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

      <section ref={trustSection.ref} className="page-section trust-section">
        <div className="container">
          <p className="eyebrow">Trusted support ecosystem</p>
          <div className="stats-grid">
            {trustStats.map((item, index) => (
              <article key={item.label} className="card stat-card">
                <p className="stat-value">
                  {'literal' in item ? (
                    item.literal
                  ) : (
                    <AnimatedStatValue
                      active={trustSection.active}
                      end={item.end}
                      suffix={item.suffix}
                      delayMs={index * 140}
                      instant={reducedMotion}
                    />
                  )}
                </p>
                <p className="stat-label">{item.label}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">How support works</p>
            <h2>Your path from conflict to clarity</h2>
            <p>
              A simple, supportive, and human-first process inspired by modern emotional wellness platforms and tailored
              for Indian families.
            </p>
          </div>
          <div className="journey-grid">
            {journeySteps.map((step, idx) => (
              <article key={step.title} className="card journey-card">
                <span className="journey-step">Step {idx + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container wellbeing-grid">
          <article className="card">
            <p className="eyebrow">What we can help with</p>
            <h2>Support designed for real relationship challenges</h2>
            <ul className="care-list">
              {careAreas.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="card testimonial-wrap">
            <p className="eyebrow">Stories of progress</p>
            {testimonials.map((item) => (
              <blockquote key={item.author} className="testimonial">
                <p>"{item.quote}"</p>
                <cite>{item.author}</cite>
              </blockquote>
            ))}
          </article>
        </div>
      </section>

      <section className="page-section home-loa-section">
        <div className="container">
          <figure className="home-loa card">
            <div className="home-loa-text">
              <p className="eyebrow">Mindset matters</p>
              <h2>Intention and attention in dialogue</h2>
              <p>
                Themes like clarity, resonance, and conscious choice overlap with healthy relationship work: what we focus
                on shapes how we speak and listen. The ideas in this piece are poetic reminders—not therapy or a promise
                of outcomes—alongside structured mediation and counselling.
              </p>
            </div>
            <div className="home-loa-visual">
              <img
                src={lawOfAttractionImage}
                alt="Chalk-style mind map centred on ‘The Law of Attraction,’ with surrounding words such as manifestation, abundance, intention, prosperity, resonance, consciousness, and joy connected by dashed arrows on a dark background."
                loading="lazy"
                decoding="async"
                width={1200}
                height={800}
              />
              <figcaption className="home-loa-caption">
                Decorative artwork; not clinical advice — professional sessions remain our core support.
              </figcaption>
            </div>
          </figure>
        </div>
      </section>

      <section className="page-section">
        <div className="container founder-grid">
          <article className="card founder-message">
            <p className="eyebrow">Founder's message</p>
            <h2>"Attempt mediation before litigation."</h2>
            <p>
              Made In Heaven is built to revive a timeless principle: resolve conflict through dialogue, understanding,
              and mutual respect before it becomes adversarial.
            </p>
            <ul className="founder-list">
              {founderHighlights.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <p className="founder-signoff">
              Restart. Rebuild. Resolve. There are still miles to go before we rest.
            </p>
          </article>
          <article className="card mission-goal-card">
            <p className="eyebrow">Mission and goal</p>
            <h3>Mission</h3>
            <ul className="care-list compact-list">
              {missionPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <h3>Goal</h3>
            <ul className="care-list compact-list">
              {goalPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="page-section">
        <div className="container card partnership-card">
          <p className="eyebrow">Global partnership proposal</p>
          <h2>Partner with MADE IN HEAVEN for structured family dispute resolution</h2>
          <p>
            We invite law firms, counsellors, NGOs, international mediation centres, and corporate teams to collaborate
            in building a trusted global ecosystem for family harmony.
          </p>
          <div className="partnership-layout">
            <div>
              <h3>Why partner with us</h3>
              <ul className="care-list compact-list">
                <li>Hybrid legal + emotional resolution model</li>
                <li>Confidential, ethical, and non-judgmental process design</li>
                <li>Growing multidisciplinary network with social impact focus</li>
              </ul>
            </div>
            <div>
              <h3>Collaboration models</h3>
              <ul className="care-list compact-list">
                {partnershipModels.map((model) => (
                  <li key={model}>{model}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="hero-actions">
            <Link to="/contact" className="btn btn-primary">
              Request partnership discussion
            </Link>
            <Link to="/about" className="btn btn-ghost">
              Read our vision and values
            </Link>
          </div>
        </div>
      </section>

      <section className="page-section final-cta">
        <div className="container card cta-card">
          <p className="eyebrow">Take the first step today</p>
          <h2>Start with one confidential conversation</h2>
          <p>
            Whether you are unsure, overwhelmed, or already in conflict, early dialogue can prevent long-term emotional
            and legal damage.
          </p>
          <div className="hero-actions">
            <Link to="/book" className="btn btn-primary">
              Book your first session
            </Link>
            <Link to="/contact" className="btn btn-ghost">
              Ask a private question
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

import './Services.css';

export function Services() {
  const items = [
    {
      title: 'Consultation & strategy',
      body: 'Structured sessions to clarify rights, risks, and next steps across civil and commercial contexts.',
    },
    {
      title: 'Contract review',
      body: 'Markup and negotiation support for vendor, employment, and partnership agreements.',
    },
    {
      title: 'Compliance check-ins',
      body: 'Lightweight reviews for growing businesses adapting to new regulatory expectations.',
    },
    {
      title: 'Documentation',
      body: 'Clear written summaries after consultations so stakeholders stay aligned.',
    },
  ];

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>Services</h1>
          <p>Focused offerings designed for busy founders, operators, and private clients.</p>
        </div>
      </div>
      <section className="page-section">
        <div className="container">
          <div className="services-grid">
            {items.map((s) => (
              <article key={s.title} className="card">
                <h2 style={{ marginTop: 0, fontSize: '1.35rem' }}>{s.title}</h2>
                <p style={{ margin: 0, color: 'var(--color-muted)' }}>{s.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

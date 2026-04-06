import { useState } from 'react';

export function Contact() {
  const [sent, setSent] = useState(false);

  function onSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>Contact</h1>
          <p>Reach our intake desk. For paid consultations, use Book Consultation to secure your slot.</p>
        </div>
      </div>
      <section className="page-section">
        <div className="container" style={{ maxWidth: 520 }}>
          <div className="card">
            {sent ? (
              <p style={{ margin: 0 }}>Thank you. This demo does not send email—in production, wire this form to your CRM.</p>
            ) : (
              <form onSubmit={onSubmit}>
                <div className="form-group">
                  <label htmlFor="c-name">Name</label>
                  <input id="c-name" name="name" required autoComplete="name" />
                </div>
                <div className="form-group">
                  <label htmlFor="c-email">Email</label>
                  <input id="c-email" name="email" type="email" required autoComplete="email" />
                </div>
                <div className="form-group">
                  <label htmlFor="c-msg">Message</label>
                  <textarea id="c-msg" name="message" rows={4} required />
                </div>
                <button type="submit" className="btn btn-primary">
                  Send message
                </button>
              </form>
            )}
          </div>
          <p style={{ marginTop: '1rem', color: 'var(--color-muted)', fontSize: '0.9rem' }}>
            Phone (illustrative): +91 00000 00000 · Bengaluru, India
          </p>
        </div>
      </section>
    </>
  );
}

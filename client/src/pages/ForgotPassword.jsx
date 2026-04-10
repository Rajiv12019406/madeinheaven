import { useState } from 'react';
import { Link } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { api } from '../api/client';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [debugToken, setDebugToken] = useState(null);
  const [debugUrl, setDebugUrl] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setDebugToken(null);
    setDebugUrl(null);
    setSubmitting(true);
    try {
      const { data } = await api.post('/api/auth/forgot-password', { email });
      setMessage(data.message || 'Check your email for next steps.');
      if (data.resetUrl) setDebugUrl(data.resetUrl);
      if (data.resetToken) setDebugToken(data.resetToken);
    } catch (err) {
      if (isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong. Try again later.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>Forgot password</h1>
          <p>Enter your account email. We&apos;ll send reset instructions if the account exists.</p>
        </div>
      </div>
      <section className="page-section">
        <div className="container" style={{ maxWidth: 420 }}>
          <div className="card">
            <form onSubmit={onSubmit}>
              {error && <p className="form-error" style={{ marginTop: 0 }}>{error}</p>}
              {message && (
                <p style={{ marginTop: 0, color: 'var(--color-success)', fontSize: '0.95rem' }}>{message}</p>
              )}
              <div className="form-group">
                <label htmlFor="fp-email">Email</label>
                <input
                  id="fp-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  disabled={submitting}
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Sending…' : 'Send reset link'}
              </button>
            </form>
            {(debugUrl || debugToken) && (
              <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: 'var(--radius)', border: '1px dashed var(--color-border)', background: 'var(--color-bg)' }}>
                <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: 'var(--color-muted)' }}>
                  Dev only (RESET_TOKEN_IN_RESPONSE): open the same link users get by email.
                </p>
                {debugUrl && (
                  <a href={debugUrl} className="btn btn-ghost btn-sm" style={{ display: 'inline-block', marginBottom: '0.5rem' }}>
                    Open reset link
                  </a>
                )}
                {debugToken && !debugUrl && (
                  <Link to={`/reset-password?token=${encodeURIComponent(debugToken)}`} className="btn btn-ghost btn-sm">
                    Open reset password
                  </Link>
                )}
              </div>
            )}
            <p style={{ marginTop: '1rem', marginBottom: 0, color: 'var(--color-muted)' }}>
              <Link to="/login">Back to sign in</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

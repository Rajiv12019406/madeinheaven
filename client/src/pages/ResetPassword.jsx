import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { api } from '../api/client';

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tokenFromUrl = searchParams.get('token') || '';

  const [token, setToken] = useState(tokenFromUrl);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/api/auth/reset-password', { token, password });
      setDone(true);
      setTimeout(() => navigate('/login', { replace: true }), 2000);
    } catch (err) {
      if (isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Could not reset password.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>Set new password</h1>
          <p>Choose a strong password you haven&apos;t used elsewhere.</p>
        </div>
      </div>
      <section className="page-section">
        <div className="container" style={{ maxWidth: 420 }}>
          <div className="card">
            {done ? (
              <p style={{ margin: 0, color: 'var(--color-success)' }}>
                Password updated. Redirecting to sign in…
              </p>
            ) : (
              <form onSubmit={onSubmit}>
                {error && <p className="form-error" style={{ marginTop: 0 }}>{error}</p>}
                <div className="form-group">
                  <label htmlFor="rp-token">Reset token</label>
                  <input
                    id="rp-token"
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    required
                    autoComplete="off"
                    placeholder="Paste token from your email"
                    disabled={submitting}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="rp-pass">New password</label>
                  <input
                    id="rp-pass"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    disabled={submitting}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="rp-confirm">Confirm password</label>
                  <input
                    id="rp-confirm"
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    disabled={submitting}
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving…' : 'Update password'}
                </button>
              </form>
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

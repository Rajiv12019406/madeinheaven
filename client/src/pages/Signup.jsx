import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isAxiosError } from 'axios';

export function Signup() {
  const { register, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const user = await register(name, email, password);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    } catch (err) {
      if (isAxiosError(err) && err.response?.data && typeof err.response.data === 'object') {
        const msg = err.response.data.message;
        setError(msg || 'Could not register');
      } else {
        setError('Could not register');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>Create account</h1>
          <p>New accounts are created as clients. Admin access is assigned separately.</p>
        </div>
      </div>
      <section className="page-section">
        <div className="container" style={{ maxWidth: 420 }}>
          <div className="card">
            <form onSubmit={onSubmit}>
              {error && <p className="form-error" style={{ marginTop: 0 }}>{error}</p>}
              <div className="form-group">
                <label htmlFor="su-name">Full name</label>
                <input
                  id="su-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  disabled={submitting || authLoading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="su-email">Email</label>
                <input
                  id="su-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  disabled={submitting || authLoading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="su-password">Password</label>
                <input
                  id="su-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  disabled={submitting || authLoading}
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={submitting || authLoading}>
                {submitting ? 'Creating…' : 'Create account'}
              </button>
            </form>
            <p style={{ marginTop: '1rem', marginBottom: 0, color: 'var(--color-muted)' }}>
              Already registered? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

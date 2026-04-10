import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isAxiosError } from 'axios';

const SAVED_EMAIL_KEY = 'mih_saved_login_email';
const REMEMBER_EMAIL_KEY = 'mih_remember_email';

export function Login() {
  const { login, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(() => localStorage.getItem(REMEMBER_EMAIL_KEY) === '1');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(SAVED_EMAIL_KEY);
    if (saved) setEmail(saved);
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const user = await login(email, password, { rememberMe });
      if (rememberMe) {
        localStorage.setItem(SAVED_EMAIL_KEY, email);
        localStorage.setItem(REMEMBER_EMAIL_KEY, '1');
      } else {
        localStorage.removeItem(SAVED_EMAIL_KEY);
        localStorage.removeItem(REMEMBER_EMAIL_KEY);
      }

      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from === '/admin' ? '/dashboard' : from, { replace: true });
      }
    } catch (err) {
      if (isAxiosError(err) && err.response?.data && typeof err.response.data === 'object') {
        const msg = err.response.data.message;
        setError(msg || 'Could not sign in');
      } else {
        setError('Could not sign in');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>Sign in</h1>
          <p>Access your dashboard and consultation history.</p>
        </div>
      </div>
      <section className="page-section">
        <div className="container" style={{ maxWidth: 420 }}>
          <div className="card">
            <form onSubmit={onSubmit}>
              {error && <p className="form-error" style={{ marginTop: 0 }}>{error}</p>}
              <div className="form-group">
                <label htmlFor="login-email">Email</label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="username"
                  disabled={submitting || authLoading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="login-password">Password</label>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  disabled={submitting || authLoading}
                />
              </div>
              <div className="login-auth-row">
                <label>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={submitting || authLoading}
                  />
                  Remember me &amp; save email
                </label>
                <Link to="/forgot-password">Forgot password?</Link>
              </div>
              <p style={{ margin: '0 0 1rem', fontSize: '0.8rem', color: 'var(--color-muted)' }}>
                Your password is stored only in your browser&apos;s password manager if you choose — we never save it
                on this device in plain text.
              </p>
              <button type="submit" className="btn btn-primary" disabled={submitting || authLoading}>
                {submitting ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
            <p style={{ marginTop: '1rem', marginBottom: 0, color: 'var(--color-muted)' }}>
              No account? <Link to="/signup">Create one</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

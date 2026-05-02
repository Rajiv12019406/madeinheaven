import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import brandLogo from '../assets/brand_lo.jpeg';
import couplePhoto from '../assets/CoupleInvertedPhoto.jpeg';
import './Layout.css';

export function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="layout">
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="brand">
            <img
              src={couplePhoto}
              alt=""
              className="brand-mark brand-mark--couple"
              width={70}
              height={80}
              decoding="async"
            />
            <span className="brand-text">Made In Heaven</span>
            <span className="brand-tagline">DIALOGUE BEFORE LITIGATION</span>
          </Link>
          <nav className="nav" aria-label="Main">
            <NavLink to="/" end>
              Home
            </NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/services">Services</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            <NavLink to="/book">Book Consultation</NavLink>
            {user?.role === 'admin' && (
              <NavLink to="/admin" className="nav-admin">
                Admin
              </NavLink>
            )}
            {user && user.role === 'user' && (
              <NavLink to="/dashboard">Dashboard</NavLink>
            )}
            {!user && (
              <>
                <NavLink to="/login">Login</NavLink>
                <Link to="/signup" className="btn btn-primary btn-sm">
                  Sign up
                </Link>
              </>
            )}
            {user && (
              <button type="button" className="btn btn-ghost btn-sm" onClick={logout}>
                Log out
              </button>
            )}
          </nav>
        </div>
      </header>
      <main className="site-main">
        <Outlet />
      </main>
      <footer className="site-footer" role="contentinfo">
        <div className="container footer-main">
          <div className="footer-col footer-brand-col">
            <Link to="/" className="footer-brand">
              <img
                src={brandLogo}
                alt="Made In Heaven Consultancy Services"
                className="footer-brand-logo"
                width={320}
                height={220}
                decoding="async"
              />
              <span className="footer-brand-name">Made In Heaven</span>
              <span className="footer-brand-tagline">Dialogue before litigation</span>
            </Link>
            <p className="footer-address">
              Remote and in-person sessions • India &amp; international diaspora
            </p>
            <p className="footer-hours">Mon–Sat: by appointment • Intake replies within 24–48 hours on business days</p>
            <p className="footer-social-label">Follow us</p>
            <ul className="footer-social">
              <li>
                <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path
                      fill="currentColor"
                      d="M13.5 22v-8.3h2.8l.4-3.2h-3.2V8.6c0-.9.25-1.5 1.6-1.5H17V4.1A22.6 22.6 0 0 0 14 4c-2.7 0-4.5 1.6-4.5 4.6v2.9H6.5v3.2H9.5V22h4z"
                    />
                  </svg>
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path
                      fill="currentColor"
                      d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 .001 5.001A2.5 2.5 0 0 0 12 7.5zm5.75-2.7a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0z"
                    />
                  </svg>
                </a>
              </li>
            </ul>
          </div>

          <nav className="footer-col footer-nav-col" aria-label="Footer">
            <h2 className="footer-heading">Quick links</h2>
            <ul className="footer-links">
              <li>
                <Link to="/about">About us</Link>
              </li>
              <li>
                <Link to="/services">Services</Link>
              </li>
              <li>
                <Link to="/contact">Contact : +91 6201680059</Link>
                
              </li>
              <li>
                <Link to="/book">Book consultation</Link>
              </li>
              {!user && (
                <>
                  <li>
                    <Link to="/login">Login</Link>
                  </li>
                  <li>
                    <Link to="/signup">Sign up</Link>
                  </li>
                </>
              )}
              {user?.role === 'user' && (
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
              )}
            </ul>
          </nav>

          <div className="footer-col footer-contact-col">
            <h2 className="footer-heading">Get in touch</h2>
            <ul className="footer-contact-list">
              <li className="footer-contact-item">
                <span className="footer-contact-label">Phone</span>
                <Link to="/contact" className="footer-contact-value">
                  <svg className="footer-icon" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M6.6 10.8c1.6 3.3 4.3 6 7.6 7.6l2.5-2.5c.4-.4 1-.5 1.5-.3 1.7.6 3.5.9 5.4.9.8 0 1.4.6 1.4 1.4V22c0 .8-.6 1.4-1.4 1.4C10.3 23.4 0 13.1 0 0 0-.8.6-1.4 1.4-1.4h4.3c.8 0 1.4.6 1.4 1.4 0 1.9.3 3.7.9 5.4.2.5.1 1.1-.3 1.5l-2.5 2.5z"
                    />
                  </svg>
                  Request a callback
                </Link>
              </li>
              <li className="footer-contact-item">
                <span className="footer-contact-label">Email</span>
                <Link to="/contact" className="footer-contact-value">
                  <svg className="footer-icon" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z"
                    />
                  </svg>
                  Write to the intake desk
                </Link>
              </li>
            </ul>
            <p className="footer-cta-lead">Ready to get started?</p>
            <Link to="/book" className="footer-cta">
              Book a confidential session
              <span className="footer-cta-icon-wrap" aria-hidden="true">
                <svg width="12" height="12" viewBox="0 0 24 24" focusable="false">
                  <path fill="currentColor" d="M12 4l-1.4 1.4L16.2 11H4v2h12.2l-5.6 5.6L12 20l8-8-8-8z" />
                </svg>
              </span>
            </Link>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container footer-bottom-inner">
            <p className="footer-copyright">© {new Date().getFullYear()} Made In Heaven. All rights reserved.</p>
            <p className="footer-legal-links">
              <Link to="/contact">Privacy Policy</Link>
              <span className="footer-dot" aria-hidden="true">
                ·
              </span>
              <Link to="/contact">Terms &amp; Conditions</Link>
            </p>
            <p className="footer-disclaimer">
              We support emotional and relational clarity; we do not replace independent legal or medical advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

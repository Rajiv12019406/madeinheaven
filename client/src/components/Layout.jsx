import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

export function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="layout">
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="brand">
            <span className="brand-mark" aria-hidden />
            <span className="brand-text">Made in Heaven</span>
            <span className="brand-tagline">Family Counselling & Mediation</span>
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
      <footer className="site-footer">
        <div className="container footer-inner">
          <p>© {new Date().getFullYear()} Made In Heaven. All rights reserved.</p>
          <p className="footer-note">
            Made In Heaven is a family counselling and mediation platform. We support emotional and relational decisions
            and do not replace independent legal or medical advice.
          </p>
        </div>
      </footer>
    </div>
  );
}

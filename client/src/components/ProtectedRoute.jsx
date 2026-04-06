import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container page-section">
        <div className="card" style={{ maxWidth: 400 }}>
          <div className="skeleton" style={{ height: 24, width: '60%', marginBottom: 12 }} />
          <div className="skeleton" style={{ height: 14, width: '100%' }} />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role === 'admin' && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  if (role === 'user' && user.role !== 'user') {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}

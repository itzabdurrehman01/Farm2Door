import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';

function RequireRole({ role, children }) {
  const auth = useAuth();
  const loc = useLocation();
  if (!auth.user) {
    return <Navigate to="/login" state={{ from: loc }} replace />;
  }
  if (auth.role !== role) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default RequireRole;

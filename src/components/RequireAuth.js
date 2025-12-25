import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';

function RequireAuth({ children }) {
  const auth = useAuth();
  const loc = useLocation();
  if (!auth.user) {
    return <Navigate to="/login" state={{ from: loc }} replace />;
  }
  return children;
}

export default RequireAuth;


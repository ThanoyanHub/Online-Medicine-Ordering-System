import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../App.jsx';

export default function ProtectedRoute({ role }) {
  const { user, token } = useAuth();
  if (!token || !user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

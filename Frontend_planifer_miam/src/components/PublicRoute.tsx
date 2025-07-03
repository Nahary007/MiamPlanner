import { Navigate } from 'react-router-dom';

const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  return isAuthenticated() ? <Navigate to="/dashboard" replace /> : children;
};

export default PublicRoute;
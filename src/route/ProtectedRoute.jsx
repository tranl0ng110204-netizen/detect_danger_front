// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { Spin } from 'antd';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuthStore();

  if (loading) {
    return <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  let userRole = user?.role;
  if (Array.isArray(userRole) && userRole.length > 0) {
    if (userRole[0]?.authority) {
      userRole = userRole[0].authority;
    } else {
      userRole = userRole[0];
    }
  }
  
  const normalizedUserRole = userRole;
  const hasAccess = allowedRoles.some(role => {
    return normalizedUserRole === role;
  });

  if (!hasAccess) {
    console.warn(`User role "${normalizedUserRole}" not allowed. Allowed: ${allowedRoles}`);
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
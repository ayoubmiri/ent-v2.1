import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const PrivateRoute = ({ children, role }) => {
  const { authenticated, user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-est-blue"></div>
    </div>;
  }

  if (!authenticated) {
    return <Navigate to="/login" />;
  }

  if (role && !user?.roles?.includes(role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
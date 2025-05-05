import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const PrivateRoute = ({ role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-est-blue"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/connexion" />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
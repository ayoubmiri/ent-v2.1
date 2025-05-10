import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-est-blue"></div>
      </div>
    );
  }

  // If the user is not authenticated, redirect to the home page or any fallback route
  if (!user) {
    return <Navigate to="/" />;
  }

  // If a specific role is required and the user does not have that role, redirect to home
  if (role && user?.role !== role) {
    return <Navigate to="/" />;
  }

  return children; // Return the children (the protected component) if the user is authenticated
};

export default PrivateRoute;

// PrivateRoute.js
import React from 'react';
import { Navigate, Route, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute = ({ component: Component, roles, ...rest }) => {
  const { isAuthenticated, user } = useAuth();

  // Check if the user has the required role
  const hasRequiredRole = roles ? roles.includes(user?.role) : true;

  return (
    <Route
      {...rest}
      element={
        isAuthenticated && hasRequiredRole ? (
          <Component />
        ) : (
          <Navigate to={isAuthenticated ? '/' : '/login'} replace />
        )
      }
    />
  );
};

export default PrivateRoute;
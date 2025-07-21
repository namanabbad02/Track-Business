// Code for PrivateRoute component
// This component is used to protect routes that require authentication


// import React from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { useAuth } from './AuthContext';
// import useTokenVerification from '../Auth/useTokenVerification';

// const PrivateRoute = ({ children }) => {
//   const { isAuthenticated } = useAuth();
//   const location = useLocation();
//   const redirect = useTokenVerification(); // Use the token verification hook

//   console.log('IsAuthenticated in PrivateRoute:', isAuthenticated);

//   // If token verification fails, redirect to login
//   if (redirect) return redirect;

//   // If user is not authenticated, redirect to login
//   if (!isAuthenticated) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   return children;
// };

// export default PrivateRoute;

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import useTokenVerification from './forms/useTokenVerification';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const redirect = useTokenVerification(); // Use the token verification hook

  console.log('IsAuthenticated in PrivateRoute:', isAuthenticated);

  // If token verification fails, redirect to login
  if (redirect) return redirect;

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
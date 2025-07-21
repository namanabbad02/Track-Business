// import React from 'react';
// import { Navigate, useLocation } from 'react-router-dom';

// const ProtectedRoute = ({ children, allowedRoles }) => {
//   const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
//   const role = localStorage.getItem("role");
//   const location = useLocation();

//   if (!isAuthenticated) {
//     // Redirect to login page if not authenticated
//     return <Navigate to="/login" state={{ from: location }} />;
//   }

//   if (allowedRoles && !allowedRoles.includes(role)) {
//     // Redirect to unauthorized page if role is not allowed
//     return <Navigate to="/unauthorized" />;
//   }

//   return children;
// };

// export default ProtectedRoute;

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  
  // Fetch authentication details from localStorage for consistency
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const role = localStorage.getItem("role");

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;




//-----------------------------------------------------------------------------------------------
// import React, { useEffect, useState } from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import axios from "axios";

// const ProtectedRoute = ({ children, allowedRoles }) => {
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [userRole, setUserRole] = useState(null);
//     const location = useLocation();

//     useEffect(() => {
//         axios.get("http://localhost:5000/api/auth/me", { withCredentials: true })
//             .then(res => {
//                 setIsAuthenticated(true);
//                 setUserRole(res.data.role);
//             })
//             .catch(() => {
//                 setIsAuthenticated(false);
//             });
//     }, []);

//     if (!isAuthenticated) {
//         return <Navigate to="/login" state={{ from: location }} replace />;
//     }

//     if (allowedRoles && !allowedRoles.includes(userRole)) {
//         return <Navigate to="/unauthorized" replace />;
//     }

//     return children;
// };

// export default ProtectedRoute;



// import React from 'react';
// import { Navigate, useLocation } from 'react-router-dom';

// const ProtectedRoute = ({ children, allowedRoles, isAuthenticated, role }) => {
//   const location = useLocation();

//   if (!isAuthenticated) {
//     return <Navigate to="/login" state={{ from: location }} />;
//   }

//   if (allowedRoles && !allowedRoles.includes(role)) {
//     return <Navigate to="/unauthorized" />;
//   }

//   return children;
// };

// export default ProtectedRoute;

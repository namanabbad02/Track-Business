import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const useTokenVerification = () => {
  const location = useLocation();
  const token = localStorage.getItem('token');

  // Function to check if the token is expired
  const isTokenExpired = (token) => {
    if (!token) return true; // No token means it's expired

    try {
      const decoded = JSON.parse(atob(token.split('.')[1])); // Decode the token payload
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      return decoded.exp < currentTime; // Check if the token has expired
    } catch (error) {
      console.error('Token decoding error:', error);
      return true; // Assume token is expired if decoding fails
    }
  };

  // Check if the token is valid
  const isTokenValid = token && !isTokenExpired(token);

  if (!isTokenValid) {
    localStorage.removeItem('token'); // Clear the invalid token
    localStorage.removeItem('userRole'); // Clear the user role
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return null;
};

export default useTokenVerification;

// import React, { useState, useEffect } from 'react';
// import { Navigate, useLocation } from 'react-router-dom';

// const useTokenVerification = () => {
//   const location = useLocation();
//   const token = localStorage.getItem('token');
//   const [redirecting, setRedirecting] = useState(false);
//   const [countdown, setCountdown] = useState(5); // 5 seconds countdown

//   // Function to check if the token is expired
//   const isTokenExpired = (token) => {
//     if (!token) return true; // No token means it's expired

//     try {
//       const decoded = JSON.parse(atob(token.split('.')[1])); // Decode the token payload
//       const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
//       return decoded.exp < currentTime; // Check if the token has expired
//     } catch (error) {
//       console.error('Token decoding error:', error);
//       return true; // Assume token is expired if decoding fails
//     }
//   };

//   // Check if the token is valid
//   const isTokenValid = token && !isTokenExpired(token);

//   useEffect(() => {
//     if (!isTokenValid) {
//       const interval = setInterval(() => {
//         setCountdown((prevCountdown) => {
//           if (prevCountdown === 1) {
//             clearInterval(interval);
//             setRedirecting(true);
//           }
//           return prevCountdown - 1;
//         });
//       }, 1000);

//       return () => clearInterval(interval);
//     }
//   }, [isTokenValid]);

//   if (!isTokenValid) {
//     localStorage.removeItem('token'); // Clear the invalid token
//     localStorage.removeItem('userRole'); // Clear the user role
//     return (
//       <div>
//         <p>Your session has ended. Redirecting you to the login page in {countdown} seconds.</p>
//         {redirecting && <Navigate to="/login" state={{ from: location }} replace />}
//       </div>
//     );
//   }

//   return null;
// };

// export default useTokenVerification;


// const jwt = require('jsonwebtoken');

// const authMiddleware = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization;
//     if (!token) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }

//     const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
//     if (decoded.role === 'admin') {
//       req.admin = decoded;
//     } else if (decoded.role === 'user') {
//       req.user = decoded;
//     } else {
//       return res.status(401).json({ error: 'Invalid role' });
//     }

//     next();
//   } catch (error) {
//     console.error('Token verification failed:', error);
//     return res.status(401).json({ error: 'Unauthorized' });
//   }
// };

// module.exports = authMiddleware;

// const jwt = require('jsonwebtoken');
// const TokenBlacklist = require('../models/TokenBlacklist'); // Assuming you have a TokenBlacklist model

// const authMiddleware = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization;
//     if (!token) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }

//     const tokenValue = token.split(' ')[1];
//     const isBlacklisted = await TokenBlacklist.findOne({ where: { token: tokenValue } });

//     if (isBlacklisted) {
//       return res.status(401).json({ error: 'Token is blacklisted' });
//     }

//     const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);
// console.log('Decoded Token:', decoded); // Log the decoded token

// if (decoded.role === 'admin') {
//   req.admin = decoded;
//   console.log('User identified as ADMIN');
// } else if (decoded.role === 'user') {
//   req.user = decoded;
//   console.log('User identified as USER');
// } else {
//   console.log('Invalid role:', decoded.role);
//   return res.status(401).json({ error: 'Invalid role' });
// }


//     next();
//   } catch (error) {
//     console.error('Token verification failed:', error);
//     return res.status(401).json({ error: 'Unauthorized' });
//   }
// };

// module.exports = authMiddleware;
//------------------------------------------------------------------------------

// const jwt = require('jsonwebtoken');
// const TokenBlacklist = require('../models/TokenBlacklist');

// const authMiddleware = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization;
//     if (!token) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }

//     const tokenValue = token.split(' ')[1];
//     const isBlacklisted = await TokenBlacklist.findOne({ where: { token: tokenValue } });

//     if (isBlacklisted) {
//       return res.status(401).json({ error: 'Token is blacklisted' });
//     }

//     const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);
//     console.log("Decoded Token:", decoded); // Debugging line

//     if (decoded.role === 'admin') {
//       req.admin = decoded;
//     } else if (decoded.role === 'user') {
//       req.user = decoded;
//     } else {
//       return res.status(401).json({ error: 'Invalid role' });
//     }

//     next();
//   } catch (error) {
//     console.error('Token verification failed:', error);
//     return res.status(401).json({ error: 'Unauthorized' });
//   }
// };

// module.exports = authMiddleware;


// const jwt = require('jsonwebtoken');
// const TokenBlacklist = require('../models/TokenBlacklist');

// const authMiddleware = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }

//     const tokenValue = authHeader.split(' ')[1];
//     const isBlacklisted = await TokenBlacklist.findOne({ where: { token: tokenValue } });

//     if (isBlacklisted) {
//       return res.status(401).json({ error: 'Token is blacklisted' });
//     }

//     const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);

//     if (decoded.role === 'admin') {
//       req.admin = decoded;
//     } else if (decoded.role === 'user') {
//       req.user = decoded;
//     } else {
//       return res.status(403).json({ error: 'Forbidden: Invalid role' });
//     }

//     next();
//   } catch (error) {
//     console.error('Token verification failed:', error.message);
//     return res.status(401).json({ error: 'Unauthorized' });
//   }
// };

// module.exports = authMiddleware;



// Workin last checked 15/02:-----------------------------------------------------------------
const jwt = require('jsonwebtoken');
const TokenBlacklist = require('../models/TokenBlacklist');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const tokenValue = token.split(' ')[1];
    const isBlacklisted = await TokenBlacklist.findOne({ where: { token: tokenValue } });

    if (isBlacklisted) {
      return res.status(401).json({ error: 'Token is blacklisted' });
    }

    const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded); // Debugging line

    if (decoded.role === 'admin') {
      req.admin = decoded;
    } else if (decoded.role === 'user') {
      req.user = decoded;
    } else {
      return res.status(401).json({ error: 'Invalid role' });
    }

    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = authMiddleware;

//---------------------------------------------------------------------------------------------

// const jwt = require("jsonwebtoken");
// const TokenBlacklist = require("../models/TokenBlacklist");



// const authMiddleware = async (req, res, next) => {
//   try {
//     let token = req.cookies?.token || req.headers.authorization?.split(" ")[1]; // Check both cookies & headers

//     if (!token) {
//       return res.status(401).json({ error: "Unauthorized: No token provided" });
//     }

//     // Check if token is blacklisted
//     const isBlacklisted = await TokenBlacklist.findOne({ where: { token } });
//     if (isBlacklisted) {
//       return res.status(401).json({ error: "Unauthorized: Token is blacklisted" });
//     }

//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log("Decoded Token:", decoded); // Debugging

//     // Assign role-based authentication
//     if (decoded.role === "admin") {
//       req.admin = decoded;
//     } else if (decoded.role === "user") {
//       req.user = decoded;
//     } else {
//       return res.status(401).json({ error: "Unauthorized: Invalid role" });
//     }

//     next();
//   } catch (error) {
//     console.error("Token verification failed:", error.message);
//     return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
//   }
// };

// module.exports = authMiddleware;

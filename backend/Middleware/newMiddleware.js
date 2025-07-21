const validRoles = ['admin', 'user']; // Define valid roles
const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const tokenValue = token.split(' ')[1];
    const isBlacklisted = await TokenBlacklist.findOne({ where: { token: tokenValue } });

    if (isBlacklisted) {
      return res.status(401).json({ error: 'Unauthorized: Token is blacklisted' });
    }

    const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded); // Debugging line

    if (!validRoles.includes(decoded.role)) {
      return res.status(401).json({ error: 'Unauthorized: Invalid role' });
    }

    if (decoded.role === 'admin') {
      req.admin = decoded;
    } else if (decoded.role === 'user') {
      req.user = decoded;
    }

    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Unauthorized: Token expired' });
    }
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

module.exports = authMiddleware;
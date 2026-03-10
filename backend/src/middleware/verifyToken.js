const { verifyAccessToken } = require('../config/jwt');
const User = require('../models/User');

// async because Mongoose DB lookups are async
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No authorization header provided.',
      });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        success: false,
        message: 'Invalid format. Use: Bearer <token>',
      });
    }

    const token = parts[1];
    const decoded = verifyAccessToken(token);

    // Async Mongoose lookup
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token valid but user no longer exists.',
      });
    }

    // Attach safe user object (includes virtual `id` field)
    req.user = user.toSafeObject();
    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired.', code: 'TOKEN_EXPIRED' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token.', code: 'TOKEN_INVALID' });
    }
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authenticated.' });
  }
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: `Required role(s): ${roles.join(', ')}` });
  }
  next();
};

module.exports = { verifyToken, requireRole };
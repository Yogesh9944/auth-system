const express = require('express');
const router  = express.Router();
const { verifyToken, requireRole } = require('../middleware/verifyToken');
const User = require('../models/User');

// GET /api/protected/dashboard — any authenticated user
router.get('/dashboard', verifyToken, (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Welcome to your dashboard!',
    data: {
      user: req.user,
      stats: {
        loginTime: new Date().toISOString(),
        sessionActive: true,
        role: req.user.role,
      },
    },
  });
});

// GET /api/protected/profile — any authenticated user
router.get('/profile', verifyToken, (req, res) => {
  return res.status(200).json({
    success: true,
    data: { profile: { ...req.user, lastAccessed: new Date().toISOString() } },
  });
});

// GET /api/protected/secret — any authenticated user
router.get('/secret', verifyToken, (req, res) => {
  return res.status(200).json({
    success: true,
    message: ' You accessed a secret protected resource!',
    data: {
      secret: 'The answer to life, the universe, and everything is 42.',
      accessedBy: req.user.username,
      accessedAt: new Date().toISOString(),
    },
  });
});

// GET /api/protected/admin/users — admin only
router.get('/admin/users', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const allUsers = await User.find({}).select('-password -__v');
    return res.status(200).json({
      success: true,
      data: { users: allUsers, total: allUsers.length },
    });
  } catch {
    return res.status(500).json({ success: false, message: 'Failed to fetch users.' });
  }
});

module.exports = router;
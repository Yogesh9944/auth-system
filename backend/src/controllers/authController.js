const User = require('../models/User');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../config/jwt');

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }
    if (username.length < 3 || username.length > 30) {
      return res.status(400).json({ success: false, message: 'Username must be 3–30 characters.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    // Check duplicate
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }

    // Create user — password auto-hashed by pre('save') hook in model
    const user = await User.create({ username, email, password });

    const tokenPayload = { id: user._id, email: user.email, role: user.role };
    const accessToken  = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      data: { user: user.toSafeObject(), accessToken, refreshToken },
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }
    if (error.name === 'ValidationError') {
      const msg = Object.values(error.errors).map((e) => e.message).join(', ');
      return res.status(400).json({ success: false, message: msg });
    }
    console.error('[register]', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    // Must use .select('+password') because password has select:false in schema
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const tokenPayload = { id: user._id, email: user.email, role: user.role };
    const accessToken  = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: { user: user.toSafeObject(), accessToken, refreshToken },
    });

  } catch (error) {
    console.error('[login]', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// POST /api/auth/refresh
const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token is required.' });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user    = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found.' });
    }

    const newAccessToken = generateAccessToken({ id: user._id, email: user.email, role: user.role });

    return res.status(200).json({
      success: true,
      message: 'Token refreshed.',
      data: { accessToken: newAccessToken },
    });

  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired refresh token.' });
  }
};

// GET /api/auth/me  [Protected]
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    return res.status(200).json({ success: true, data: { user: user.toSafeObject() } });
  } catch {
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

module.exports = { register, login, refresh, getMe };
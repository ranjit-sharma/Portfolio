const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const asyncHandler = require('../utils/asyncHandler');
const { apiSuccess } = require('../utils/apiResponse');

const isProduction = process.env.NODE_ENV === 'production';
const isCrossSite =
  process.env.COOKIE_SAME_SITE === 'none' ||
  (Boolean(process.env.CLIENT_URL) && !process.env.CLIENT_URL.includes('localhost'));

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction && isCrossSite ? 'none' : 'lax',
  maxAge: parseInt(process.env.COOKIE_MAX_AGE || '604800000', 10),
};

// POST /api/v1/admin/login
const login = asyncHandler(async (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();
  const password = req.body.password;

  const admin = await Admin.findOne({ email }).select('+passwordHash');
  if (!admin) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const isMatch = await bcrypt.compare(password, admin.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  res.cookie('adminToken', token, COOKIE_OPTIONS);
  return apiSuccess(res, { email: admin.email }, 'Login successful');
});

// POST /api/v1/admin/logout
const logout = asyncHandler(async (req, res) => {
  res.clearCookie('adminToken', { ...COOKIE_OPTIONS, maxAge: 0 });
  return apiSuccess(res, null, 'Logged out successfully');
});

// GET /api/v1/admin/me
const getMe = asyncHandler(async (req, res) => {
  return apiSuccess(res, { email: req.admin.email, id: req.admin._id }, 'Authenticated');
});

module.exports = { login, logout, getMe };

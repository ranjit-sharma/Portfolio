const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.adminToken;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }

  const admin = await Admin.findById(decoded.id);
  if (!admin) {
    return res.status(401).json({ success: false, message: 'Admin account not found' });
  }

  req.admin = admin;
  next();
});

module.exports = { protect };

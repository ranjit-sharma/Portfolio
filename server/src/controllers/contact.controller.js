const ContactMessage = require('../models/ContactMessage');
const Profile = require('../models/Profile');
const asyncHandler = require('../utils/asyncHandler');
const { apiSuccess } = require('../utils/apiResponse');
const emailService = require('../services/email.service');

// POST /api/v1/contact  (public)
const submitContact = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  // 1. Save to MongoDB for admin message dashboard (preserved untouched)
  const doc = await ContactMessage.create({
    name,
    email,
    subject,
    message,
    ipAddress: req.ip,
  });

  // 2. Look up the admin email from Profile settings
  let adminEmail = process.env.CONTACT_RECEIVER_EMAIL || 'ctrl.ranjit@gmail.com';
  try {
    const profile = await Profile.findOne().select('email');
    if (profile && profile.email && profile.email.trim()) {
      adminEmail = profile.email.trim();
    }
  } catch (err) {
    console.warn('Could not fetch profile email:', err.message);
  }

  // 3. Attempt email delivery to the admin's setting email
  try {
    await emailService.sendContactEmail({ name, email, subject, message, toEmail: adminEmail });
  } catch (err) {
    console.warn('Email delivery skipped or failed:', err.message);
  }

  return apiSuccess(res, { id: doc._id }, 'Message received. Thank you for reaching out!', 201);
});

// GET /api/v1/admin/messages  (admin)
const getMessages = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const filter = req.query.status ? { status: req.query.status } : {};

  const [messages, total] = await Promise.all([
    ContactMessage.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ContactMessage.countDocuments(filter),
  ]);

  return apiSuccess(res, { messages, total, page, pages: Math.ceil(total / limit) });
});

// PATCH /api/v1/admin/messages/:id/status  (admin)
const updateMessageStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const msg = await ContactMessage.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );
  if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });
  return apiSuccess(res, msg, 'Status updated');
});

// DELETE /api/v1/admin/messages/:id  (admin)
const deleteMessage = asyncHandler(async (req, res) => {
  const msg = await ContactMessage.findByIdAndDelete(req.params.id);
  if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });
  return apiSuccess(res, null, 'Message deleted');
});

module.exports = { submitContact, getMessages, updateMessageStatus, deleteMessage };

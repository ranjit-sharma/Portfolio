const Experience = require('../models/Experience');
const asyncHandler = require('../utils/asyncHandler');
const { apiSuccess } = require('../utils/apiResponse');
const { deleteAsset } = require('../config/cloudinary');

// GET /api/v1/experience  (public)
const getExperience = asyncHandler(async (req, res) => {
  const experiences = await Experience.find().sort({ displayOrder: 1, startDate: -1 });
  return apiSuccess(res, experiences);
});

// GET /api/v1/admin/experience  (admin)
const getAllExperience = asyncHandler(async (req, res) => {
  const experiences = await Experience.find().sort({ displayOrder: 1, startDate: -1 });
  return apiSuccess(res, experiences);
});

// POST /api/v1/admin/experience  (admin)
const createExperience = asyncHandler(async (req, res) => {
  const exp = await Experience.create(req.body);
  return apiSuccess(res, exp, 'Experience created', 201);
});

// PUT /api/v1/admin/experience/:id  (admin)
const updateExperience = asyncHandler(async (req, res) => {
  const existing = await Experience.findById(req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: 'Experience not found' });

  // If certificateUrl was changed or cleared, delete the old file
  if (
    req.body.certificateUrl !== undefined &&
    req.body.certificateUrl !== existing.certificateUrl &&
    existing.certificateUrl
  ) {
    deleteAsset(existing.certificateUrl).catch(() => {});
  }

  const exp = await Experience.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  return apiSuccess(res, exp, 'Experience updated');
});

// DELETE /api/v1/admin/experience/:id  (admin)
const deleteExperience = asyncHandler(async (req, res) => {
  const exp = await Experience.findByIdAndDelete(req.params.id);
  if (!exp) return res.status(404).json({ success: false, message: 'Experience not found' });

  // Delete certificate file
  if (exp.certificateUrl) {
    deleteAsset(exp.certificateUrl).catch(() => {});
  }

  return apiSuccess(res, null, 'Experience deleted');
});

module.exports = { getExperience, getAllExperience, createExperience, updateExperience, deleteExperience };

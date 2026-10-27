const Profile = require('../models/Profile');
const asyncHandler = require('../utils/asyncHandler');
const { apiSuccess } = require('../utils/apiResponse');

// GET /api/v1/profile  (public)
const getProfile = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne();
  if (!profile) {
    return apiSuccess(res, null, 'No profile data found in database');
  }
  return apiSuccess(res, profile);
});

// POST /api/v1/views (record new visitor view)
const recordView = asyncHandler(async (req, res) => {
  const profile = await Profile.findOneAndUpdate(
    {},
    { $inc: { views: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  return apiSuccess(res, { views: profile.views || 1 });
});

// GET /api/v1/views (get total views)
const getViews = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne();
  return apiSuccess(res, { views: profile?.views || 0 });
});

// PUT /api/v1/admin/profile  (admin)
const updateProfile = asyncHandler(async (req, res) => {
  const profile = await Profile.findOneAndUpdate({}, req.body, {
    new: true,
    upsert: true,
    runValidators: true,
  });
  return apiSuccess(res, profile, 'Profile updated');
});

module.exports = { getProfile, updateProfile, recordView, getViews };

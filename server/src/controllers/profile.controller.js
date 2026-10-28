const Profile = require('../models/Profile');
const asyncHandler = require('../utils/asyncHandler');
const { apiSuccess } = require('../utils/apiResponse');
const { deleteAsset } = require('../config/cloudinary');
const { setTheme } = require('../utils/themeCache');

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
  const existing = await Profile.findOne();

  // If avatar was replaced or removed, delete the old avatar from Cloudinary
  if (
    existing &&
    req.body.avatarUrl !== undefined &&
    req.body.avatarUrl !== existing.avatarUrl &&
    existing.avatarUrl
  ) {
    deleteAsset(existing.avatarUrl).catch(() => {});
  }

  // If resume was replaced or removed, delete the old resume from Cloudinary
  if (
    existing &&
    req.body.resumeUrl !== undefined &&
    req.body.resumeUrl !== existing.resumeUrl &&
    existing.resumeUrl
  ) {
    deleteAsset(existing.resumeUrl).catch(() => {});
  }

  const profile = await Profile.findOneAndUpdate({}, req.body, {
    new: true,
    upsert: true,
    runValidators: true,
  });

  if (profile && (profile.themeMode || profile.accentColor)) {
    setTheme(profile.themeMode, profile.accentColor);
  }

  return apiSuccess(res, profile, 'Profile updated');
});

module.exports = { getProfile, updateProfile, recordView, getViews };

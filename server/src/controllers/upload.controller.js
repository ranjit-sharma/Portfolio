const path = require('path');
const fs = require('fs');
const asyncHandler = require('../utils/asyncHandler');
const { apiSuccess, apiError } = require('../utils/apiResponse');
const { isCloudinaryConfigured, uploadToCloudinary } = require('../config/cloudinary');

// POST /api/v1/admin/upload
const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    return apiError(res, 400, 'No file was uploaded');
  }

  // 1. If Cloudinary is configured, upload to Cloudinary CDN
  if (isCloudinaryConfigured()) {
    try {
      const result = await uploadToCloudinary(req.file.path);

      // Clean up temporary local file
      try {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      } catch (cleanupErr) {
        console.warn('Failed to delete temp file after Cloudinary upload:', cleanupErr.message);
      }

      return apiSuccess(
        res,
        {
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          resourceType: result.resource_type,
          filename: req.file.filename,
          originalName: req.file.originalname,
          mimetype: req.file.mimetype,
          size: result.bytes || req.file.size,
        },
        'File uploaded to Cloudinary successfully'
      );
    } catch (cloudErr) {
      console.error('Cloudinary upload failed, falling back to local storage:', cloudErr.message);
      // If Cloudinary upload failed, fall through to local storage
    }
  }

  // 2. Fallback: Local storage
  const clientUploadsDir = path.join(__dirname, '../../../client/public/uploads');
  try {
    if (!fs.existsSync(clientUploadsDir)) {
      fs.mkdirSync(clientUploadsDir, { recursive: true });
    }
    fs.copyFileSync(req.file.path, path.join(clientUploadsDir, req.file.filename));
  } catch (err) {
    console.error('Failed to sync to client/public/uploads:', err.message);
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  return apiSuccess(
    res,
    {
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    },
    'File uploaded successfully'
  );
});

module.exports = { uploadFile };

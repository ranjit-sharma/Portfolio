const path = require('path');
const fs = require('fs');
const asyncHandler = require('../utils/asyncHandler');
const { apiSuccess, apiError } = require('../utils/apiResponse');

// POST /api/v1/admin/upload
const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    return apiError(res, 400, 'No file was uploaded');
  }

  // Also sync to client/public/uploads so Vite serves it instantly
  const clientUploadsDir = path.join(__dirname, '../../../client/public/uploads');
  try {
    if (!fs.existsSync(clientUploadsDir)) {
      fs.mkdirSync(clientUploadsDir, { recursive: true });
    }
    fs.copyFileSync(req.file.path, path.join(clientUploadsDir, req.file.filename));
  } catch (err) {
    console.error('Failed to sync to client/public/uploads:', err.message);
  }

  // File URL served statically via Express & Vite
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

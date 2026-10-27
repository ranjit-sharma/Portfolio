const cloudinary = require('cloudinary').v2;
const fs = require('fs');

/**
 * Configure Cloudinary using either CLOUDINARY_URL or individual variables.
 */
function initCloudinary() {
  if (process.env.CLOUDINARY_URL) {
    cloudinary.config({
      cloudinary_url: process.env.CLOUDINARY_URL,
    });
  } else if (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  ) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }
}

initCloudinary();

/**
 * Check if Cloudinary is configured.
 */
function isCloudinaryConfigured() {
  const config = cloudinary.config();
  return Boolean(config.cloud_name && config.api_key && config.api_secret);
}

/**
 * Upload a local file to Cloudinary.
 * @param {string} filePath - Absolute path to local file
 * @param {object} options - Optional cloudinary upload parameters
 * @returns {Promise<object>} Cloudinary upload result
 */
async function uploadToCloudinary(filePath, options = {}) {
  // Re-run init in case environment variables were loaded dynamically
  initCloudinary();

  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary credentials are not configured');
  }

  const defaultOptions = {
    folder: 'portfolio',
    resource_type: 'auto',
    use_filename: true,
    unique_filename: true,
  };

  const uploadOptions = { ...defaultOptions, ...options };
  const result = await cloudinary.uploader.upload(filePath, uploadOptions);

  return result;
}

module.exports = {
  cloudinary,
  isCloudinaryConfigured,
  uploadToCloudinary,
};

const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

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
  initCloudinary();

  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary credentials are not configured');
  }

  const defaultOptions = {
    folder: 'portfolio',
    resource_type: 'auto',
    type: 'upload',
    access_mode: 'public',
    use_filename: true,
    unique_filename: true,
  };

  const uploadOptions = { ...defaultOptions, ...options };
  const result = await cloudinary.uploader.upload(filePath, uploadOptions);

  return result;
}

/**
 * Extract public_id, full path with extension, and resource type from a Cloudinary URL.
 * @param {string} urlOrId
 * @returns {object|null}
 */
function extractCloudinaryDetails(urlOrId) {
  if (!urlOrId || typeof urlOrId !== 'string') return null;

  // Already a raw public_id without http
  if (!/^https?:\/\//i.test(urlOrId)) {
    return { publicId: urlOrId, fullPathWithExt: urlOrId, resourceType: 'image' };
  }

  if (!urlOrId.includes('res.cloudinary.com')) return null;

  try {
    const urlObj = new URL(urlOrId);
    const parts = urlObj.pathname.split('/').filter(Boolean);
    const resourceType = parts[1] || 'image';
    const uploadIndex = parts.findIndex((p) => p === 'upload' || p === 'authenticated');
    if (uploadIndex === -1) return null;

    let subParts = parts.slice(uploadIndex + 1);
    if (subParts[0] && /^v\d+$/.test(subParts[0])) {
      subParts = subParts.slice(1);
    }
    const fullPathWithExt = subParts.join('/');
    const extIndex = fullPathWithExt.lastIndexOf('.');
    const publicId = extIndex !== -1 ? fullPathWithExt.substring(0, extIndex) : fullPathWithExt;

    return { publicId, fullPathWithExt, resourceType };
  } catch (err) {
    return null;
  }
}

/**
 * Delete an asset from Cloudinary (or local storage if local path).
 * @param {string} urlOrId - Full URL or public_id
 * @returns {Promise<boolean>}
 */
async function deleteAsset(urlOrId) {
  if (!urlOrId || typeof urlOrId !== 'string') return false;

  initCloudinary();

  // 1. Check if it's a Cloudinary asset
  const cloudDetails = extractCloudinaryDetails(urlOrId);
  if (cloudDetails && isCloudinaryConfigured()) {
    try {
      let res = await cloudinary.uploader.destroy(cloudDetails.publicId, {
        resource_type: cloudDetails.resourceType,
        invalidate: true,
      });

      // If 'not found', try raw resource type or full path with extension
      if (res.result === 'not found') {
        res = await cloudinary.uploader.destroy(cloudDetails.fullPathWithExt, {
          resource_type: 'raw',
          invalidate: true,
        });
      }
      if (res.result === 'not found') {
        res = await cloudinary.uploader.destroy(cloudDetails.publicId, {
          resource_type: 'raw',
          invalidate: true,
        });
      }

      console.log(`[Cloudinary] Deleted asset ${cloudDetails.publicId}: result=${res.result}`);
      return res.result === 'ok';
    } catch (err) {
      console.error(`[Cloudinary] Failed to delete ${cloudDetails.publicId}:`, err.message);
      return false;
    }
  }

  // 2. If it's a local /uploads/ URL, remove from local disk
  if (urlOrId.startsWith('/uploads/')) {
    try {
      const filename = path.basename(urlOrId);
      const localPaths = [
        path.join(__dirname, '../../uploads', filename),
        path.join(__dirname, '../../../client/public/uploads', filename),
      ];
      for (const p of localPaths) {
        if (fs.existsSync(p)) {
          fs.unlinkSync(p);
          console.log(`[Local Disk] Removed file: ${p}`);
        }
      }
      return true;
    } catch (err) {
      console.warn(`[Local Disk] Failed to delete local file: ${err.message}`);
    }
  }

  return false;
}

module.exports = {
  cloudinary,
  isCloudinaryConfigured,
  uploadToCloudinary,
  extractCloudinaryDetails,
  deleteAsset,
};

const Certification = require('../models/Certification');
const asyncHandler = require('../utils/asyncHandler');
const { apiSuccess } = require('../utils/apiResponse');
const { deleteAsset } = require('../config/cloudinary');

// GET /api/v1/certifications  (public)
const getCertifications = asyncHandler(async (req, res) => {
  const certs = await Certification.find().sort({ displayOrder: 1, issueDate: -1 });
  return apiSuccess(res, certs);
});

// POST /api/v1/admin/certifications  (admin)
const createCertification = asyncHandler(async (req, res) => {
  const cert = await Certification.create(req.body);
  return apiSuccess(res, cert, 'Certification created', 201);
});

// PUT /api/v1/admin/certifications/:id  (admin)
const updateCertification = asyncHandler(async (req, res) => {
  const existing = await Certification.findById(req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: 'Certification not found' });

  // If image changed or removed, delete the old file
  if (req.body.image !== undefined && req.body.image !== existing.image && existing.image) {
    deleteAsset(existing.image).catch(() => {});
  }

  const cert = await Certification.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  return apiSuccess(res, cert, 'Certification updated');
});

// DELETE /api/v1/admin/certifications/:id  (admin)
const deleteCertification = asyncHandler(async (req, res) => {
  const cert = await Certification.findByIdAndDelete(req.params.id);
  if (!cert) return res.status(404).json({ success: false, message: 'Certification not found' });

  // Delete certificate image/PDF
  if (cert.image) {
    deleteAsset(cert.image).catch(() => {});
  }

  return apiSuccess(res, null, 'Certification deleted');
});

module.exports = { getCertifications, createCertification, updateCertification, deleteCertification };

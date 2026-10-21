const Certification = require('../models/Certification');
const asyncHandler = require('../utils/asyncHandler');
const { apiSuccess } = require('../utils/apiResponse');

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
  const cert = await Certification.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!cert) return res.status(404).json({ success: false, message: 'Certification not found' });
  return apiSuccess(res, cert, 'Certification updated');
});

// DELETE /api/v1/admin/certifications/:id  (admin)
const deleteCertification = asyncHandler(async (req, res) => {
  const cert = await Certification.findByIdAndDelete(req.params.id);
  if (!cert) return res.status(404).json({ success: false, message: 'Certification not found' });
  return apiSuccess(res, null, 'Certification deleted');
});

module.exports = { getCertifications, createCertification, updateCertification, deleteCertification };

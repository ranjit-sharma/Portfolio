const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    issuer: { type: String, required: true, trim: true },
    issueDate: { type: Date },
    credentialUrl: { type: String, default: '' },
    image: { type: String, default: '' },
    description: { type: String, default: '' },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

certificationSchema.index({ displayOrder: 1 });

module.exports = mongoose.model('Certification', certificationSchema);

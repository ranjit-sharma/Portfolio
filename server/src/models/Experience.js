const mongoose = require('mongoose');

const statSchema = new mongoose.Schema(
  {
    value: { type: String, default: '' },
    label: { type: String, default: '' },
  },
  { _id: false }
);

const experienceSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true },
    companyShort: { type: String, trim: true, default: '' },
    companySub: { type: String, trim: true, default: '' },
    role: { type: String, required: true, trim: true },
    employmentType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance'],
      default: 'Internship',
    },
    location: { type: String, default: '' },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    current: { type: Boolean, default: false },
    durationText: { type: String, default: '' },
    description: { type: String, default: '' },
    projectTitle: { type: String, default: '' },
    repoUrl: { type: String, default: '' },
    repoLabel: { type: String, default: 'Database repo' },
    certificateUrl: { type: String, default: '' },
    stats: [statSchema],
    responsibilities: [{ type: String }],
    technologies: [{ type: String }],
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

experienceSchema.index({ displayOrder: 1 });

module.exports = mongoose.model('Experience', experienceSchema);

const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true },
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
    description: { type: String },
    responsibilities: [{ type: String }],
    technologies: [{ type: String }],
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

experienceSchema.index({ displayOrder: 1 });

module.exports = mongoose.model('Experience', experienceSchema);

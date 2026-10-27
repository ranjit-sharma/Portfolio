const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    categoryText: { type: String, default: '' },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String },
    technologies: [{ type: String }],
    features: [{ type: String }],
    stats: [
      {
        value: { type: String, default: '' },
        label: { type: String, default: '' },
      },
    ],
    image: { type: String, default: '' },
    gallery: [{ type: String }],
    githubUrl: { type: String, default: '' },
    liveDemoUrl: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['active', 'draft', 'archived'],
      default: 'active',
    },
  },
  { timestamps: true }
);

projectSchema.index({ featured: 1, displayOrder: 1 });

module.exports = mongoose.model('Project', projectSchema);

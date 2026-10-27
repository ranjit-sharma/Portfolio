const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    icon: { type: String, default: '' },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

skillSchema.index({ category: 1, displayOrder: 1 });

module.exports = mongoose.model('Skill', skillSchema);

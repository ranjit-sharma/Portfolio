const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    name: { type: String, default: 'Ranjit Sharma' },
    headline: { type: String, default: 'Full-Stack Developer' },
    bio: { type: String, default: '' },
    email: { type: String, default: 'ranjitsharma76088@gmail.com' },
    phone: { type: String, default: '' },
    location: { type: String, default: 'Bhubaneswar, Odisha, India' },
    languages: { type: String, default: 'English, Hindi, Odia' },
    githubUrl: { type: String, default: '' },
    linkedinUrl: { type: String, default: '' },
    leetcodeUrl: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    available: { type: Boolean, default: false },
    availabilityNote: { type: String, default: '' },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);

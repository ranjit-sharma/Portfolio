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
    instagramUrl: { type: String, default: '' },
    facebookUrl: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    available: { type: Boolean, default: false },
    availabilityNote: { type: String, default: '' },
    views: { type: Number, default: 0 },
    // Education settings (editable via Admin)
    educationCgpa: { type: String, default: '7.73' },
    educationCurrentSemester: { type: Number, default: 7 },
    educationTotalSemesters: { type: Number, default: 8 },
    educationDegree: { type: String, default: 'B.Tech in Computer Science & IT' },
    educationInstitution: { type: String, default: 'Trident Academy of Technology' },
    educationStartYear: { type: Number, default: 2023 },
    educationEndYear: { type: Number, default: 2027 },
    // Prior Schools & Colleges (editable via Admin)
    educationSchools: [
      {
        institution: { type: String, default: '' },
        qualification: { type: String, default: '' },
        level: { type: String, default: '' },
        board: { type: String, default: '' },
        location: { type: String, default: '' },
        start: { type: String, default: '' },
        end: { type: String, default: '' },
      },
    ],
    // About Highlights (editable via Admin)
    aboutHighlights: [
      {
        title: { type: String, default: '' },
        desc: { type: String, default: '' },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);

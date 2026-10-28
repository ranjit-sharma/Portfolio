const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');
const { loginSchema } = require('../validators/auth.validator');
const { projectSchema } = require('../validators/project.validator');
const { skillSchema } = require('../validators/skill.validator');
const { experienceSchema } = require('../validators/experience.validator');
const { certificationSchema } = require('../validators/certification.validator');
const { profileSchema } = require('../validators/profile.validator');

const { login, logout, getMe } = require('../controllers/auth.controller');
const { getAllProjects, createProject, updateProject, deleteProject } = require('../controllers/project.controller');
const { getAllExperience, createExperience, updateExperience, deleteExperience } = require('../controllers/experience.controller');
const { getSkills, createSkill, updateSkill, deleteSkill } = require('../controllers/skill.controller');
const { getCertifications, createCertification, updateCertification, deleteCertification } = require('../controllers/certification.controller');
const { getMessages, updateMessageStatus, deleteMessage } = require('../controllers/contact.controller');
const { updateProfile } = require('../controllers/profile.controller');
const upload = require('../middleware/upload');
const { uploadFile, deleteUploadedFile } = require('../controllers/upload.controller');

// Auth routes (no protect needed)
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

// File Upload & Delete (Resume / Avatar / Images / Certificates)
router.post('/upload', protect, upload.single('file'), uploadFile);
router.delete('/upload', protect, deleteUploadedFile);

// Profile
router.put('/profile', protect, validate(profileSchema), updateProfile);

// Projects
router.get('/projects', protect, getAllProjects);
router.post('/projects', protect, validate(projectSchema), createProject);
router.put('/projects/:id', protect, validate(projectSchema.partial()), updateProject);
router.delete('/projects/:id', protect, deleteProject);

// Experience
router.get('/experience', protect, getAllExperience);
router.post('/experience', protect, validate(experienceSchema), createExperience);
router.put('/experience/:id', protect, validate(experienceSchema.partial()), updateExperience);
router.delete('/experience/:id', protect, deleteExperience);

// Skills
router.get('/skills', protect, getSkills);
router.post('/skills', protect, validate(skillSchema), createSkill);
router.put('/skills/:id', protect, validate(skillSchema.partial()), updateSkill);
router.delete('/skills/:id', protect, deleteSkill);

// Certifications
router.get('/certifications', protect, getCertifications);
router.post('/certifications', protect, validate(certificationSchema), createCertification);
router.put('/certifications/:id', protect, validate(certificationSchema.partial()), updateCertification);
router.delete('/certifications/:id', protect, deleteCertification);

// Messages
router.get('/messages', protect, getMessages);
router.patch('/messages/:id/status', protect, updateMessageStatus);
router.delete('/messages/:id', protect, deleteMessage);

module.exports = router;

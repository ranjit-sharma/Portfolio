const express = require('express');
const router = express.Router();

const { getProfile, getViews, recordView } = require('../controllers/profile.controller');
const { getProjects, getProjectBySlug } = require('../controllers/project.controller');
const { getSkills } = require('../controllers/skill.controller');
const { getExperience } = require('../controllers/experience.controller');
const { getCertifications } = require('../controllers/certification.controller');
const { submitContact } = require('../controllers/contact.controller');
const { contactLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');
const { contactSchema } = require('../validators/contact.validator');
const { getConnectionStatus } = require('../config/db');

// Health check with DB status
router.get('/health', (req, res) => {
  const dbStatus = getConnectionStatus();
  const isHealthy = dbStatus.isConnected;

  res.status(isHealthy ? 200 : 503).json({
    success: isHealthy,
    status: isHealthy ? 'healthy' : 'degraded',
    message: isHealthy ? 'API and database are healthy' : 'Database connection unavailable',
    database: dbStatus,
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// Views counter
router.get('/views', getViews);
router.post('/views', recordView);

// Public data
router.get('/profile', getProfile);
router.get('/projects', getProjects);
router.get('/projects/:slug', getProjectBySlug);
router.get('/skills', getSkills);
router.get('/experience', getExperience);
router.get('/certifications', getCertifications);

// Contact form
router.post('/contact', contactLimiter, validate(contactSchema), submitContact);

module.exports = router;

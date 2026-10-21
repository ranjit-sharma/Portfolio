/**
 * Seeds the database with initial portfolio content (skills, experience, projects, certifications).
 * Safe to run multiple times — skips existing documents.
 *
 * Usage: node scripts/seedData.js
 *
 * Requires MONGODB_URI in .env
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');

const Skill = require('../src/models/Skill');
const Experience = require('../src/models/Experience');
const Project = require('../src/models/Project');
const Certification = require('../src/models/Certification');
const Profile = require('../src/models/Profile');

const SKILLS = [
  // Frontend
  { name: 'HTML5', category: 'Frontend', displayOrder: 1 },
  { name: 'CSS3', category: 'Frontend', displayOrder: 2 },
  { name: 'JavaScript', category: 'Frontend', displayOrder: 3 },
  { name: 'React.js', category: 'Frontend', displayOrder: 4 },
  { name: 'Tailwind CSS', category: 'Frontend', displayOrder: 5 },
  { name: 'Bootstrap', category: 'Frontend', displayOrder: 6 },
  { name: 'EJS', category: 'Frontend', displayOrder: 7 },
  // Backend
  { name: 'Node.js', category: 'Backend', displayOrder: 1 },
  { name: 'Express.js', category: 'Backend', displayOrder: 2 },
  { name: 'REST APIs', category: 'Backend', displayOrder: 3 },
  { name: 'Authentication & Authorization', category: 'Backend', displayOrder: 4 },
  { name: 'Middleware', category: 'Backend', displayOrder: 5 },
  { name: 'Input Validation', category: 'Backend', displayOrder: 6 },
  { name: 'Error Handling', category: 'Backend', displayOrder: 7 },
  // Database
  { name: 'MongoDB', category: 'Database', displayOrder: 1 },
  { name: 'Mongoose', category: 'Database', displayOrder: 2 },
  { name: 'MySQL', category: 'Database', displayOrder: 3 },
  // Language
  { name: 'Java', category: 'Language', displayOrder: 1 },
  { name: 'JavaScript', category: 'Language', displayOrder: 2 },
  // CS Fundamentals
  { name: 'Data Structures & Algorithms', category: 'CS Fundamentals', displayOrder: 1 },
  { name: 'OOP', category: 'CS Fundamentals', displayOrder: 2 },
  { name: 'DBMS', category: 'CS Fundamentals', displayOrder: 3 },
  { name: 'Operating Systems', category: 'CS Fundamentals', displayOrder: 4 },
  { name: 'Computer Networks', category: 'CS Fundamentals', displayOrder: 5 },
  // Tools
  { name: 'Git', category: 'Tools', displayOrder: 1 },
  { name: 'GitHub', category: 'Tools', displayOrder: 2 },
  { name: 'VS Code', category: 'Tools', displayOrder: 3 },
  { name: 'Postman', category: 'Tools', displayOrder: 4 },
];

const EXPERIENCE = [
  {
    company: 'DRDO PXE',
    role: 'Software Development Intern',
    employmentType: 'Internship',
    location: 'Chandipur, Odisha',
    startDate: new Date('2026-06-01'),
    endDate: new Date('2026-07-31'),
    current: false,
    description: 'Worked on the Upper Air Sounding System (UASS) — a LAN-based ground station terminal for real-time meteorological data acquisition and visualization.',
    responsibilities: [
      'Developed functionality for processing binary telemetry frames from weather sounding equipment',
      'Built real-time monitoring interfaces for live GPS and meteorological sensor data',
      'Worked with TCP/UDP socket communication for LAN-based data acquisition',
      'Implemented interactive graphical visualization for atmospheric parameter data',
      'Tested system with real and simulated telemetry streams from weather balloons',
    ],
    technologies: ['JavaScript', 'Node.js', 'React', 'TCP/UDP', 'Binary Data Processing', 'Data Visualization', 'Networking'],
    displayOrder: 1,
  },
  {
    company: 'Cognifyz Technologies',
    role: 'Java Development Intern',
    employmentType: 'Internship',
    location: 'Remote',
    startDate: new Date('2024-12-15'),
    endDate: new Date('2025-01-15'),
    current: false,
    description: 'Completed a structured Java development internship focused on core programming concepts and object-oriented design patterns.',
    responsibilities: [
      'Implemented Java programs covering core programming concepts',
      'Applied object-oriented programming principles in practical tasks',
      'Worked on structured problem-solving exercises and assignments',
    ],
    technologies: ['Java', 'OOP', 'Data Structures'],
    displayOrder: 2,
  },
];

const PROJECTS = [
  {
    title: 'WonderLust',
    slug: 'wonderlust',
    shortDescription: 'A full-stack property-listing web application with listing management, RESTful routes, server-side rendering, database integration, input validation, reusable middleware, session-based functionality, and asynchronous error handling.',
    fullDescription: 'WonderLust is a full-stack web application that enables users to discover, list, and manage properties. Built with the MVC architecture pattern, it features complete CRUD operations for property listings, user authentication and authorization, form and schema-level validation using Joi, reusable Express middleware, and a responsive Bootstrap UI with EJS templates.',
    technologies: ['Node.js', 'Express.js', 'EJS', 'MongoDB', 'Mongoose', 'Joi', 'Bootstrap', 'Passport.js'],
    features: [
      'Property listing CRUD operations',
      'User authentication and authorization',
      'Form and schema validation with Joi',
      'Reusable Express middleware',
      'Responsive UI with Bootstrap',
      'Database-backed listing management',
      'Session-based authentication',
      'Asynchronous error handling',
    ],
    githubUrl: '',
    liveDemoUrl: '',
    featured: true,
    displayOrder: 1,
    status: 'active',
  },
  {
    title: 'DRDO UASS Monitoring & Visualization System',
    slug: 'drdo-uass-monitoring',
    shortDescription: 'Real-time monitoring and visualization system for upper-air sounding and meteorological telemetry, featuring sensor data processing and interactive graphical visualization.',
    fullDescription: 'Developed during internship at DRDO PXE, this system processes real-time telemetry from upper-air sounding equipment (weather balloons). It decodes binary frames received over TCP/UDP from the radiosonde equipment and displays live atmospheric parameters including temperature, pressure, humidity, and GPS coordinates on an interactive dashboard.',
    technologies: ['JavaScript', 'Node.js', 'React', 'TCP/UDP Sockets', 'Binary Protocol Parsing', 'Chart.js', 'LAN Networking'],
    features: [
      'Real-time binary telemetry frame decoding',
      'TCP/UDP socket communication',
      'Live GPS and sensor data monitoring',
      'Interactive atmospheric parameter charts',
      'LAN-based ground station data acquisition',
      'Simulated telemetry testing support',
    ],
    githubUrl: '',
    liveDemoUrl: '',
    featured: true,
    displayOrder: 2,
    status: 'active',
  },
];

const CERTIFICATIONS = [
  {
    name: 'Oracle Cloud Infrastructure 2025 Certified Generative AI Professional',
    issuer: 'Oracle',
    issueDate: new Date('2025-01-01'),
    credentialUrl: '',
    description: 'Certification covering generative AI fundamentals, OCI AI services, large language models, and practical AI solution development on Oracle Cloud Infrastructure.',
    displayOrder: 1,
  },
  {
    name: 'Technical Communication',
    issuer: 'TCS iON',
    issueDate: null,
    credentialUrl: '',
    description: 'Certification in technical writing and communication skills for technology professionals.',
    displayOrder: 2,
  },
  {
    name: 'Geo-data Sharing and Cyber Security',
    issuer: 'ISRO / IIRS',
    issueDate: null,
    credentialUrl: '',
    description: 'Online course covering geospatial data handling, sharing protocols, and cyber security practices for earth observation data.',
    displayOrder: 3,
  },
  {
    name: 'Smart India Hackathon Participant',
    issuer: 'Ministry of Education, Government of India',
    issueDate: null,
    credentialUrl: '',
    description: 'Participated in the Smart India Hackathon — a national initiative by the Government of India to encourage innovation and problem-solving among students.',
    displayOrder: 4,
  },
];

const PROFILE = {
  name: 'Ranjit Sharma',
  headline: 'Full-Stack Developer',
  bio: 'B.Tech in Computer Science from Trident Academy of Technology, Bhubaneswar. I build web applications from frontend to backend — designing user interfaces, developing REST APIs, and integrating databases. Passionate about clean code, scalable systems, and continuous learning.',
  email: 'ranjitsharma76088@gmail.com',
  location: 'Bhubaneswar, Odisha, India',
  githubUrl: 'https://github.com/Ranjitsharma76088',
  linkedinUrl: 'https://linkedin.com/in/ranjit-sharma',
  resumeUrl: '',
  avatarUrl: '',
  available: true,
  availabilityNote: 'Open to full-time roles and internships',
};

(async () => {
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI not set in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Seed Profile
    const profileExists = await Profile.findOne();
    if (!profileExists) {
      await Profile.create(PROFILE);
      console.log('✅ Profile seeded');
    } else {
      console.log('ℹ️  Profile already exists — skipping');
    }

    // Seed Skills
    const skillCount = await Skill.countDocuments();
    if (skillCount === 0) {
      await Skill.insertMany(SKILLS);
      console.log(`✅ ${SKILLS.length} skills seeded`);
    } else {
      console.log('ℹ️  Skills already exist — skipping');
    }

    // Seed Experience
    const expCount = await Experience.countDocuments();
    if (expCount === 0) {
      await Experience.insertMany(EXPERIENCE);
      console.log(`✅ ${EXPERIENCE.length} experience entries seeded`);
    } else {
      console.log('ℹ️  Experience already exists — skipping');
    }

    // Seed Projects
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      await Project.insertMany(PROJECTS);
      console.log(`✅ ${PROJECTS.length} projects seeded`);
    } else {
      console.log('ℹ️  Projects already exist — skipping');
    }

    // Seed Certifications
    const certCount = await Certification.countDocuments();
    if (certCount === 0) {
      await Certification.insertMany(CERTIFICATIONS);
      console.log(`✅ ${CERTIFICATIONS.length} certifications seeded`);
    } else {
      console.log('ℹ️  Certifications already exist — skipping');
    }

    console.log('\n🎉 Seed complete!');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();

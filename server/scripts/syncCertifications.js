const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/../.env' });
const Certification = require('../src/models/Certification');

const items = [
  {
    name: 'Oracle Cloud Infrastructure 2025 Certified Generative AI Professional',
    issuer: 'Oracle University',
    issueDate: new Date('2025-01-01'),
    credentialUrl: '',
    image: '/uploads/Screenshot_2026-10-21_132422-1792570047406-5572.png',
    description: 'Certification covering generative AI fundamentals, OCI AI services, large language models, and practical AI solution development on Oracle Cloud Infrastructure.',
    category: 'Certifications',
    windowTitle: 'Oracle University',
    badge: 'Certified Professional',
    dateTag: 'Jan 2025',
    displayOrder: 1,
  },
  {
    name: 'Technical Communication',
    issuer: 'TCS iON',
    issueDate: null,
    credentialUrl: '',
    image: '',
    description: 'Certification in technical writing, workplace communication, and professional documentation for technology specialists.',
    category: 'Certifications',
    windowTitle: 'TCS iON',
    badge: 'Certified',
    dateTag: '2024',
    displayOrder: 2,
  },
  {
    name: 'Geo-data Sharing and Cyber Security',
    issuer: 'ISRO / IIRS',
    issueDate: null,
    credentialUrl: '',
    image: '',
    description: 'Specialized course by ISRO / IIRS covering geospatial data infrastructure, secure data sharing protocols, and cyber security practices.',
    category: 'Certifications',
    windowTitle: 'ISRO / IIRS',
    badge: 'Course Completed',
    dateTag: '2024',
    displayOrder: 3,
  },
  {
    name: 'Smart India Hackathon Participant',
    issuer: 'Ministry of Education, Government of India',
    issueDate: null,
    credentialUrl: '',
    image: '',
    description: 'Participant in the nationwide Smart India Hackathon initiative organized by the Ministry of Education and AICTE, Government of India.',
    category: 'Competitions',
    windowTitle: 'Smart India Hackathon',
    badge: 'National Finalist',
    dateTag: '2024',
    displayOrder: 4,
  },
];

async function sync() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('No MONGODB_URI found');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  await Certification.deleteMany({});
  console.log('Cleared existing certifications');

  const inserted = await Certification.insertMany(items);
  console.log(`Successfully synced ${inserted.length} real certifications for Ranjit Sharma`);

  await mongoose.disconnect();
}

sync().catch(err => {
  console.error('Error syncing:', err);
  process.exit(1);
});

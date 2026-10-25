const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/../.env' });
const Certification = require('../src/models/Certification');

const items = [
  {
    name: 'Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate',
    issuer: 'Oracle University',
    issueDate: new Date('2025-10-01'),
    credentialUrl: '',
    image: '/certificates/cert_1_oracle.png',
    description: 'Certification covering AI concepts, OCI AI services, machine learning foundations, and cloud deployment.',
    category: 'Certifications',
    windowTitle: 'Oracle University',
    badge: 'Valid until Oct 2027',
    dateTag: 'Oct 2025',
    displayOrder: 1,
  },
  {
    name: 'Programming In Java',
    issuer: 'NPTEL · IIT Kharagpur',
    issueDate: new Date('2025-04-01'),
    credentialUrl: '',
    image: '/certificates/cert_2_nptel_java.png',
    description: '12-week course and proctored examination covering core Java, OOP, collections, multithreading, and JVM internals.',
    category: 'Certifications',
    windowTitle: 'NPTEL',
    badge: 'Elite - Silver · 77%',
    dateTag: 'Jan-Apr 2025 · 12 weeks',
    displayOrder: 2,
  },
  {
    name: 'Data Base Management System',
    issuer: 'NPTEL · IIT Kharagpur',
    issueDate: new Date('2025-09-01'),
    credentialUrl: '',
    image: '/certificates/cert_3_nptel_dbms.png',
    description: '8-week comprehensive course covering relational algebra, SQL, normalization, transactions, indexing, and query optimization.',
    category: 'Certifications',
    windowTitle: 'NPTEL',
    badge: 'Score 57%',
    dateTag: 'Jul-Sep 2025 · 8 weeks',
    displayOrder: 3,
  },
  {
    name: 'Data Structure and Algorithms using Java',
    issuer: 'NPTEL · IIT Kharagpur',
    issueDate: new Date('2024-10-01'),
    credentialUrl: '',
    image: '/certificates/cert_4_nptel_dsa.png',
    description: '12-week intensive course on algorithmic paradigms, asymptotic analysis, linear and non-linear data structures, and graph algorithms.',
    category: 'Certifications',
    windowTitle: 'NPTEL',
    badge: 'Score 57%',
    dateTag: 'Jul-Oct 2024 · 12 weeks',
    displayOrder: 4,
  },
  {
    name: 'Internship Training — Upper Air Sounding Real-Time Monitoring and Visualization Dashboard',
    issuer: 'Proof & Experimental Establishment (PXE), DRDO',
    issueDate: new Date('2026-07-17'),
    credentialUrl: '',
    image: '/certificates/cert_5_drdo.png',
    description: 'Certificate of Internship Training at Proof & Experimental Establishment (PXE), Ministry of Defence, Government of India.',
    category: 'Internships',
    windowTitle: 'DRDO',
    badge: 'Certificate No. 249/2026',
    dateTag: '18 Jun – 17 Jul 2026',
    displayOrder: 5,
  },
  {
    name: 'Certificate of Internship — Software Development Intern',
    issuer: 'Astro Vedangam Private Limited',
    issueDate: new Date('2026-01-31'),
    credentialUrl: '',
    image: '/certificates/cert_6_astro.png',
    description: 'Software Development Internship certification with Astro Vedangam Private Limited for contributions to web applications.',
    category: 'Internships',
    windowTitle: 'Astro Vedangam Private Limited',
    badge: 'Sep 2025 – Jan 2026',
    dateTag: 'Sep 2025 – Jan 2026',
    displayOrder: 6,
  },
  {
    name: "PRAVAAH'25 — Web Hackathon",
    issuer: 'Certificate of Participation · IIT Bhubaneswar',
    issueDate: new Date('2025-01-15'),
    credentialUrl: '',
    image: '/certificates/cert_7_pravaah.png',
    description: "Participated in the PRAVAAH'25 Annual Cultural and Technology Festival Web Hackathon at Indian Institute of Technology Bhubaneswar.",
    category: 'Competitions',
    windowTitle: 'Certificate of Participation',
    badge: '2025',
    dateTag: '2025',
    displayOrder: 7,
  },
  {
    name: 'PixelCraft — The UI Showdown',
    issuer: 'Certificate of Participation · Brain Logic Club, Trident Academy of Technology',
    issueDate: new Date('2024-11-20'),
    credentialUrl: '',
    image: '/certificates/cert_8_pixelcraft.png',
    description: 'Certificate of Participation in PixelCraft — The UI Showdown organized by the Brain Logic Club at Trident Academy of Technology.',
    category: 'Competitions',
    windowTitle: 'Certificate of Participation',
    badge: 'Score 57%',
    dateTag: '',
    displayOrder: 8,
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
  console.log(`Successfully synced ${inserted.length} certifications`);

  await mongoose.disconnect();
}

sync().catch(err => {
  console.error('Error syncing:', err);
  process.exit(1);
});

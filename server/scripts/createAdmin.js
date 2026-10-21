/**
 * Admin setup script — run once to create the first admin account.
 * Usage: node scripts/createAdmin.js
 *
 * Requires ADMIN_EMAIL and ADMIN_PASSWORD in .env
 * NEVER commit .env with real credentials.
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('❌ Missing required env vars: MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD');
  process.exit(1);
}

if (ADMIN_PASSWORD.length < 8) {
  console.error('❌ ADMIN_PASSWORD must be at least 8 characters');
  process.exit(1);
}

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
}, { timestamps: true });

const Admin = mongoose.model('Admin', adminSchema);

(async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const existing = await Admin.findOne({ email: ADMIN_EMAIL.toLowerCase() });
    if (existing) {
      console.log('⚠️  Admin already exists for this email. Aborting.');
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await Admin.create({ email: ADMIN_EMAIL.toLowerCase(), passwordHash });

    console.log(`✅ Admin created: ${ADMIN_EMAIL}`);
  } catch (err) {
    console.error('❌ Error creating admin:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();

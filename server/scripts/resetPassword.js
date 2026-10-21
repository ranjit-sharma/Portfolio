/**
 * Resets the admin password.
 * Usage: node scripts/resetPassword.js
 * Reads ADMIN_EMAIL and ADMIN_PASSWORD from .env
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('❌ Missing MONGODB_URI, ADMIN_EMAIL or ADMIN_PASSWORD in .env');
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

    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    const result = await Admin.findOneAndUpdate(
      { email: ADMIN_EMAIL.toLowerCase() },
      { passwordHash },
      { new: true }
    );

    if (!result) {
      console.log('❌ No admin found with email:', ADMIN_EMAIL);
      process.exit(1);
    }

    console.log(`✅ Password updated for: ${result.email}`);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();

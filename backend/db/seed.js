require('../config/env');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

async function seed() {
  try {
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMeStrong!123';
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER || null;
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await db.query(
      `
      INSERT INTO admins (username, password, email)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE password = VALUES(password), email = VALUES(email)
      `,
      [adminUsername, hashedPassword, adminEmail]
    );

    console.log(`Seed complete. Admin user ready: ${adminUsername}`);
  } catch (error) {
    console.error('Seed failed:', error);
  } finally {
    process.exit(0);
  }
}

seed();

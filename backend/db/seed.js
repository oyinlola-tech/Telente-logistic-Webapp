require('../config/env');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

async function seed() {
  try {
    const adminUsername = process.env.ADMIN_USERNAME ;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER || null;
    const [existingRows] = await db.query(
      'SELECT id FROM admins WHERE username = ? LIMIT 1',
      [adminUsername]
    );

    if (existingRows.length === 0) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await db.query(
        `
        INSERT INTO admins (username, password, email)
        VALUES (?, ?, ?)
        `,
        [adminUsername, hashedPassword, adminEmail]
      );
    }

    console.log(`Seed complete. Admin user ready: ${adminUsername}`);
  } catch (error) {
    console.error('Seed failed:', error);
  } finally {
    process.exit(0);
  }
}

seed();

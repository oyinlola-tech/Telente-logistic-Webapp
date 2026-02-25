require('../config/env');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const createTablesSQL = [
  `
  CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) NULL,
    password VARCHAR(255) NOT NULL,
    reset_token_hash VARCHAR(255) NULL,
    reset_token_expires_at TIMESTAMP NULL,
    otp_code_hash VARCHAR(255) NULL,
    otp_expires_at TIMESTAMP NULL,
    otp_attempts INT NOT NULL DEFAULT 0,
    otp_last_sent_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS packages (
    id VARCHAR(36) PRIMARY KEY,
    tracking_number VARCHAR(50) UNIQUE NOT NULL,
    sender_name VARCHAR(255) NOT NULL,
    sender_email VARCHAR(255),
    sender_phone VARCHAR(50) NOT NULL,
    sender_address TEXT NOT NULL,
    recipient_name VARCHAR(255) NOT NULL,
    recipient_email VARCHAR(255),
    recipient_phone VARCHAR(50) NOT NULL,
    recipient_address TEXT NOT NULL,
    weight DECIMAL(10,2) NOT NULL,
    dimensions VARCHAR(50) NOT NULL,
    service VARCHAR(50) NOT NULL,
    status ENUM('pending','in_transit','out_for_delivery','delayed','delivered','cancelled') NOT NULL DEFAULT 'pending',
    current_location VARCHAR(255),
    estimated_delivery DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS tracking_events (
    id VARCHAR(36) PRIMARY KEY,
    package_id VARCHAR(36) NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    location VARCHAR(255) NOT NULL,
    status VARCHAR(100) NOT NULL,
    description TEXT,
    FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS contact_submissions (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    service VARCHAR(50) NOT NULL,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS career_applications (
    id VARCHAR(36) PRIMARY KEY,
    job_id VARCHAR(120) NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(80) NOT NULL,
    cover_letter TEXT,
    resume_file_name VARCHAR(255),
    status ENUM('new','reviewed','shortlisted','rejected') NOT NULL DEFAULT 'new',
    status_updated_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_career_applications_job_id (job_id),
    INDEX idx_career_applications_email (email)
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS jobs (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    salary VARCHAR(255),
    description TEXT NOT NULL,
    requirements JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
  `
];

async function columnExists(connection, dbName, tableName, columnName) {
  const [rows] = await connection.query(
    `
    SELECT 1
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?
    LIMIT 1
    `,
    [dbName, tableName, columnName]
  );
  return rows.length > 0;
}

async function adminExists(connection, username) {
  const [rows] = await connection.query(
    `
    SELECT 1
    FROM admins
    WHERE username = ?
    LIMIT 1
    `,
    [username]
  );
  return rows.length > 0;
}

async function ensureDatabaseAndSeedAdmin() {
  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const dbName = process.env.DB_NAME;

  if (!host || !user || !dbName) {
    throw new Error('Missing DB_HOST, DB_USER, or DB_NAME environment variables');
  }

  const connection = await mysql.createConnection({ host, port, user, password });

  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await connection.query(`USE \`${dbName}\``);

    for (const sql of createTablesSQL) {
      await connection.query(sql);
    }

    if (!(await columnExists(connection, dbName, 'packages', 'sender_email'))) {
      await connection.query(
        'ALTER TABLE packages ADD COLUMN sender_email VARCHAR(255) NULL AFTER sender_name'
      );
    }
    if (!(await columnExists(connection, dbName, 'packages', 'recipient_email'))) {
      await connection.query(
        'ALTER TABLE packages ADD COLUMN recipient_email VARCHAR(255) NULL AFTER recipient_name'
      );
    }
    await connection.query(
      "ALTER TABLE packages MODIFY COLUMN status ENUM('pending','in_transit','out_for_delivery','delayed','delivered','cancelled') NOT NULL DEFAULT 'pending'"
    );
    if (!(await columnExists(connection, dbName, 'career_applications', 'status'))) {
      await connection.query(
        "ALTER TABLE career_applications ADD COLUMN status ENUM('new','reviewed','shortlisted','rejected') NOT NULL DEFAULT 'new' AFTER resume_file_name"
      );
    }
    if (!(await columnExists(connection, dbName, 'career_applications', 'status_updated_at'))) {
      await connection.query(
        'ALTER TABLE career_applications ADD COLUMN status_updated_at TIMESTAMP NULL AFTER status'
      );
    }
    if (!(await columnExists(connection, dbName, 'admins', 'email'))) {
      await connection.query(
        'ALTER TABLE admins ADD COLUMN email VARCHAR(255) NULL AFTER username'
      );
    }
    if (!(await columnExists(connection, dbName, 'admins', 'otp_code_hash'))) {
      await connection.query(
        'ALTER TABLE admins ADD COLUMN otp_code_hash VARCHAR(255) NULL AFTER password'
      );
    }
    if (!(await columnExists(connection, dbName, 'admins', 'otp_expires_at'))) {
      await connection.query(
        'ALTER TABLE admins ADD COLUMN otp_expires_at TIMESTAMP NULL AFTER otp_code_hash'
      );
    }
    if (!(await columnExists(connection, dbName, 'admins', 'otp_attempts'))) {
      await connection.query(
        'ALTER TABLE admins ADD COLUMN otp_attempts INT NOT NULL DEFAULT 0 AFTER otp_expires_at'
      );
    }
    if (!(await columnExists(connection, dbName, 'admins', 'otp_last_sent_at'))) {
      await connection.query(
        'ALTER TABLE admins ADD COLUMN otp_last_sent_at TIMESTAMP NULL AFTER otp_attempts'
      );
    }
    if (!(await columnExists(connection, dbName, 'admins', 'reset_token_hash'))) {
      await connection.query(
        'ALTER TABLE admins ADD COLUMN reset_token_hash VARCHAR(255) NULL AFTER password'
      );
    }
    if (!(await columnExists(connection, dbName, 'admins', 'reset_token_expires_at'))) {
      await connection.query(
        'ALTER TABLE admins ADD COLUMN reset_token_expires_at TIMESTAMP NULL AFTER reset_token_hash'
      );
    }

    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMeStrong!123';
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER || null;
    if (!(await adminExists(connection, adminUsername))) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await connection.query(
        `
        INSERT INTO admins (username, password, email)
        VALUES (?, ?, ?)
        `,
        [adminUsername, hashedPassword, adminEmail]
      );
    }

    const [jobCountRows] = await connection.query('SELECT COUNT(*) AS total FROM jobs');
    if (jobCountRows[0].total === 0) {
      const starterJobs = [
        {
          id: 'b7a26fd7-03d6-4718-8ddf-7d247f84e8b1',
          title: 'Logistics Coordinator',
          department: 'Operations',
          location: 'Lagos, Nigeria',
          type: 'Full-time',
          salary: 'Competitive',
          description:
            'Coordinate shipment planning, documentation, and exception handling across domestic and international deliveries.',
          requirements: JSON.stringify([
            '2+ years logistics operations experience',
            'Strong communication and coordination skills',
            'Experience with shipment tracking tools'
          ])
        },
        {
          id: '6e3e0128-c89d-47e1-b18c-7025cdf9656c',
          title: 'Customer Support Specialist',
          department: 'Customer Experience',
          location: 'Remote',
          type: 'Full-time',
          salary: 'Competitive',
          description:
            'Support customers with shipment inquiries, service updates, and issue resolution while maintaining high response quality.',
          requirements: JSON.stringify([
            '1+ years customer support experience',
            'Clear written and verbal communication',
            'Experience with CRM tools is a plus'
          ])
        }
      ];

      for (const job of starterJobs) {
        await connection.query(
          `
          INSERT INTO jobs (id, title, department, location, type, salary, description, requirements)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [job.id, job.title, job.department, job.location, job.type, job.salary, job.description, job.requirements]
        );
      }
    }
  } finally {
    await connection.end();
  }
}

module.exports = { ensureDatabaseAndSeedAdmin };

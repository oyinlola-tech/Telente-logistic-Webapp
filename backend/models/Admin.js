const db = require('../config/db');
const bcrypt = require('bcryptjs');

const Admin = {
  async findByUsername(username) {
    const [rows] = await db.query(
      `
      SELECT id, username, email, password, otp_code_hash, otp_expires_at, otp_attempts, otp_last_sent_at, created_at
      FROM admins
      WHERE username = ?
      LIMIT 1
      `,
      [username]
    );
    return rows[0];
  },

  async findById(id) {
    const [rows] = await db.query(
      `
      SELECT id, username, email, otp_code_hash, otp_attempts, otp_expires_at, otp_last_sent_at, created_at
      FROM admins
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );
    return rows[0];
  },

  async findByUsernameOrEmail(identifier) {
    const [rows] = await db.query(
      `
      SELECT id, username, email, password, reset_token_hash, reset_token_expires_at,
             otp_code_hash, otp_expires_at, otp_attempts, otp_last_sent_at, created_at
      FROM admins
      WHERE username = ? OR email = ?
      LIMIT 1
      `,
      [identifier, identifier]
    );
    return rows[0];
  },

  async findByIdWithPassword(id) {
    const [rows] = await db.query(
      `
      SELECT id, username, email, password, created_at
      FROM admins
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );
    return rows[0];
  },

  async findByResetTokenHash(resetTokenHash) {
    const [rows] = await db.query(
      `
      SELECT id, username, email, password, reset_token_hash, reset_token_expires_at
      FROM admins
      WHERE reset_token_hash = ? AND reset_token_expires_at IS NOT NULL AND reset_token_expires_at > CURRENT_TIMESTAMP
      LIMIT 1
      `,
      [resetTokenHash]
    );
    return rows[0];
  },

  async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  },

  async updateOtpState(id, { otpCodeHash, otpExpiresAt, otpAttempts = 0, otpLastSentAt }) {
    const [result] = await db.query(
      `
      UPDATE admins
      SET otp_code_hash = ?, otp_expires_at = ?, otp_attempts = ?, otp_last_sent_at = ?
      WHERE id = ?
      `,
      [otpCodeHash, otpExpiresAt, otpAttempts, otpLastSentAt, id]
    );
    return result.affectedRows > 0;
  },

  async incrementOtpAttempts(id) {
    await db.query(
      `
      UPDATE admins
      SET otp_attempts = IFNULL(otp_attempts, 0) + 1
      WHERE id = ?
      `,
      [id]
    );
  },

  async clearOtp(id) {
    const [result] = await db.query(
      `
      UPDATE admins
      SET otp_code_hash = NULL, otp_expires_at = NULL, otp_attempts = 0
      WHERE id = ?
      `,
      [id]
    );
    return result.affectedRows > 0;
  },

  async updateResetToken(id, { resetTokenHash, resetTokenExpiresAt }) {
    const [result] = await db.query(
      `
      UPDATE admins
      SET reset_token_hash = ?, reset_token_expires_at = ?
      WHERE id = ?
      `,
      [resetTokenHash, resetTokenExpiresAt, id]
    );
    return result.affectedRows > 0;
  },

  async clearResetToken(id) {
    const [result] = await db.query(
      `
      UPDATE admins
      SET reset_token_hash = NULL, reset_token_expires_at = NULL
      WHERE id = ?
      `,
      [id]
    );
    return result.affectedRows > 0;
  },

  async updatePassword(id, passwordHash) {
    const [result] = await db.query(
      `
      UPDATE admins
      SET password = ?, reset_token_hash = NULL, reset_token_expires_at = NULL, otp_code_hash = NULL, otp_expires_at = NULL, otp_attempts = 0
      WHERE id = ?
      `,
      [passwordHash, id]
    );
    return result.affectedRows > 0;
  },

  async upsertAdminCredentials({ username, passwordHash, email }) {
    const [result] = await db.query(
      `
      INSERT INTO admins (username, password, email)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE password = VALUES(password), email = VALUES(email)
      `,
      [username, passwordHash, email]
    );
    return result.affectedRows > 0;
  }
};

module.exports = Admin;

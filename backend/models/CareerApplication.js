const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

const CareerApplication = {
  async create({ jobId, jobTitle, name, email, phone, coverLetter, resumeFileName }) {
    const id = uuidv4();
    await db.query(
      `
      INSERT INTO career_applications
      (id, job_id, job_title, name, email, phone, cover_letter, resume_file_name, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new')
      `,
      [id, jobId, jobTitle, name, email, phone, coverLetter || null, resumeFileName || null]
    );
    return id;
  },

  async findById(id) {
    const [rows] = await db.query(
      `
      SELECT id, job_id, job_title, name, email, phone, cover_letter, resume_file_name, status, status_updated_at, created_at
      FROM career_applications
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );
    return rows[0];
  },

  async findAll({ jobId, search, page = 1, limit = 20 }) {
    const where = [];
    const params = [];

    if (jobId) {
      where.push('job_id = ?');
      params.push(jobId);
    }

    if (search) {
      where.push('(name LIKE ? OR email LIKE ? OR phone LIKE ? OR job_title LIKE ?)');
      const likeValue = `%${search}%`;
      params.push(likeValue, likeValue, likeValue, likeValue);
    }

    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const parsedPage = Number(page) > 0 ? Number(page) : 1;
    const parsedLimit = Number(limit) > 0 ? Number(limit) : 20;
    const offset = (parsedPage - 1) * parsedLimit;

    const [rows] = await db.query(
      `
      SELECT id, job_id, job_title, name, email, phone, cover_letter, resume_file_name, created_at
      , status, status_updated_at
      FROM career_applications
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
      `,
      [...params, parsedLimit, offset]
    );

    const [countRows] = await db.query(
      `SELECT COUNT(*) as total FROM career_applications ${whereClause}`,
      params
    );

    return {
      applications: rows,
      total: countRows[0].total,
      page: parsedPage,
      totalPages: Math.ceil(countRows[0].total / parsedLimit)
    };
  },

  async updateStatus(id, status) {
    const [result] = await db.query(
      `
      UPDATE career_applications
      SET status = ?, status_updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [status, id]
    );
    return result.affectedRows > 0;
  }
};

module.exports = CareerApplication;

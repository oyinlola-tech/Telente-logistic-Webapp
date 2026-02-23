const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

const Job = {
  async findAll() {
    const [rows] = await db.query('SELECT * FROM jobs ORDER BY created_at DESC');
    return rows;
  },

  async findById(id) {
    const [rows] = await db.query('SELECT * FROM jobs WHERE id = ? LIMIT 1', [id]);
    return rows[0];
  },

  async create({ title, department, location, type, salary, description, requirements }) {
    const id = uuidv4();
    await db.query(
      `
      INSERT INTO jobs (id, title, department, location, type, salary, description, requirements)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [id, title, department, location, type, salary || null, description, JSON.stringify(requirements || [])]
    );
    return id;
  },

  async update(id, fields) {
    const entries = [];
    const values = [];

    Object.entries(fields).forEach(([key, value]) => {
      if (value !== undefined) {
        entries.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (!entries.length) return false;

    values.push(id);
    const [result] = await db.query(`UPDATE jobs SET ${entries.join(', ')} WHERE id = ?`, values);
    return result.affectedRows > 0;
  },

  async delete(id) {
    const [result] = await db.query('DELETE FROM jobs WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};

module.exports = Job;


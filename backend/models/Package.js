const db = require('../config/db');
const { v4: uuidv4 } = require('uuid'); // install: npm install uuid

function generateTrackingNumber() {
  const prefix = 'TL';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

const Package = {
  async create(data) {
    const id = uuidv4();
    const tracking_number = generateTrackingNumber();
    const { sender_name, sender_email, sender_phone, sender_address, recipient_name, recipient_email, recipient_phone,
            recipient_address, weight, dimensions, service, estimated_delivery, status = 'pending' } = data;
    await db.query(
      `INSERT INTO packages 
       (id, tracking_number, sender_name, sender_email, sender_phone, sender_address, recipient_name, 
        recipient_email, recipient_phone, recipient_address, weight, dimensions, service, status, estimated_delivery)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, tracking_number, sender_name, sender_email || null, sender_phone, sender_address, recipient_name,
       recipient_email || null, recipient_phone, recipient_address, weight, dimensions, service, status, estimated_delivery]
    );
    return { id, tracking_number };
  },

  async findAll({ status, page = 1, limit = 10 }) {
    let query = 'SELECT * FROM packages';
    const params = [];
    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    const offset = (page - 1) * limit;
    params.push(parseInt(limit), offset);

    const [rows] = await db.query(query, params);
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM packages';
    const countParams = [];
    if (status) {
      countQuery += ' WHERE status = ?';
      countParams.push(status);
    }
    const [totalRows] = await db.query(countQuery, countParams);
    const total = totalRows[0].total;

    return {
      packages: rows,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    };
  },

  async findByTrackingNumber(tracking_number) {
    const [rows] = await db.query('SELECT * FROM packages WHERE tracking_number = ?', [tracking_number]);
    return rows[0];
  },

  async findById(id) {
    const [rows] = await db.query('SELECT * FROM packages WHERE id = ?', [id]);
    return rows[0];
  },

  async update(id, data) {
    const fields = [];
    const values = [];
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }
    if (fields.length === 0) return false;
    values.push(id);
    const [result] = await db.query(`UPDATE packages SET ${fields.join(', ')} WHERE id = ?`, values);
    return result.affectedRows > 0;
  },

  async delete(id) {
    const [result] = await db.query('DELETE FROM packages WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  async addTrackingEvent({ package_id, location, status, description }) {
    const id = uuidv4();
    const timestamp = new Date();
    await db.query(
      'INSERT INTO tracking_events (id, package_id, timestamp, location, status, description) VALUES (?, ?, ?, ?, ?, ?)',
      [id, package_id, timestamp, location, status, description]
    );
    return id;
  },

  async getTrackingEvents(package_id) {
    const [rows] = await db.query('SELECT * FROM tracking_events WHERE package_id = ? ORDER BY timestamp DESC', [package_id]);
    return rows;
  }
};

module.exports = Package;

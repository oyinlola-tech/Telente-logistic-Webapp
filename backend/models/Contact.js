const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const Contact = {
  async create({ name, phone, service, message }) {
    const id = uuidv4();
    await db.query(
      'INSERT INTO contact_submissions (id, name, phone, service, message) VALUES (?, ?, ?, ?, ?)',
      [id, name, phone, service, message]
    );
    return id;
  }
};

module.exports = Contact;
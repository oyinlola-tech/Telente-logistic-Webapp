const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

const NewsletterSubscriber = {
  async findByEmail(email) {
    const [rows] = await db.query(
      'SELECT id, email, created_at FROM newsletter_subscribers WHERE email = ? LIMIT 1',
      [email]
    );
    return rows[0];
  },

  async create(email) {
    const id = uuidv4();
    await db.query('INSERT INTO newsletter_subscribers (id, email) VALUES (?, ?)', [id, email]);
    return id;
  }
};

module.exports = NewsletterSubscriber;


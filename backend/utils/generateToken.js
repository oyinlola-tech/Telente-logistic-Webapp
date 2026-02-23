const jwt = require('jsonwebtoken');

const generateToken = (admin) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT secret not configured');
  }
  return jwt.sign(
    { id: admin.id, username: admin.username },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

module.exports = generateToken;

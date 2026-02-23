const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: { message: 'No token provided', code: 'UNAUTHORIZED' } });
  }

  const token = authHeader.split(' ')[1];
  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ success: false, error: { message: 'JWT not configured', code: 'SERVER_ERROR' } });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; // { id, username }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: { message: 'Invalid or expired token', code: 'UNAUTHORIZED' } });
  }
};

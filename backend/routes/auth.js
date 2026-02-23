const express = require('express');
const rateLimit = require('express-rate-limit');
const { login, getMe } = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { message: 'Too many login attempts. Try again later.', code: 'RATE_LIMITED' }
  }
});

router.post('/login', loginLimiter, login);
router.get('/me', auth, getMe);

module.exports = router;

const express = require('express');
const rateLimit = require('express-rate-limit');
const {
  login,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
  changePassword,
  getMe
} = require('../controllers/authController');
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
router.post(
  '/forgot-password',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: { message: 'Too many reset requests. Try again later.', code: 'RATE_LIMITED' }
    }
  }),
  forgotPassword
);
router.post(
  '/reset-password',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: { message: 'Too many reset attempts. Try again later.', code: 'RATE_LIMITED' }
    }
  }),
  resetPassword
);
router.post(
  '/verify-otp',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: { message: 'Too many OTP attempts. Try again later.', code: 'RATE_LIMITED' }
    }
  }),
  verifyOtp
);
router.post(
  '/resend-otp',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: { message: 'Too many OTP resend requests. Try again later.', code: 'RATE_LIMITED' }
    }
  }),
  resendOtp
);
router.get('/me', auth, getMe);
router.post('/change-password', auth, changePassword);

module.exports = router;

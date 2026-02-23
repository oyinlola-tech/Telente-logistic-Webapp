const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');
const { sendEmail } = require('../utils/mailer');
const { adminOtpTemplate } = require('../utils/emailTemplates');
const { sanitizeText, sanitizeOtp } = require('../utils/security');

const OTP_LENGTH = 6;
const OTP_EXPIRES_MINUTES = Number(process.env.ADMIN_OTP_EXPIRES_MINUTES || 10);
const OTP_RESEND_SECONDS = Number(process.env.ADMIN_OTP_RESEND_SECONDS || 60);
const OTP_MAX_ATTEMPTS = Number(process.env.ADMIN_OTP_MAX_ATTEMPTS || 5);

function generateOtpCode() {
  const min = 10 ** (OTP_LENGTH - 1);
  const max = 10 ** OTP_LENGTH - 1;
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
}

function hashOtp(otp) {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

function ensureJwtSecret() {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT secret not configured');
  }
}

function createOtpChallengeToken(adminId, username) {
  ensureJwtSecret();
  return jwt.sign(
    { purpose: 'admin_otp', adminId, username },
    process.env.JWT_SECRET,
    { expiresIn: `${OTP_EXPIRES_MINUTES}m` }
  );
}

function verifyOtpChallengeToken(challengeToken) {
  ensureJwtSecret();
  return jwt.verify(challengeToken, process.env.JWT_SECRET);
}

async function issueOtp(admin) {
  const otp = generateOtpCode();
  const otpCodeHash = hashOtp(otp);
  const otpExpiresAt = new Date(Date.now() + OTP_EXPIRES_MINUTES * 60 * 1000);
  const otpLastSentAt = new Date();

  await Admin.updateOtpState(admin.id, {
    otpCodeHash,
    otpExpiresAt,
    otpAttempts: 0,
    otpLastSentAt
  });

  const to = admin.email || process.env.ADMIN_EMAIL || process.env.SMTP_USER || '';
  const html = adminOtpTemplate({
    username: admin.username,
    otp,
    expiresInMinutes: OTP_EXPIRES_MINUTES
  });

  if (to) {
    await sendEmail({
      to,
      subject: 'Your Telente Logistics admin OTP code',
      html,
      text: `Your admin OTP code is ${otp}. It expires in ${OTP_EXPIRES_MINUTES} minutes.`
    });
  } else {
    console.warn(`Admin OTP generated for ${admin.username}: ${otp}`);
  }

  return {
    otp,
    expiresAt: otpExpiresAt.toISOString()
  };
}

// @desc    Admin login (step 1: verify username/password and send OTP)
// @route   POST /api/auth/login
const login = async (req, res) => {
  const username = sanitizeText(req.body?.username, 80);
  const password = req.body?.password ? String(req.body.password) : '';

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      error: { message: 'Username and password required', code: 'BAD_REQUEST' }
    });
  }

  try {
    const admin = await Admin.findByUsername(username);
    if (!admin) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid credentials', code: 'UNAUTHORIZED' }
      });
    }

    const isMatch = await Admin.comparePassword(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid credentials', code: 'UNAUTHORIZED' }
      });
    }

    const otpResult = await issueOtp(admin);
    const challengeToken = createOtpChallengeToken(admin.id, admin.username);
    const response = {
      success: true,
      data: {
        otpRequired: true,
        challengeToken,
        expiresAt: otpResult.expiresAt
      }
    };

    if (String(process.env.NODE_ENV).toLowerCase() !== 'production') {
      response.data.devOtp = otpResult.otp;
    }

    return res.json(response);
  } catch (err) {
    console.error('Auth login error:', err);
    return res.status(500).json({
      success: false,
      error: { message: 'Server error', code: 'SERVER_ERROR' }
    });
  }
};

// @desc    Admin OTP verification (step 2)
// @route   POST /api/auth/verify-otp
const verifyOtp = async (req, res) => {
  const challengeToken = sanitizeText(req.body?.challengeToken, 1200);
  const otp = sanitizeOtp(req.body?.otp);

  if (!challengeToken || !otp) {
    return res.status(400).json({
      success: false,
      error: { message: 'Challenge token and valid OTP are required', code: 'BAD_REQUEST' }
    });
  }

  try {
    const decoded = verifyOtpChallengeToken(challengeToken);
    if (decoded?.purpose !== 'admin_otp' || !decoded?.adminId) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid OTP session', code: 'UNAUTHORIZED' }
      });
    }

    const admin = await Admin.findById(decoded.adminId);
    if (!admin || !admin.otp_code_hash || !admin.otp_expires_at) {
      return res.status(401).json({
        success: false,
        error: { message: 'OTP challenge is not active', code: 'UNAUTHORIZED' }
      });
    }

    if (admin.otp_attempts >= OTP_MAX_ATTEMPTS) {
      await Admin.clearOtp(admin.id);
      return res.status(429).json({
        success: false,
        error: { message: 'Too many OTP attempts. Please login again.', code: 'RATE_LIMITED' }
      });
    }

    if (new Date(admin.otp_expires_at).getTime() < Date.now()) {
      await Admin.clearOtp(admin.id);
      return res.status(401).json({
        success: false,
        error: { message: 'OTP has expired. Please login again.', code: 'UNAUTHORIZED' }
      });
    }

    const isValidOtp = hashOtp(otp) === admin.otp_code_hash;
    if (!isValidOtp) {
      await Admin.incrementOtpAttempts(admin.id);
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid OTP', code: 'UNAUTHORIZED' }
      });
    }

    await Admin.clearOtp(admin.id);
    const token = generateToken(admin);

    return res.json({
      success: true,
      data: {
        id: admin.id,
        username: admin.username,
        token
      }
    });
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: { message: 'OTP session expired. Please login again.', code: 'UNAUTHORIZED' }
      });
    }
    console.error('Auth OTP verify error:', err);
    return res.status(500).json({
      success: false,
      error: { message: 'Server error', code: 'SERVER_ERROR' }
    });
  }
};

// @desc    Resend admin OTP
// @route   POST /api/auth/resend-otp
const resendOtp = async (req, res) => {
  const challengeToken = sanitizeText(req.body?.challengeToken, 1200);
  if (!challengeToken) {
    return res.status(400).json({
      success: false,
      error: { message: 'Challenge token is required', code: 'BAD_REQUEST' }
    });
  }

  try {
    const decoded = verifyOtpChallengeToken(challengeToken);
    if (decoded?.purpose !== 'admin_otp' || !decoded?.adminId) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid OTP session', code: 'UNAUTHORIZED' }
      });
    }

    const admin = await Admin.findById(decoded.adminId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        error: { message: 'Admin not found', code: 'NOT_FOUND' }
      });
    }

    if (admin.otp_last_sent_at) {
      const elapsedSeconds = Math.floor((Date.now() - new Date(admin.otp_last_sent_at).getTime()) / 1000);
      if (elapsedSeconds < OTP_RESEND_SECONDS) {
        return res.status(429).json({
          success: false,
          error: {
            message: `Please wait ${OTP_RESEND_SECONDS - elapsedSeconds}s before requesting another OTP`,
            code: 'RATE_LIMITED'
          }
        });
      }
    }

    const otpResult = await issueOtp(admin);
    const response = {
      success: true,
      data: { expiresAt: otpResult.expiresAt }
    };

    if (String(process.env.NODE_ENV).toLowerCase() !== 'production') {
      response.data.devOtp = otpResult.otp;
    }

    return res.json(response);
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: { message: 'OTP session expired. Please login again.', code: 'UNAUTHORIZED' }
      });
    }
    console.error('Auth resend OTP error:', err);
    return res.status(500).json({
      success: false,
      error: { message: 'Server error', code: 'SERVER_ERROR' }
    });
  }
};

// @desc    Verify token and get admin info
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const admin = await Admin.findByUsername(req.admin.username);
    if (!admin) {
      return res.status(404).json({
        success: false,
        error: { message: 'Admin not found', code: 'NOT_FOUND' }
      });
    }

    return res.json({
      success: true,
      data: {
        id: admin.id,
        username: admin.username
      }
    });
  } catch (err) {
    console.error('Auth me error:', err);
    return res.status(500).json({
      success: false,
      error: { message: 'Server error', code: 'SERVER_ERROR' }
    });
  }
};

module.exports = { login, verifyOtp, resendOtp, getMe };

const MAX_STRING_LENGTH = 10000;
const BLOCKED_KEYS = new Set(['__proto__', 'prototype', 'constructor']);

function hasBlockedKeys(value) {
  if (!value || typeof value !== 'object') return false;
  if (Array.isArray(value)) {
    return value.some((item) => hasBlockedKeys(item));
  }

  for (const [key, nestedValue] of Object.entries(value)) {
    if (BLOCKED_KEYS.has(key)) return true;
    if (typeof nestedValue === 'string' && (nestedValue.includes('\u0000') || nestedValue.length > MAX_STRING_LENGTH)) {
      return true;
    }
    if (hasBlockedKeys(nestedValue)) return true;
  }

  return false;
}

function requestSecurity(req, res, next) {
  if (hasBlockedKeys(req.body) || hasBlockedKeys(req.query) || hasBlockedKeys(req.params)) {
    return res.status(400).json({
      success: false,
      error: { message: 'Suspicious request payload rejected', code: 'BAD_REQUEST' }
    });
  }
  return next();
}

module.exports = requestSecurity;

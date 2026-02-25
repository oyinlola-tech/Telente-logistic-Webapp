const APPLICATION_STATUSES = ['new', 'reviewed', 'shortlisted', 'rejected'];
const PACKAGE_STATUSES = ['pending', 'in_transit', 'out_for_delivery', 'delayed', 'delivered', 'cancelled'];

function sanitizeText(value, maxLen = 255) {
  if (value === undefined || value === null) return '';
  return String(value)
    .replace(/[<>`]/g, '')
    .trim()
    .slice(0, maxLen);
}

function sanitizeMultiline(value, maxLen = 5000) {
  if (value === undefined || value === null) return '';
  return String(value)
    .replace(/[<>`]/g, '')
    .replace(/\r\n/g, '\n')
    .trim()
    .slice(0, maxLen);
}

function sanitizeEmail(value) {
  const cleaned = sanitizeText(value, 255).toLowerCase();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(cleaned) ? cleaned : '';
}

function sanitizePhone(value) {
  const cleaned = sanitizeText(value, 50).replace(/[^\d+\-()\s]/g, '');
  const digitsOnly = cleaned.replace(/\D/g, '');
  if (digitsOnly.length < 7 || digitsOnly.length > 15) return '';
  return cleaned;
}

function sanitizeFilename(value) {
  const cleaned = sanitizeText(value, 255).replace(/[\\/:*?"<>|]/g, '_');
  const hasTraversal = cleaned.includes('..');
  const allowedExt = /\.(pdf|doc|docx)$/i.test(cleaned);
  if (!cleaned || hasTraversal || !allowedExt) return '';
  return cleaned;
}

function sanitizeStatus(value, allowedStatuses) {
  const cleaned = sanitizeText(value, 60).toLowerCase();
  return allowedStatuses.includes(cleaned) ? cleaned : '';
}

function sanitizeRequirements(input) {
  if (!Array.isArray(input)) return [];
  return input.map((item) => sanitizeText(item, 300)).filter(Boolean).slice(0, 30);
}

function escapeCsv(value) {
  const raw = value === undefined || value === null ? '' : String(value);
  const escaped = raw.replace(/"/g, '""');
  return `"${escaped}"`;
}

function sanitizeOtp(value) {
  const cleaned = sanitizeText(value, 6).replace(/\D/g, '');
  return /^\d{6}$/.test(cleaned) ? cleaned : '';
}

module.exports = {
  APPLICATION_STATUSES,
  PACKAGE_STATUSES,
  sanitizeText,
  sanitizeMultiline,
  sanitizeEmail,
  sanitizePhone,
  sanitizeFilename,
  sanitizeStatus,
  sanitizeRequirements,
  sanitizeOtp,
  escapeCsv
};

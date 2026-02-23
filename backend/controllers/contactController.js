const Contact = require('../models/Contact');
const { sanitizeText, sanitizeMultiline, sanitizePhone } = require('../utils/security');
const { services } = require('../data/content');

const allowedServices = new Set([...services.map((item) => item.id), 'other']);

const submitContact = async (req, res) => {
  const name = sanitizeText(req.body?.name, 255);
  const phone = sanitizePhone(req.body?.phone);
  const service = sanitizeText(req.body?.service, 100);
  const message = sanitizeMultiline(req.body?.message, 1000);
  if (!name || !phone || !service) {
    return res.status(400).json({
      success: false,
      error: { message: 'Name, phone, and service are required', code: 'BAD_REQUEST' }
    });
  }
  if (!allowedServices.has(service)) {
    return res.status(400).json({
      success: false,
      error: { message: 'Invalid service selected', code: 'BAD_REQUEST' }
    });
  }

  try {
    const id = await Contact.create({ name, phone, service, message });
    res.status(201).json({
      success: true,
      data: { id, message: 'Contact submitted successfully' }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: { message: 'Server error', code: 'SERVER_ERROR' }
    });
  }
};

module.exports = { submitContact };

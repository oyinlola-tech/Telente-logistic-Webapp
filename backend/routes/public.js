const express = require('express');
const Package = require('../models/Package');
const { submitContact } = require('../controllers/contactController');

const router = express.Router();

const mapPackageToResponse = (pkg, trackingHistory = []) => ({
  id: pkg.id,
  trackingNumber: pkg.tracking_number,
  senderName: pkg.sender_name,
  senderPhone: pkg.sender_phone,
  senderAddress: pkg.sender_address,
  recipientName: pkg.recipient_name,
  recipientPhone: pkg.recipient_phone,
  recipientAddress: pkg.recipient_address,
  weight: Number(pkg.weight),
  dimensions: pkg.dimensions,
  service: pkg.service,
  status: pkg.status,
  currentLocation: pkg.current_location || '',
  estimatedDelivery: pkg.estimated_delivery,
  createdAt: pkg.created_at,
  updatedAt: pkg.updated_at,
  trackingHistory: trackingHistory.map((event) => ({
    id: event.id,
    timestamp: event.timestamp,
    location: event.location,
    status: event.status,
    description: event.description || ''
  }))
});

// Tracking - public
router.get('/packages/track/:trackingNumber', async (req, res) => {
  const { trackingNumber } = req.params;
  try {
    const pkg = await Package.findByTrackingNumber(trackingNumber);
    if (!pkg) {
      return res.status(404).json({ success: false, error: { message: 'Tracking number not found', code: 'NOT_FOUND' } });
    }
    const trackingHistory = await Package.getTrackingEvents(pkg.id);
    res.json({
      success: true,
      data: mapPackageToResponse(pkg, trackingHistory)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: { message: 'Server error', code: 'SERVER_ERROR' } });
  }
});

// Contact form - public
router.post('/contact', submitContact);

module.exports = router;

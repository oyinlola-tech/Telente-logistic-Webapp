const express = require('express');
const rateLimit = require('express-rate-limit');
const Package = require('../models/Package');
const { submitContact } = require('../controllers/contactController');
const { sanitizeText } = require('../utils/security');

const router = express.Router();
const geocodeCache = new Map();
let lastNominatimRequestAt = 0;

const trackingLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false
});

const geocodeLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false
});

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { message: 'Too many contact requests. Please try again later.', code: 'RATE_LIMITED' }
  }
});

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

const delay = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

async function geocodeWithNominatim(query) {
  const minIntervalMs = 1100;
  const now = Date.now();
  const waitFor = Math.max(0, minIntervalMs - (now - lastNominatimRequestAt));
  if (waitFor > 0) {
    await delay(waitFor);
  }
  lastNominatimRequestAt = Date.now();

  const endpoint = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
  const response = await fetch(endpoint, {
    headers: {
      'User-Agent': 'TelenteLogistics/1.0 (tracking geocode proxy)',
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    return null;
  }

  const results = await response.json();
  const first = Array.isArray(results) ? results[0] : null;
  if (!first?.lat || !first?.lon) {
    return null;
  }

  return {
    lat: Number(first.lat),
    lng: Number(first.lon),
    displayName: first.display_name || query
  };
}

async function geocodeWithPhoton(query) {
  const endpoint = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=1`;
  const response = await fetch(endpoint, {
    headers: {
      'User-Agent': 'TelenteLogistics/1.0 (tracking geocode proxy)',
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    return null;
  }

  const result = await response.json();
  const first = Array.isArray(result?.features) ? result.features[0] : null;
  const coordinates = first?.geometry?.coordinates;
  if (!Array.isArray(coordinates) || coordinates.length < 2) {
    return null;
  }

  const [lng, lat] = coordinates;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  const labelParts = [
    first?.properties?.name,
    first?.properties?.city,
    first?.properties?.country
  ].filter(Boolean);

  return {
    lat: Number(lat),
    lng: Number(lng),
    displayName: labelParts.join(', ') || query
  };
}

router.get('/geocode', geocodeLimiter, async (req, res) => {
  const query = sanitizeText(req.query.query, 200);
  if (!query) {
    return res.status(400).json({
      success: false,
      error: { message: 'Query is required', code: 'BAD_REQUEST' }
    });
  }

  const cacheKey = query.toLowerCase();
  if (geocodeCache.has(cacheKey)) {
    return res.json({
      success: true,
      data: geocodeCache.get(cacheKey)
    });
  }

  try {
    let geocode = await geocodeWithNominatim(query);
    if (!geocode) {
      geocode = await geocodeWithPhoton(query);
    }

    geocodeCache.set(cacheKey, geocode || null);

    return res.json({ success: true, data: geocode || null });
  } catch (error) {
    console.error('Geocode proxy error:', error);
    return res.status(500).json({
      success: false,
      error: { message: 'Could not geocode location', code: 'SERVER_ERROR' }
    });
  }
});

// Tracking - public
router.get('/packages/track/:trackingNumber', trackingLimiter, async (req, res) => {
  const trackingNumber = sanitizeText(req.params.trackingNumber, 50).toUpperCase();
  if (!trackingNumber) {
    return res.status(400).json({
      success: false,
      error: { message: 'Tracking number is required', code: 'BAD_REQUEST' }
    });
  }
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
router.post('/contact', contactLimiter, submitContact);

module.exports = router;

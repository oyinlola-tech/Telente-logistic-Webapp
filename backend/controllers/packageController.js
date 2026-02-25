const Package = require('../models/Package');
const { sendEmail } = require('../utils/mailer');
const { packageStatusTemplate } = require('../utils/emailTemplates');
const {
  PACKAGE_STATUSES,
  sanitizeText,
  sanitizeMultiline,
  sanitizeEmail,
  sanitizePhone,
  sanitizeStatus
} = require('../utils/security');

const mapPackageToResponse = (pkg, trackingHistory = []) => ({
  id: pkg.id,
  trackingNumber: pkg.tracking_number,
  senderName: pkg.sender_name,
  senderEmail: pkg.sender_email || '',
  senderPhone: pkg.sender_phone,
  senderAddress: pkg.sender_address,
  recipientName: pkg.recipient_name,
  recipientEmail: pkg.recipient_email || '',
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

const mapCreatePayload = (body) => ({
  sender_name: sanitizeText(body.sender_name || body.senderName, 255),
  sender_email: sanitizeEmail(body.sender_email || body.senderEmail),
  sender_phone: sanitizePhone(body.sender_phone || body.senderPhone),
  sender_address: sanitizeMultiline(body.sender_address || body.senderAddress, 500),
  recipient_name: sanitizeText(body.recipient_name || body.recipientName, 255),
  recipient_email: sanitizeEmail(body.recipient_email || body.recipientEmail),
  recipient_phone: sanitizePhone(body.recipient_phone || body.recipientPhone),
  recipient_address: sanitizeMultiline(body.recipient_address || body.recipientAddress, 500),
  weight: Number(body.weight),
  dimensions: sanitizeText(body.dimensions, 50),
  service: sanitizeText(body.service, 50),
  estimated_delivery: sanitizeText(body.estimated_delivery || body.estimatedDelivery, 30),
  status: sanitizeStatus(body.status || 'pending', PACKAGE_STATUSES) || 'pending'
});

const mapUpdatePayload = (body) => ({
  sender_name: body.sender_name !== undefined || body.senderName !== undefined
    ? sanitizeText(body.sender_name || body.senderName, 255) : undefined,
  sender_email: body.sender_email !== undefined || body.senderEmail !== undefined
    ? sanitizeEmail(body.sender_email || body.senderEmail) : undefined,
  sender_phone: body.sender_phone !== undefined || body.senderPhone !== undefined
    ? sanitizePhone(body.sender_phone || body.senderPhone) : undefined,
  sender_address: body.sender_address !== undefined || body.senderAddress !== undefined
    ? sanitizeMultiline(body.sender_address || body.senderAddress, 500) : undefined,
  recipient_name: body.recipient_name !== undefined || body.recipientName !== undefined
    ? sanitizeText(body.recipient_name || body.recipientName, 255) : undefined,
  recipient_email: body.recipient_email !== undefined || body.recipientEmail !== undefined
    ? sanitizeEmail(body.recipient_email || body.recipientEmail) : undefined,
  recipient_phone: body.recipient_phone !== undefined || body.recipientPhone !== undefined
    ? sanitizePhone(body.recipient_phone || body.recipientPhone) : undefined,
  recipient_address: body.recipient_address !== undefined || body.recipientAddress !== undefined
    ? sanitizeMultiline(body.recipient_address || body.recipientAddress, 500) : undefined,
  weight: body.weight !== undefined ? Number(body.weight) : undefined,
  dimensions: body.dimensions !== undefined ? sanitizeText(body.dimensions, 50) : undefined,
  service: body.service !== undefined ? sanitizeText(body.service, 50) : undefined,
  status: body.status !== undefined ? sanitizeStatus(body.status, PACKAGE_STATUSES) : undefined,
  current_location: body.current_location !== undefined || body.currentLocation !== undefined
    ? sanitizeText(body.current_location || body.currentLocation, 255) : undefined,
  estimated_delivery: body.estimated_delivery !== undefined || body.estimatedDelivery !== undefined
    ? sanitizeText(body.estimated_delivery || body.estimatedDelivery, 30) : undefined
});

async function notifyStatusIfNeeded(previousStatus, pkg, statusReason = '') {
  if (!pkg || !pkg.status || previousStatus === pkg.status) return;

  const recipients = [pkg.recipient_email, pkg.sender_email].filter(Boolean);
  if (!recipients.length) return;

  const subject = `Package ${pkg.tracking_number}: status ${pkg.status.replace(/_/g, ' ')}`;
  const html = packageStatusTemplate({
    recipientName: pkg.recipient_name,
    trackingNumber: pkg.tracking_number,
    status: pkg.status,
    location: pkg.current_location || '',
    estimatedDelivery: pkg.estimated_delivery,
    statusReason
  });

  for (const recipient of recipients) {
    await sendEmail({
      to: recipient,
      subject,
      html,
      text: `Your package ${pkg.tracking_number} status is now ${pkg.status}.${statusReason ? ` Reason: ${statusReason}` : ''}`
    });
  }
}

const getAllPackages = async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const parsedPage = Number(page) > 0 ? Number(page) : 1;
  const parsedLimit = Number(limit) > 0 && Number(limit) <= 100 ? Number(limit) : 10;
  try {
    const result = await Package.findAll({ status, page: parsedPage, limit: parsedLimit });
    const mappedPackages = result.packages.map((pkg) => mapPackageToResponse(pkg, []));
    res.json({
      success: true,
      data: {
        packages: mappedPackages,
        total: result.total,
        page: result.page,
        totalPages: result.totalPages
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: { message: 'Server error', code: 'SERVER_ERROR' } });
  }
};

const getPackageById = async (req, res) => {
  const id = sanitizeText(req.params.id, 120);
  try {
    const pkg = await Package.findById(id);
    if (!pkg) {
      return res.status(404).json({ success: false, error: { message: 'Package not found', code: 'NOT_FOUND' } });
    }
    const trackingHistory = await Package.getTrackingEvents(pkg.id);
    res.json({ success: true, data: mapPackageToResponse(pkg, trackingHistory) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: { message: 'Server error', code: 'SERVER_ERROR' } });
  }
};

const createPackage = async (req, res) => {
  const payload = mapCreatePayload(req.body || {});
  const { sender_name, sender_phone, sender_address, recipient_name, recipient_phone,
    recipient_address, weight, dimensions, service, estimated_delivery } = payload;

  if (!sender_name || !sender_phone || !sender_address || !recipient_name || !recipient_phone ||
    !recipient_address || Number.isNaN(weight) || !dimensions || !service || !estimated_delivery) {
    return res.status(400).json({ success: false, error: { message: 'Missing required fields', code: 'BAD_REQUEST' } });
  }

  try {
    const result = await Package.create(payload);
    const createdPkg = await Package.findById(result.id);
    const trackingHistory = await Package.getTrackingEvents(result.id);
    await notifyStatusIfNeeded('pending', createdPkg);
    res.status(201).json({ success: true, data: mapPackageToResponse(createdPkg, trackingHistory) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: { message: 'Server error', code: 'SERVER_ERROR' } });
  }
};

const updatePackage = async (req, res) => {
  const id = sanitizeText(req.params.id, 120);
  try {
    const existing = await Package.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, error: { message: 'Package not found', code: 'NOT_FOUND' } });
    }

    const payload = mapUpdatePayload(req.body || {});
    if (Object.values(payload).every((value) => value === undefined)) {
      return res.status(400).json({
        success: false,
        error: { message: 'No valid fields provided for update', code: 'BAD_REQUEST' }
      });
    }
    const updated = await Package.update(id, payload);
    if (!updated) {
      return res.status(400).json({
        success: false,
        error: { message: 'Package update failed', code: 'BAD_REQUEST' }
      });
    }

    let statusReason = '';
    const nextStatus = payload.status;
    if (nextStatus && nextStatus !== existing.status) {
      const eventLocation = payload.current_location
        || existing.current_location
        || existing.recipient_address
        || existing.sender_address
        || 'Location update pending';
      const eventDescription = sanitizeMultiline(
        req.body?.status_description || req.body?.statusDescription,
        1000
      ) || `Status changed to ${nextStatus.replace(/_/g, ' ')}`;
      statusReason = eventDescription;

      await Package.addTrackingEvent({
        package_id: id,
        location: eventLocation,
        status: nextStatus,
        description: eventDescription
      });
    }

    const pkg = await Package.findById(id);
    const trackingHistory = await Package.getTrackingEvents(id);
    await notifyStatusIfNeeded(existing.status, pkg, statusReason);
    res.json({ success: true, data: mapPackageToResponse(pkg, trackingHistory) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: { message: 'Server error', code: 'SERVER_ERROR' } });
  }
};

const deletePackage = async (req, res) => {
  const id = sanitizeText(req.params.id, 120);
  try {
    const deleted = await Package.delete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: { message: 'Package not found', code: 'NOT_FOUND' } });
    }
    res.json({ success: true, data: { message: 'Package deleted' } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: { message: 'Server error', code: 'SERVER_ERROR' } });
  }
};

const addTrackingEvent = async (req, res) => {
  const id = sanitizeText(req.params.id, 120);
  const location = sanitizeText(req.body?.location, 255);
  const status = sanitizeStatus(req.body?.status, PACKAGE_STATUSES);
  const description = sanitizeMultiline(req.body?.description, 1000);

  if (!location || !status) {
    return res.status(400).json({ success: false, error: { message: 'Location and valid status required', code: 'BAD_REQUEST' } });
  }

  try {
    const pkg = await Package.findById(id);
    if (!pkg) {
      return res.status(404).json({ success: false, error: { message: 'Package not found', code: 'NOT_FOUND' } });
    }

    await Package.addTrackingEvent({ package_id: id, location, status, description });
    await Package.update(id, { current_location: location, status });
    const updatedPackage = await Package.findById(id);
    const trackingHistory = await Package.getTrackingEvents(id);
    await notifyStatusIfNeeded(pkg.status, updatedPackage, description);
    res.status(201).json({ success: true, data: mapPackageToResponse(updatedPackage, trackingHistory) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: { message: 'Server error', code: 'SERVER_ERROR' } });
  }
};

module.exports = {
  getAllPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
  addTrackingEvent
};

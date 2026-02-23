const express = require('express');
const {
  getAllPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
  addTrackingEvent
} = require('../controllers/packageController');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes below require authentication (admin)
router.use(auth);

router.get('/', getAllPackages);
router.get('/:id', getPackageById);
router.post('/', createPackage);
router.put('/:id', updatePackage);
router.delete('/:id', deletePackage);
router.post('/:id/tracking', addTrackingEvent);

module.exports = router;
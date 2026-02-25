const express = require('express');
const rateLimit = require('express-rate-limit');
const {
  getServices,
  getServiceById,
  getNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  getJobs,
  createJob,
  updateJob,
  deleteJob,
  applyToJob,
  getCareerApplications,
  updateCareerApplicationStatus,
  exportCareerApplicationsCsv,
  subscribeToNewsletter
} = require('../controllers/contentController');
const auth = require('../middleware/auth');

const router = express.Router();
const applyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { message: 'Too many applications submitted. Please try later.', code: 'RATE_LIMITED' }
  }
});

const newsletterLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { message: 'Too many subscription attempts. Please try later.', code: 'RATE_LIMITED' }
  }
});

router.get('/services', getServices);
router.get('/services/:id', getServiceById);

router.get('/news', getNews);
router.get('/news/:id', getNewsById);
router.post('/admin/news', auth, createNews);
router.put('/admin/news/:id', auth, updateNews);
router.delete('/admin/news/:id', auth, deleteNews);

router.get('/careers', getJobs);
router.post('/careers/:id/apply', applyLimiter, applyToJob);

router.post('/admin/jobs', auth, createJob);
router.put('/admin/jobs/:id', auth, updateJob);
router.delete('/admin/jobs/:id', auth, deleteJob);
router.get('/admin/applications', auth, getCareerApplications);
router.patch('/admin/applications/:id/status', auth, updateCareerApplicationStatus);
router.get('/admin/applications/export.csv', auth, exportCareerApplicationsCsv);

router.post('/newsletter/subscribe', newsletterLimiter, subscribeToNewsletter);

module.exports = router;

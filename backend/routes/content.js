const express = require('express');
const {
  getServices,
  getServiceById,
  getNews,
  getNewsById,
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

router.get('/services', getServices);
router.get('/services/:id', getServiceById);

router.get('/news', getNews);
router.get('/news/:id', getNewsById);

router.get('/careers', getJobs);
router.post('/careers/:id/apply', applyToJob);

router.post('/admin/jobs', auth, createJob);
router.put('/admin/jobs/:id', auth, updateJob);
router.delete('/admin/jobs/:id', auth, deleteJob);
router.get('/admin/applications', auth, getCareerApplications);
router.patch('/admin/applications/:id/status', auth, updateCareerApplicationStatus);
router.get('/admin/applications/export.csv', auth, exportCareerApplicationsCsv);

router.post('/newsletter/subscribe', subscribeToNewsletter);

module.exports = router;

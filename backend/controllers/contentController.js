const { services, news } = require('../data/content');
const CareerApplication = require('../models/CareerApplication');
const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const Job = require('../models/Job');
const crypto = require('crypto');
const { sendEmail } = require('../utils/mailer');
const {
  applicationReceivedTemplate,
  applicationStatusTemplate,
  newsletterSubscribedTemplate
} = require('../utils/emailTemplates');
const {
  APPLICATION_STATUSES,
  sanitizeText,
  sanitizeMultiline,
  sanitizeEmail,
  sanitizePhone,
  sanitizeFilename,
  sanitizeStatus,
  sanitizeRequirements,
  escapeCsv
} = require('../utils/security');

const parseRequirements = (requirementsValue) => {
  if (Array.isArray(requirementsValue)) return requirementsValue;
  if (typeof requirementsValue === 'string') {
    try {
      return JSON.parse(requirementsValue || '[]');
    } catch (error) {
      return [];
    }
  }
  return [];
};

const mapJob = (job) => ({
  id: job.id,
  title: job.title,
  department: job.department,
  location: job.location,
  type: job.type,
  salary: job.salary || '',
  description: job.description,
  requirements: parseRequirements(job.requirements),
  postedAt: job.created_at
});

const mapApplication = (item) => ({
  id: item.id,
  jobId: item.job_id,
  jobTitle: item.job_title,
  name: item.name,
  email: item.email,
  phone: item.phone,
  coverLetter: item.cover_letter || '',
  resumeFileName: item.resume_file_name || '',
  status: item.status || 'new',
  statusUpdatedAt: item.status_updated_at,
  submittedAt: item.created_at
});

const mapNewsArticle = (item) => ({
  id: item.id,
  title: item.title,
  excerpt: item.excerpt,
  content: item.content,
  image: item.image,
  author: item.author,
  publishedAt: item.publishedAt
});

const sortNewsByDateDesc = (items) =>
  [...items].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

const normalizePublishedAt = (value) => {
  const candidate = sanitizeText(value, 60);
  const parsed = candidate ? new Date(candidate) : new Date();
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toISOString();
};

const mapNewsCreatePayload = (body) => ({
  title: sanitizeText(body?.title, 255),
  excerpt: sanitizeText(body?.excerpt, 500),
  content: sanitizeMultiline(body?.content, 12000),
  image: sanitizeText(body?.image, 500),
  author: sanitizeText(body?.author, 120),
  publishedAt: normalizePublishedAt(body?.publishedAt)
});

const mapNewsUpdatePayload = (body) => ({
  title: body?.title !== undefined ? sanitizeText(body?.title, 255) : undefined,
  excerpt: body?.excerpt !== undefined ? sanitizeText(body?.excerpt, 500) : undefined,
  content: body?.content !== undefined ? sanitizeMultiline(body?.content, 12000) : undefined,
  image: body?.image !== undefined ? sanitizeText(body?.image, 500) : undefined,
  author: body?.author !== undefined ? sanitizeText(body?.author, 120) : undefined,
  publishedAt: body?.publishedAt !== undefined ? normalizePublishedAt(body?.publishedAt) : undefined
});

const getServices = async (req, res) => {
  res.json({ success: true, data: services });
};

const getServiceById = async (req, res) => {
  const service = services.find((item) => item.id === req.params.id);
  if (!service) {
    return res.status(404).json({
      success: false,
      error: { message: 'Service not found', code: 'NOT_FOUND' }
    });
  }
  res.json({ success: true, data: service });
};

const getNews = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const parsedPage = Number(page) > 0 ? Number(page) : 1;
  const parsedLimit = Number(limit) > 0 && Number(limit) <= 50 ? Number(limit) : 10;
  const start = (parsedPage - 1) * parsedLimit;
  const sortedNews = sortNewsByDateDesc(news);
  const paginated = sortedNews.slice(start, start + parsedLimit);

  res.json({
    success: true,
    data: {
      articles: paginated.map(mapNewsArticle),
      total: sortedNews.length,
      page: parsedPage,
      totalPages: Math.ceil(sortedNews.length / parsedLimit)
    }
  });
};

const getNewsById = async (req, res) => {
  const article = news.find((item) => item.id === req.params.id);
  if (!article) {
    return res.status(404).json({
      success: false,
      error: { message: 'Article not found', code: 'NOT_FOUND' }
    });
  }
  res.json({ success: true, data: mapNewsArticle(article) });
};

const createNews = async (req, res) => {
  const payload = mapNewsCreatePayload(req.body || {});
  if (!payload.title || !payload.excerpt || !payload.content || !payload.image || !payload.author || !payload.publishedAt) {
    return res.status(400).json({
      success: false,
      error: { message: 'title, excerpt, content, image, author, and valid publishedAt are required', code: 'BAD_REQUEST' }
    });
  }

  const id = crypto.randomUUID ? crypto.randomUUID() : `news-${Date.now()}`;
  const article = { id, ...payload };
  news.unshift(article);
  return res.status(201).json({ success: true, data: mapNewsArticle(article) });
};

const updateNews = async (req, res) => {
  const id = sanitizeText(req.params.id, 120);
  const index = news.findIndex((item) => item.id === id);
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: { message: 'Article not found', code: 'NOT_FOUND' }
    });
  }

  const payload = mapNewsUpdatePayload(req.body || {});
  if (Object.values(payload).every((value) => value === undefined || value === '')) {
    return res.status(400).json({
      success: false,
      error: { message: 'No valid fields provided for update', code: 'BAD_REQUEST' }
    });
  }

  const existing = news[index];
  news[index] = {
    ...existing,
    ...Object.fromEntries(
      Object.entries(payload).filter(([, value]) => value !== undefined && value !== '')
    )
  };

  return res.json({ success: true, data: mapNewsArticle(news[index]) });
};

const deleteNews = async (req, res) => {
  const id = sanitizeText(req.params.id, 120);
  const index = news.findIndex((item) => item.id === id);
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: { message: 'Article not found', code: 'NOT_FOUND' }
    });
  }
  news.splice(index, 1);
  return res.json({ success: true, data: { message: 'Article deleted' } });
};

const getJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll();
    res.json({ success: true, data: jobs.map(mapJob) });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: { message: 'Could not load jobs', code: 'SERVER_ERROR' }
    });
  }
};

const applyToJob = async (req, res) => {
  const jobId = sanitizeText(req.params.id, 120);
  try {
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: { message: 'Job not found', code: 'NOT_FOUND' }
      });
    }

    const name = sanitizeText(req.body?.name, 255);
    const email = sanitizeEmail(req.body?.email);
    const phone = sanitizePhone(req.body?.phone);
    const coverLetter = sanitizeMultiline(req.body?.coverLetter, 5000);
    const resumeFileName = sanitizeFilename(req.body?.resumeFileName);

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        error: { message: 'Name, valid email, and phone are required', code: 'BAD_REQUEST' }
      });
    }

    const applicationId = await CareerApplication.create({
      jobId,
      jobTitle: job.title,
      name,
      email,
      phone,
      coverLetter,
      resumeFileName
    });

    await sendEmail({
      to: email,
      subject: `Application received - ${job.title}`,
      html: applicationReceivedTemplate({ name, jobTitle: job.title }),
      text: `Hello ${name}, your application for ${job.title} has been received.`
    });

    res.status(201).json({
      success: true,
      data: { message: 'Application submitted successfully', applicationId }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: { message: 'Could not submit application', code: 'SERVER_ERROR' }
    });
  }
};

const getCareerApplications = async (req, res) => {
  const jobId = sanitizeText(req.query.jobId, 120);
  const search = sanitizeText(req.query.search, 120);
  const { page = 1, limit = 20 } = req.query;

  try {
    const result = await CareerApplication.findAll({ jobId, search, page, limit });
    res.json({
      success: true,
      data: {
        applications: result.applications.map(mapApplication),
        total: result.total,
        page: result.page,
        totalPages: result.totalPages
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: { message: 'Could not load applications', code: 'SERVER_ERROR' }
    });
  }
};

const updateCareerApplicationStatus = async (req, res) => {
  const id = sanitizeText(req.params.id, 120);
  const status = sanitizeStatus(req.body?.status, APPLICATION_STATUSES);

  if (!status) {
    return res.status(400).json({
      success: false,
      error: { message: 'Invalid status', code: 'BAD_REQUEST' }
    });
  }

  try {
    const existing = await CareerApplication.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: { message: 'Application not found', code: 'NOT_FOUND' }
      });
    }

    const updated = await CareerApplication.updateStatus(id, status);
    if (!updated) {
      return res.status(400).json({
        success: false,
        error: { message: 'Status was not updated', code: 'BAD_REQUEST' }
      });
    }

    const application = await CareerApplication.findById(id);

    await sendEmail({
      to: application.email,
      subject: `Application status updated - ${application.job_title}`,
      html: applicationStatusTemplate({
        name: application.name,
        jobTitle: application.job_title,
        status
      }),
      text: `Hello ${application.name}, your application status for ${application.job_title} is now ${status}.`
    });

    res.json({ success: true, data: mapApplication(application) });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: { message: 'Could not update application status', code: 'SERVER_ERROR' }
    });
  }
};

const exportCareerApplicationsCsv = async (req, res) => {
  const jobId = sanitizeText(req.query.jobId, 120);
  const search = sanitizeText(req.query.search, 120);

  try {
    const result = await CareerApplication.findAll({ jobId, search, page: 1, limit: 5000 });
    const headers = [
      'Application ID',
      'Submitted At',
      'Status',
      'Status Updated At',
      'Job ID',
      'Job Title',
      'Name',
      'Email',
      'Phone',
      'Resume Filename',
      'Cover Letter'
    ];
    const lines = [headers.map(escapeCsv).join(',')];

    result.applications.forEach((row) => {
      lines.push(
        [
          row.id,
          row.created_at,
          row.status || 'new',
          row.status_updated_at || '',
          row.job_id,
          row.job_title,
          row.name,
          row.email,
          row.phone,
          row.resume_file_name || '',
          row.cover_letter || ''
        ].map(escapeCsv).join(',')
      );
    });

    const csv = lines.join('\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="applications-export.csv"');
    res.status(200).send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: { message: 'Could not export applications', code: 'SERVER_ERROR' }
    });
  }
};

const createJob = async (req, res) => {
  const title = sanitizeText(req.body?.title, 255);
  const department = sanitizeText(req.body?.department, 255);
  const location = sanitizeText(req.body?.location, 255);
  const type = sanitizeText(req.body?.type, 100);
  const salary = sanitizeText(req.body?.salary, 255);
  const description = sanitizeMultiline(req.body?.description, 4000);
  const requirements = sanitizeRequirements(req.body?.requirements);

  if (!title || !department || !location || !type || !description) {
    return res.status(400).json({
      success: false,
      error: { message: 'title, department, location, type and description are required', code: 'BAD_REQUEST' }
    });
  }

  if (!requirements.length) {
    return res.status(400).json({
      success: false,
      error: { message: 'requirements must be a non-empty array', code: 'BAD_REQUEST' }
    });
  }

  try {
    const id = await Job.create({
      title,
      department,
      location,
      type,
      salary,
      description,
      requirements
    });
    const created = await Job.findById(id);
    res.status(201).json({ success: true, data: mapJob(created) });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: { message: 'Could not create job', code: 'SERVER_ERROR' }
    });
  }
};

const updateJob = async (req, res) => {
  const id = sanitizeText(req.params.id, 120);
  const payload = req.body || {};

  const updateFields = {
    title: payload.title !== undefined ? sanitizeText(payload.title, 255) : undefined,
    department: payload.department !== undefined ? sanitizeText(payload.department, 255) : undefined,
    location: payload.location !== undefined ? sanitizeText(payload.location, 255) : undefined,
    type: payload.type !== undefined ? sanitizeText(payload.type, 100) : undefined,
    salary: payload.salary !== undefined ? sanitizeText(payload.salary, 255) : undefined,
    description: payload.description !== undefined ? sanitizeMultiline(payload.description, 4000) : undefined,
    requirements: Array.isArray(payload.requirements)
      ? JSON.stringify(sanitizeRequirements(payload.requirements))
      : undefined
  };

  try {
    const exists = await Job.findById(id);
    if (!exists) {
      return res.status(404).json({
        success: false,
        error: { message: 'Job not found', code: 'NOT_FOUND' }
      });
    }

    const updated = await Job.update(id, updateFields);
    if (!updated) {
      return res.status(400).json({
        success: false,
        error: { message: 'No valid fields provided for update', code: 'BAD_REQUEST' }
      });
    }

    const job = await Job.findById(id);
    res.json({ success: true, data: mapJob(job) });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: { message: 'Could not update job', code: 'SERVER_ERROR' }
    });
  }
};

const deleteJob = async (req, res) => {
  const id = sanitizeText(req.params.id, 120);
  try {
    const deleted = await Job.delete(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: { message: 'Job not found', code: 'NOT_FOUND' }
      });
    }
    res.json({ success: true, data: { message: 'Job deleted' } });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: { message: 'Could not delete job', code: 'SERVER_ERROR' }
    });
  }
};

const subscribeToNewsletter = async (req, res) => {
  const email = sanitizeEmail(req.body?.email);
  if (!email) {
    return res.status(400).json({
      success: false,
      error: { message: 'Valid email is required', code: 'BAD_REQUEST' }
    });
  }

  try {
    const existing = await NewsletterSubscriber.findByEmail(email);
    if (existing) {
      return res.json({
        success: true,
        data: { message: 'Email already subscribed' }
      });
    }

    await NewsletterSubscriber.create(email);
    await sendEmail({
      to: email,
      subject: 'Welcome to Telente Logistics updates',
      html: newsletterSubscribedTemplate({ email }),
      text: `You are now subscribed to Telente Logistics updates with ${email}.`
    });
    res.status(201).json({
      success: true,
      data: { message: 'Subscribed successfully' }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: { message: 'Could not subscribe email', code: 'SERVER_ERROR' }
    });
  }
};

module.exports = {
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
};

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('./config/env');
const { ensureDatabaseAndSeedAdmin } = require('./db/init');

const authRoutes = require('./routes/auth');
const packageRoutes = require('./routes/packages');
const publicRoutes = require('./routes/public');
const contentRoutes = require('./routes/content');
const requestSecurity = require('./middleware/requestSecurity');

const app = express();

app.disable('x-powered-by');

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true
  })
);
app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(requestSecurity);

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false
});
app.use(globalLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/packages', packageRoutes); // protected admin routes
app.use('/api', publicRoutes); // public routes: tracking, contact
app.use('/api', contentRoutes); // public content routes: services, news, careers

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      service: 'Telente Logistics API',
      timestamp: new Date().toISOString()
    }
  });
});

app.get('/', (req, res) => {
  res.send('Telente Logistics API');
});

const PORT = process.env.PORT || 5000;

app.use((err, req, res, next) => {
  if (err && err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      error: { message: 'Origin not allowed', code: 'FORBIDDEN' }
    });
  }
  return next(err);
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { message: 'Route not found', code: 'NOT_FOUND' }
  });
});

ensureDatabaseAndSeedAdmin()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });

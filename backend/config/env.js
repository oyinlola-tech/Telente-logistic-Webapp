const path = require('path');
const dotenv = require('dotenv');

// Load backend-local env first, then process-level env values.
dotenv.config({ path: path.join(__dirname, '..', '.env') });
dotenv.config();

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

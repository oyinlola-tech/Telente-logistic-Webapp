  ## Running the code

  1. Install dependencies:
  `npm install`

  2. Configure backend environment in `backend/.env` (MySQL + Gmail SMTP):
  - `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
  - `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `JWT_SECRET`
  - `SMTP_HOST=smtp.gmail.com`
  - `SMTP_PORT=465`
  - `SMTP_SECURE=true`
  - `SMTP_USER=<your gmail>`
  - `SMTP_PASS=<gmail app password>`
  - `EMAIL_FROM=<display sender address>`

  3. Start frontend + backend together:
  `npm run dev`

  4. Production-like start:
  `npm start`

  Notes:
  - Database tables are created automatically on backend startup (`backend/db/init.js`).
  - Admin applications support status workflow (`new`, `reviewed`, `shortlisted`, `rejected`) and CSV export from dashboard.
  - Package status updates and career/newsletter events send emails through Nodemailer.
  

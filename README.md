# Telente Logistics Platform
Production-grade full-stack logistics web platform with:
- public marketing pages
- package tracking
- contact and newsletter capture
- careers and applications
- admin dashboard
- OTP-secured admin authentication
- forgot/reset/change password system

Owner and copyright holder:
- **Oluwayemi Oyinlola**
- Portfolio: **https://oyinlola.site**

## Important Legal Notice
This software is **not free to use**.
No individual, company, contractor, or organization is allowed to use, copy, modify, deploy, distribute, sublicense, or commercialize this software without written permission from Oluwayemi Oyinlola.

Read these files before any use:
- `LICENSE`
- `SECURITY.md`

## Tech Stack
- Frontend: React + Vite + TypeScript + Tailwind
- Backend: Node.js + Express
- Database: MySQL
- Auth: JWT + OTP verification
- Email: Nodemailer (SMTP)

## Repository Structure
- `src/` Frontend source
- `backend/` Backend API and database bootstrap
- `public/` Static public assets (favicon, etc.)
- `dist/` Frontend production build output

## Runtime Behavior
When backend starts, it automatically:
1. connects to MySQL server
2. creates database if missing
3. creates missing tables
4. applies missing schema columns
5. seeds starter jobs if jobs table is empty
6. creates initial admin user **only if that admin username does not already exist**

This means:
- first run creates what is missing
- next runs do not destroy or reset existing data
- next runs only add missing schema/tables and keep existing records intact

## Prerequisites
- Node.js 18+ recommended
- npm 9+ recommended
- MySQL 8+ (or compatible)
- SMTP account for outgoing emails (Gmail app password or other SMTP provider)

## Environment Setup
### Frontend `.env` (root)
Current frontend env keys:
- `VITE_API_URL` e.g. `http://localhost:5000/api`
- `VITE_ADMIN_LOGIN_PATH` e.g. `/admin/login`

### Backend `.env`
Location:
- `backend/.env`

Template:
- `backend/.env.example`

Steps:
1. copy `backend/.env.example` to `backend/.env`
2. set real database and SMTP credentials
3. set a strong `JWT_SECRET`
4. set secure `ADMIN_PASSWORD`

## Install
```bash
npm install
```

## Run in Development
Runs backend and frontend concurrently:
```bash
npm run dev
```

Default URLs:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## Run in Start Mode
```bash
npm start
```

## Build
```bash
npm run build
```

## Database Notes
Backend startup logic is handled in:
- `backend/server.js`
- `backend/db/init.js`

Design goals already implemented:
- idempotent database creation
- missing-table auto creation
- missing-column migration
- no repeated destructive updates
- no existing admin password override during startup

## Admin Authentication Flow
Admin login is protected in 2 phases:
1. username/password check (`/api/auth/login`)
2. OTP verification (`/api/auth/verify-otp`)

Additional auth flows:
- resend OTP (`/api/auth/resend-otp`)
- forgot password (`/api/auth/forgot-password`)
- reset password (`/api/auth/reset-password`)
- change password (authenticated) (`/api/auth/change-password`)

## Security Features Included
- Helmet headers
- CORS allowlist
- global and route-specific rate limiting
- JWT auth for admin routes
- payload/key hardening middleware
- server-safe error responses
- input sanitization across controllers
- OTP attempts and resend controls
- expiring password reset token flow

More details:
- see `SECURITY.md`

## Product Branding Assets
Custom branding included:
- abstract logo: `src/assets/telente-logo.svg`
- matching favicon: `public/favicon.svg`

## Operational Recommendations
- Use separate credentials for local/staging/production.
- Set `NODE_ENV=production` in production.
- Run behind HTTPS reverse proxy in production.
- Restrict MySQL network access.
- Rotate JWT and SMTP credentials periodically.
- Back up database regularly.

## Support and Permissions
For licensing, access, deployment, private customization, or commercial permission:
- **Oluwayemi Oyinlola**
- **https://oyinlola.site**

No usage rights are granted without explicit written approval.

# Security Policy

## Maintainer
- **Oluwayemi Oyinlola**
- Portfolio: **https://oyinlola.site**

## Legal and Access Context
This platform is proprietary software and not publicly licensed for free use.
If you discovered a vulnerability while evaluating access granted by the owner, report it privately as described below.
Do not publish exploit details before coordinated resolution and permission from the owner.

## Supported Security Scope
Security review and fixes apply to:
- frontend in `src/`
- backend API in `backend/`
- database initialization and migrations in `backend/db/`
- authentication, OTP, and password recovery flows
- environment/configuration defaults and production-hardening controls

## Reporting a Vulnerability
If you discover a security issue, report privately with:
1. vulnerability title and severity estimate
2. affected file(s), route(s), and component(s)
3. reproducible steps
4. proof-of-concept payload/request
5. impact analysis
6. mitigation suggestions (optional)

Contact:
- Oluwayemi Oyinlola
- https://oyinlola.site

Do not:
- open public issue with exploit details
- post exploit on social media/forums
- contact third parties about the issue before owner approval

## Response and Remediation Model
Target flow:
1. acknowledgment of report
2. triage and impact validation
3. patch design and implementation
4. verification in controlled environment
5. coordinated disclosure decision by owner

Critical vulnerabilities are prioritized first.

## Current Security Controls Implemented
### Backend Platform Controls
- Express hardening:
  - `helmet`
  - disabled `x-powered-by`
- CORS allowlist:
  - restricted via configured origins
- Rate limiting:
  - global limiter
  - auth/login limiter
  - OTP verify/resend limiter
  - public endpoint limiters (contact, tracking, newsletter, careers apply)
- Request payload hardening:
  - suspicious key rejection (`__proto__`, `constructor`, `prototype`)
  - oversized and malformed payload checks

### Authentication and Session Controls
- JWT-based protected admin routes
- two-step admin login with OTP:
  - username/password validation
  - OTP challenge token
  - OTP expiry window
  - OTP resend cooldown
  - max OTP attempt restriction
- token verification middleware on protected routes

### Password Security Controls
- hashed password storage (`bcrypt`)
- forgot password flow with expiring token
- reset token stored as hash
- authenticated change-password endpoint
- password complexity checks for reset/change

### Input Validation and Sanitization
- sanitizers for text, multiline, email, phone, filename, status, OTP
- strict request-body checks in critical routes
- defensive validation in public and admin operations

### Database Safety
- parameterized SQL queries via mysql2
- automatic schema bootstrapping:
  - create database if missing
  - create missing tables
  - add missing columns safely
- idempotent initialization behavior
- startup no longer overrides existing admin credentials

## Secrets and Environment Requirements
Production deployments must:
- set strong `JWT_SECRET`
- use secure DB credentials with least privilege
- protect SMTP credentials
- avoid committing secrets to source control
- keep `backend/.env` private
- use `backend/.env.example` as template only

Recommended:
- secret rotation policy
- environment-specific credentials
- runtime secret manager when possible

## Production Hardening Recommendations
- run behind HTTPS reverse proxy
- enforce TLS termination
- use network ACLs and firewall restrictions for DB/API
- isolate database from public internet
- enable structured central logging and alerting
- back up database regularly and test restore procedure
- monitor auth/OTP/reset endpoint abuse patterns

## Security Testing Guidance
Before production release, verify:
- auth bypass attempts fail
- JWT expiration/invalid tokens fail safely
- OTP brute force attempts are rate-limited
- reset token replay/expiry handling works
- SQL injection and malicious payload attempts are blocked
- unauthorized admin endpoint access returns proper status codes
- error responses do not leak sensitive internals

## Out-of-Scope Behavior
The owner does not permit:
- unsanctioned penetration testing on production systems
- denial-of-service testing without explicit written authorization
- automated exploit scanning on infrastructure you do not own

## Final Notice
Security participation does not grant license rights to use this software.
All usage remains subject to owner permission and the proprietary `LICENSE` terms.

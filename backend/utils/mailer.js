let transporter;
let nodemailerModule;

function getNodemailer() {
  if (nodemailerModule) return nodemailerModule;
  try {
    // Load lazily so missing package does not crash server startup.
    // This keeps local/dev runs usable even if email dependency is absent.
    nodemailerModule = require('nodemailer');
    return nodemailerModule;
  } catch (error) {
    return null;
  }
}

function createJsonFallbackTransport() {
  return {
    async sendMail(payload) {
      const message = JSON.stringify(payload);
      return { message, accepted: payload?.to ? [payload.to] : [] };
    }
  };
}

function getTransporter() {
  if (transporter) return transporter;

  const hasSmtpConfig =
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS;

  const nodemailer = getNodemailer();

  if (hasSmtpConfig && nodemailer) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  } else {
    transporter = nodemailer
      ? nodemailer.createTransport({ jsonTransport: true })
      : createJsonFallbackTransport();
  }

  return transporter;
}

async function sendEmail({ to, subject, html, text }) {
  if (!to) return { skipped: true, reason: 'Missing recipient email' };

  const from = process.env.EMAIL_FROM || 'Telente Logistics <no-reply@telentelogistics.com>';
  const tx = getTransporter();

  const result = await tx.sendMail({
    from,
    to,
    subject,
    html,
    text
  });

  if (result?.message) {
    console.log('Email (json transport):', result.message);
  }

  return result;
}

module.exports = { sendEmail };

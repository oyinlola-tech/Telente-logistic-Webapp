const nodemailer = require('nodemailer');

let transporter;

function getTransporter() {
  if (transporter) return transporter;

  const hasSmtpConfig =
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS;

  if (hasSmtpConfig) {
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
    transporter = nodemailer.createTransport({
      jsonTransport: true
    });
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


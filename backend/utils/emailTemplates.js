const PRIMARY_COLOR = '#1B75BC';
const SECONDARY_COLOR = '#2E4049';

function baseTemplate({ heading, subheading, contentHtml, actionLabel, actionUrl }) {
  const actionButton = actionLabel && actionUrl
    ? `
      <div style="margin-top:24px;">
        <a href="${actionUrl}" style="background:${PRIMARY_COLOR};color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:700;display:inline-block;">
          ${actionLabel}
        </a>
      </div>
    `
    : '';

  return `
  <div style="font-family:Arial,sans-serif;background:#f7f9fc;padding:20px;">
    <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid ${PRIMARY_COLOR};border-radius:12px;overflow:hidden;">
      <div style="background:${PRIMARY_COLOR};padding:20px;">
        <h1 style="color:#ffffff;margin:0;font-size:22px;">${heading}</h1>
        <p style="color:#ffffff;margin:8px 0 0 0;font-size:14px;">${subheading}</p>
      </div>
      <div style="padding:24px;color:${SECONDARY_COLOR};font-size:15px;line-height:1.6;">
        ${contentHtml}
        ${actionButton}
      </div>
      <div style="padding:14px 24px;border-top:1px solid ${PRIMARY_COLOR};color:${SECONDARY_COLOR};font-size:12px;">
        Telente Logistics updates | Built for reliable shipment and hiring communication.
      </div>
    </div>
  </div>
  `;
}

function toTitleCase(status) {
  return String(status || '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function packageStatusTemplate({ recipientName, trackingNumber, status, location, estimatedDelivery }) {
  const statusLabel = toTitleCase(status);
  return baseTemplate({
    heading: 'Package Status Update',
    subheading: `Tracking number ${trackingNumber}`,
    contentHtml: `
      <p>Hello ${recipientName || 'Customer'},</p>
      <p>Your shipment has a new progress update. It is now marked as <strong>${statusLabel}</strong>.</p>
      <table style="width:100%;border-collapse:collapse;margin-top:12px;">
        <tr>
          <td style="padding:8px;border:1px solid ${PRIMARY_COLOR};font-weight:700;">Tracking Number</td>
          <td style="padding:8px;border:1px solid ${PRIMARY_COLOR};">${trackingNumber}</td>
        </tr>
        <tr>
          <td style="padding:8px;border:1px solid ${PRIMARY_COLOR};font-weight:700;">Current Location</td>
          <td style="padding:8px;border:1px solid ${PRIMARY_COLOR};">${location || 'In transit'}</td>
        </tr>
        <tr>
          <td style="padding:8px;border:1px solid ${PRIMARY_COLOR};font-weight:700;">Estimated Delivery</td>
          <td style="padding:8px;border:1px solid ${PRIMARY_COLOR};">${estimatedDelivery ? new Date(estimatedDelivery).toLocaleDateString() : 'Not set'}</td>
        </tr>
      </table>
      <p style="margin-top:16px;">You will continue receiving automatic milestone updates until final delivery.</p>
      <p style="margin:0;">If you need support, reply to this email and our team will assist immediately.</p>
    `,
    actionLabel: 'Track Package',
    actionUrl: process.env.PUBLIC_TRACKING_URL || 'http://localhost:5173/tracking'
  });
}

function applicationReceivedTemplate({ name, jobTitle }) {
  return baseTemplate({
    heading: 'Application Received',
    subheading: 'Your application has been submitted successfully',
    contentHtml: `
      <p>Hello ${name || 'Applicant'},</p>
      <p>Thank you for applying for <strong>${jobTitle}</strong> at Telente Logistics.</p>
      <p>Our hiring team has successfully received your application and attached details.</p>
      <p><strong>What happens next:</strong></p>
      <ul style="margin:8px 0 0 20px;padding:0;">
        <li>Initial review by recruitment team.</li>
        <li>Shortlisting based on role fit and experience.</li>
        <li>Interview communication for selected candidates.</li>
      </ul>
      <p style="margin-top:16px;">You will receive another email as soon as your application status changes.</p>
    `,
    actionLabel: 'View Open Roles',
    actionUrl: process.env.PUBLIC_CAREERS_URL || 'http://localhost:5173/careers'
  });
}

function applicationStatusTemplate({ name, jobTitle, status }) {
  const statusLabel = toTitleCase(status);
  return baseTemplate({
    heading: 'Application Status Updated',
    subheading: `Role: ${jobTitle}`,
    contentHtml: `
      <p>Hello ${name || 'Applicant'},</p>
      <p>Your application status is now <strong>${statusLabel}</strong>.</p>
      <p>This update reflects the latest review action from our recruitment team.</p>
      <p>We appreciate your interest in joining Telente Logistics and will share the next step when available.</p>
      <p>If additional information is needed from you, our team will contact you directly by email.</p>
    `,
    actionLabel: 'Visit Careers',
    actionUrl: process.env.PUBLIC_CAREERS_URL || 'http://localhost:5173/careers'
  });
}

function newsletterSubscribedTemplate({ email }) {
  return baseTemplate({
    heading: 'Newsletter Subscription Confirmed',
    subheading: 'You are now subscribed to Telente Logistics updates',
    contentHtml: `
      <p>Hello,</p>
      <p><strong>${email}</strong> has been added to our mailing list.</p>
      <p>You will receive logistics updates, service improvements, and company announcements.</p>
      <p>We keep emails concise, useful, and relevant to your logistics needs.</p>
    `,
    actionLabel: 'Visit Website',
    actionUrl: process.env.PUBLIC_SITE_URL || 'http://localhost:5173'
  });
}

function adminOtpTemplate({ username, otp, expiresInMinutes }) {
  return baseTemplate({
    heading: 'Admin Sign-in Verification',
    subheading: `Security code for ${username}`,
    contentHtml: `
      <p>Use this one-time code to complete your admin sign-in:</p>
      <p style="font-size:28px;letter-spacing:8px;font-weight:700;margin:14px 0;color:${PRIMARY_COLOR};">
        ${otp}
      </p>
      <p>This code expires in ${expiresInMinutes} minutes and can only be used once.</p>
      <p>If you did not request this, ignore this message and rotate admin credentials immediately.</p>
    `,
    actionLabel: 'Open Admin Login',
    actionUrl: `${process.env.PUBLIC_SITE_URL || 'http://localhost:5173'}${process.env.VITE_ADMIN_LOGIN_PATH || '/control-room-access'}`
  });
}

function adminPasswordResetTemplate({ username, resetUrl, expiresInMinutes }) {
  return baseTemplate({
    heading: 'Admin Password Reset',
    subheading: `Password reset request for ${username}`,
    contentHtml: `
      <p>We received a request to reset your admin password.</p>
      <p>If this was you, use the button below to set a new password.</p>
      <p>This reset link expires in ${expiresInMinutes} minutes.</p>
      <p>If you did not request this, ignore this email and secure your account.</p>
    `,
    actionLabel: 'Reset Password',
    actionUrl: resetUrl
  });
}

module.exports = {
  packageStatusTemplate,
  applicationReceivedTemplate,
  applicationStatusTemplate,
  newsletterSubscribedTemplate,
  adminOtpTemplate,
  adminPasswordResetTemplate
};

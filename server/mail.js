  import nodemailer from 'nodemailer';

/** Public site URL for password reset links (no trailing slash). */
export const FRONTEND_PUBLIC_URL = (
  process.env.FRONTEND_PUBLIC_URL || 'https://madeinheaven.legal'
).replace(/\/$/, '');

/**
 * Send password reset email. If SMTP is not configured, logs the link and returns sent: false.
 */
export async function sendPasswordResetEmail({ to, resetUrl }) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const secure =
    process.env.SMTP_SECURE === 'true' || String(port) === '465';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.MAIL_FROM || process.env.SMTP_FROM || 'noreply@madeinheaven.legal';

  if (!host || !user || !pass) {
    console.warn('[password-reset] SMTP not configured (set SMTP_HOST, SMTP_USER, SMTP_PASS). Link for', to, ':', resetUrl);
    return { sent: false, reason: 'smtp_not_configured' };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from,
    to,
    subject: 'Reset your Made In Heaven password',
    text: `You requested a password reset.\n\nOpen this link (valid for 1 hour):\n${resetUrl}\n\nIf you did not request this, ignore this email.`,
    html: `
      <p>You requested a password reset for your Made In Heaven account.</p>
      <p><a href="${resetUrl}" style="color:#b08a1b;">Reset your password</a></p>
      <p style="font-size:12px;color:#666;">This link expires in 1 hour. If you did not request a reset, you can ignore this message.</p>
      <p style="font-size:12px;color:#999;word-break:break-all;">${resetUrl}</p>
    `,
  });

  return { sent: true };
}

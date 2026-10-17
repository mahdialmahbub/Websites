import { env } from '../config/env.js';
import { sendMail } from './mailer.js';

const escapeHtml = (value = '') =>
  String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

const COPY = {
  verify_email: {
    subject: 'Verify your email',
    heading: 'Confirm your email address',
    intro: 'Use the code below to finish creating your account.',
  },
  reset_password: {
    subject: 'Reset your password',
    heading: 'Reset your password',
    intro: 'Use the code below to reset your password.',
  },
};

/** @param {{ to: string, name?: string, purpose: 'verify_email'|'reset_password', code: string, expiresInMinutes: number }} input */
export function sendOtpEmail({ to, name, purpose, code, expiresInMinutes }) {
  const copy = COPY[purpose];
  const firstName = (name || '').trim().split(/\s+/)[0] || 'there';
  const subject = `${copy.subject} - ${env.APP_NAME}`;

  const text = [
    `Hi ${firstName},`,
    '',
    copy.intro,
    '',
    `Your code: ${code}`,
    '',
    `It expires in ${expiresInMinutes} minutes. If you did not request it, you can safely ignore this email.`,
  ].join('\n');

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#f4f5f7;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
    <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:12px;padding:32px;">
      <h1 style="font-size:20px;margin:0 0 12px;">${escapeHtml(copy.heading)}</h1>
      <p style="margin:0 0 20px;line-height:1.5;">Hi ${escapeHtml(firstName)},<br />${escapeHtml(copy.intro)}</p>
      <div style="font-size:32px;font-weight:700;letter-spacing:8px;text-align:center;background:#f1f5f9;border-radius:8px;padding:16px 0;">${escapeHtml(code)}</div>
      <p style="margin:20px 0 0;font-size:13px;line-height:1.5;color:#64748b;">This code expires in ${expiresInMinutes} minutes. If you did not request it, you can safely ignore this email.</p>
    </div>
  </body>
</html>`;

  return sendMail({ to, subject, text, html });
}

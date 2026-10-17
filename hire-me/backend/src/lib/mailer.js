import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { ApiError } from './ApiError.js';
import { logger } from './logger.js';

let smtp;
const smtpTransport = () =>
  (smtp ??= nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465, // 465 = implicit TLS, 587 = STARTTLS
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  }));

/** "Name <a@b.com>" -> { name, email } */
function parseFrom(value) {
  const match = /^\s*"?([^"<]*?)"?\s*<([^>]+)>\s*$/.exec(value);
  return match ? { name: match[1].trim() || undefined, email: match[2].trim() } : { email: value.trim() };
}

async function postJson(url, apiKey, payload, label) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`${label} responded ${res.status}: ${(await res.text()).slice(0, 300)}`);
}

const drivers = {
  console: async ({ to, subject, text }) => {
    logger.info(`[mail:console] to=${to} subject="${subject}"\n${text}`);
  },
  smtp: ({ to, subject, text, html }) =>
    smtpTransport().sendMail({ from: env.MAIL_FROM, to, subject, text, html }),
  resend: ({ to, subject, text, html }) =>
    postJson('https://api.resend.com/emails', env.RESEND_API_KEY, { from: env.MAIL_FROM, to: [to], subject, text, html }, 'Resend'),
  sendgrid: ({ to, subject, text, html }) =>
    postJson(
      'https://api.sendgrid.com/v3/mail/send',
      env.SENDGRID_API_KEY,
      {
        personalizations: [{ to: [{ email: to }] }],
        from: parseFrom(env.MAIL_FROM),
        subject,
        content: [
          { type: 'text/plain', value: text },
          { type: 'text/html', value: html },
        ],
      },
      'SendGrid',
    ),
};

/** @param {{ to: string, subject: string, text: string, html: string }} message */
export async function sendMail(message) {
  try {
    await drivers[env.MAIL_PROVIDER](message);
  } catch (err) {
    logger.error(`[mail:${env.MAIL_PROVIDER}] send failed:`, err.message);
    throw new ApiError(502, 'EMAIL_SEND_FAILED', 'We could not send the email right now. Please try again in a moment.');
  }
}

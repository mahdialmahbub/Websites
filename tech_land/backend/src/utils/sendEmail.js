const nodemailer = require("nodemailer");

let transporter;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
};

/**
 * Sends an email. In development, if SMTP isn't configured, it logs the
 * email to the console instead of throwing — so OTP flows are testable
 * without a real mail server.
 */
const sendEmail = async ({ to, subject, html }) => {
  const smtpConfigured = process.env.SMTP_USER && process.env.SMTP_PASS;

  if (!smtpConfigured) {
    console.log("📧 [DEV MODE - no SMTP configured] Email would be sent:");
    console.log(`   To: ${to}\n   Subject: ${subject}\n   Body: ${html}`);
    return { simulated: true };
  }

  const info = await getTransporter().sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    html,
  });

  return info;
};

const otpEmailTemplate = (otp, purposeText) => `
  <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
    <h2>Tect Store Verification Code</h2>
    <p>Use the code below to ${purposeText}. This code expires in ${process.env.OTP_EXPIRES_MINUTES || 5} minutes.</p>
    <p style="font-size: 32px; font-weight: bold; letter-spacing: 6px;">${otp}</p>
    <p>If you didn't request this, you can safely ignore this email.</p>
  </div>
`;

module.exports = { sendEmail, otpEmailTemplate };

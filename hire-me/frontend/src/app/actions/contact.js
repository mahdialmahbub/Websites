
"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const escapeHtml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY_VALUES = {
  name: "",
  email: "",
  message: "",
};

const createState = ({
  success = false,
  error = "",
  values = EMPTY_VALUES,
  fieldErrors = {},
} = {}) => ({
  success,
  error,
  values,
  fieldErrors,
});

export async function sendContactMessage(prevState, formData) {
  // Silently accept honeypot submissions to avoid revealing spam detection.
  if (formData.get("website")) {
    return createState({ success: true });
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  const values = { name, email, message };
  const fieldErrors = {};

  // Validate all fields and return their errors together.
  if (!name) {
    fieldErrors.name = "Please enter your full name.";
  } else if (name.length > 80) {
    fieldErrors.name = "Your name must not exceed 80 characters.";
  }

  if (!email) {
    fieldErrors.email = "Please enter your email address.";
  } else if (email.length > 120 || !EMAIL_RE.test(email)) {
    fieldErrors.email = "Please enter a valid email address.";
  }

  if (message.length < 10) {
    fieldErrors.message = "Your message must contain at least 10 characters.";
  } else if (message.length > 2000) {
    fieldErrors.message = "Your message must not exceed 2000 characters.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return createState({
      values,
      fieldErrors,
    });
  }

  try {
    if (
      !process.env.RESEND_API_KEY ||
      !process.env.CONTACT_FROM_EMAIL ||
      !process.env.CONTACT_TO_EMAIL
    ) {
      console.error("Contact form email configuration is incomplete.");

      return createState({
        error: "Unable to send your message right now. Please try again later.",
        values,
      });
    }

    const { error } = await resend.emails.send({
      from: `Hire Me Contact <${process.env.CONTACT_FROM_EMAIL}>`,
      to: process.env.CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `
        <h2>New contact message</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p style="white-space: pre-wrap">${escapeHtml(message)}</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);

      return createState({
        error: "Could not send your message. Please try again.",
        values,
      });
    }

    return createState({
      success: true,
      values: EMPTY_VALUES,
    });
  } catch (err) {
    console.error("Contact form submission failed:", err);

    return createState({
      error: "Something went wrong. Please try again.",
      values,
    });
  }
}

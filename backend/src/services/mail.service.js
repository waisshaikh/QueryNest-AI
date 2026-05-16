import dotenv from "dotenv";
dotenv.config(); // 👈 MUST be at top

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html, text }) {
  if (!process.env.EMAIL_FROM) {
    throw new Error("EMAIL_FROM is not configured");
  }

  const response = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html: html || `<p>${text}</p>`,
  });

  if (response.error) {
    const message = response.error.message || "Failed to send email";
    throw new Error(message);
  }

  console.log("Email sent:", response.data);
  return response.data;
}

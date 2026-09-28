import dotevn from "dotenv";
import { config } from "dotenv";
import nodeMailer from "nodemailer";
import { google } from "googleapis";

config(); // load .env variables

const sendEmailViaGmailAPI = async ({ to, subject, html }) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString("base64")}?=`;
  const messageParts = [
    `From: QueryNest <${process.env.GOOGLE_USER}>`,
    `To: ${to}`,
    `Content-Type: text/html; charset=utf-8`,
    `MIME-Version: 1.0`,
    `Subject: ${utf8Subject}`,
    ``,
    html,
  ];
  const message = messageParts.join("\n");

  const encodedMessage = Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const res = await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: encodedMessage,
    },
  });

  return res.data;
};

const sendEmail = async ({ to, subject, text, html }) => {
  console.log("📧 Sending email to:", to);

  // Use Gmail API over HTTPS (Port 443) if OAuth2 credentials exist (prevents Render SMTP firewall timeouts)
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN) {
    try {
      console.log("🚀 Sending via Gmail REST API (HTTPS port 443)...");
      const result = await sendEmailViaGmailAPI({ to, subject, html });
      console.log("✅ Gmail REST API Email Sent successfully:", result.id);
      return result;
    } catch (apiError) {
      console.error("⚠️ Gmail REST API failed, falling back to Nodemailer SMTP:", apiError.message);
    }
  }

  // Fallback to Nodemailer SMTP for local dev
  const transporter = nodeMailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    family: 4,
    auth: {
      user: process.env.GOOGLE_USER,
      pass: process.env.GOOGLE_APP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const info = await transporter.sendMail({
    from: `QueryNest <${process.env.GOOGLE_USER}>`,
    to,
    subject,
    text,
    html,
  });

  console.log("Message sent via SMTP: %s", info.messageId);
  return info;
};

export default sendEmail;


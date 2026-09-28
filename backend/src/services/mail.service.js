import dotevn from "dotenv";
import { config } from "dotenv";
import nodeMailer from "nodemailer"

config(); // load .env variables

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

transporter.verify((error) => {
  if (error) {
    console.error(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});


const sendEmail = async ({ to, subject, text, html }) => {
  console.log("📧 Sending email to:", to);
  const info = await transporter.sendMail({
    from: `QueryNest <${process.env.GOOGLE_USER}>`,
    to,
    subject,
    text,
    html,
  });

  console.log('Message sent: %s', info.messageId);
  return info;
};

export default sendEmail


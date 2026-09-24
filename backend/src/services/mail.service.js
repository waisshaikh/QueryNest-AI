import dotevn from "dotenv";
import { config } from "dotenv";
import nodeMailer from "nodemailer"

config(); // load .env variables

const transporter = nodeMailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GOOGLE_USER,
    pass: process.env.GOOGLE_APP_PASSWORD,
  }
})

transporter.verify((error) => {
  if (error) {
    console.error(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});


//  send email function

const sendEmail = async ({ to, subject, text, html }) => {
  console.log("📧 Sending email to:", to);
  try {
    const info = await transporter.sendMail({
      from: `QuerNest <${process.env.GOOGLE_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodeMailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export default sendEmail

import dotevn from "dotenv";
import { config } from "dotenv";
import nodeMailer from "nodemailer"

const transporter = nodeMailer.createTransport({
  service: 'gmail',
  auth:{
    type:'OAuth2',
    user:process.env.GOOGLE_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    refreshToken:process.env.GOOGLE_REFRESH_TOKEN
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

const sendEmail = async (to, subject, text, html) => {
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

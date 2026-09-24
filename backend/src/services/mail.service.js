import dotevn from "dotenv";
import { config } from "dotenv";
import nodeMailer from "nodemailer"

const transporter = nodeMailer.transporter({
  service: 'gmail',
  auth:{
    user:process.env.GOOGLE_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    refreshToken:process.env.GOOGLE_REFRESH_TOKEN
  }
})

transporter.verify()
 .then(()=>{console.log("Email Transporter is ready to send a email")})
 .cacth(()=>{console.log("Email Transporter Varification Failed")})


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

module.exports = sendEmail;

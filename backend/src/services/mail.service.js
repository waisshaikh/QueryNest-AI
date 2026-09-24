import dotevn from "dotenv";
import { config } from "dotenv";
import naodeMailer from "nodemailer"

const transporter = naodeMailer.transporter({
  service: 'gmail',
  auth:{
    user:process.env.GOOGLE_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    refreshToken:process.env.GOOGLE_REFRESH_TOKEN
  }
})




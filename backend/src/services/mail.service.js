import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GOOGLE_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }

})

transporter.verify()
    .then(() => {
        console.log("nodemailer is ready for sending email")
        .catch((err) => { console.log("Email Transporter fcaing error ") })
    });

export async function sendEmail({ to, subject, html, text }) {
    const mailOptions = {
        from: process.env.GOOGLE_USER,
        to,
        subject,
        html,
        text
    };

    const details = await transporter.sendMail(mailOptions);
    console.log("Email sent ", details);
    
}
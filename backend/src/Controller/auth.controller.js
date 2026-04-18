import { syncIndexes } from "mongoose";

import userModel from "../models/user.model.js";
import Jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";



// register api

export async function register(req,res) {
    const { username, email, password } = req.body

    const userAlreadyExist = await userModel.findOne({ $or: [{ username }, { email }] });

    if (userAlreadyExist) {
        return res.status(400).json({
            message: "User Already exist",
            success: false,
            err: "user Already exist"
        });
    }

    const User = await userModel.create({ username, email, password })

    const emailVeryficationToken = Jwt.sign({
        email: User.email,
    },process.env.JWT_SECRET)

    await sendEmail({
        to: email,
        subject: "Welcome To queryNest",
        text: `Hi ${username},\n\n Thankyou For Registering at QueryNest-AI We are Exited to have you on! `,
        html: `<p>Hi ${username} , </p><p> Thankyou for registering at <strong>QueryNext-AI</strong> we are exited you on board!</p> 
        <p>Please verify your email by clicking the link below:</p>
        <a href="http://localhost:3000/api/auth/verify-email?token=${emailVeryficationToken}">Verify Email</a> 

        <p>Best Regards <br> QueryNest Team </br> </p>`
    })

    res.status(201).json({
        message:"user Registerd Successfully ",
        success:true,
        user:{
            Id:User._id,
            username:User.username,
            email:User.email
        }
    })
};




// Login Api
export async function login(req,res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });


    if (!user) {
        return res.status(400).json({
            message: "User not exist with this credentials",
            success: false,
        });

        const ispasswordCorrect = await user.comparePassword(password);

        if (!ispasswordCorrect) {
            return res.status(400).json({
                message: "Invalid Password",
                error: "Invalid Password",
                success: false,
            });  
        }    
    }

    if (!user.isVerified) {
        return res.status(400).json({
            message: "Please verify your email to login",
            success: false,
        });
    }
    
    const token = Jwt.sign({
        userId: user._id,
        email: user.email,
    }, process.env.JWT_SECRET, { expiresIn: "7d" });   
    
    res.cookie("token", token).status(200).json({
        message: "Login Successfully",
        success: true,
    });
         
}
     

// email verify
export async function verifyEmail(req, res) {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({
                message: "Token is missing",
                success: false,
            });
        }

        const decoded = Jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findOne({ email: decoded.email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid token",
                success: false,
            });
        }

        user.isVerified = true;
        await user.save();

        const html = `
            <h2>Hi ${user.username},</h2>
            <p>Your email has been successfully verified! </p>
            <p>You can now log in to your account.</p>
            <br/>
            <p><b>QueryNest Team</b></p>
        `;

        return res.send(html);

    } catch (error) {
        return res.status(400).json({
            message: "Invalid or expired token",
            success: false,
            error: error.message,
        });
    }
}             
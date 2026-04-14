import { syncIndexes } from "mongoose";
import userModel from "../models/user.model.js";
import Jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";

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

    await sendEmail({
        to: email,
        subject: "Welcome To queryNest",
        text: `Hi ${username},\n\n Thankyou For Registering at QueryNest-AI We are Exited to have you on! `,
        html: `<p>Hi ${username} , </p><p> Thankyou for registering at <strong>QueryNext-AI</strong> we are exited you on board!</p> <p>Best Regards <br> QueryNest Team </br> </p>`
    })

    res.status(201).json({
        message:"user Registerd Successfully ",
        success:true,
        user:{
            Id:User._id,
            username:User.username,
            email:User.email
        }
    });



}
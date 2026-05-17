import userModel from "../models/user.model.js";
import Jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";



// register api

export async function register(req,res) {
    try {
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

        const emailVerificationToken = Jwt.sign({
            email: User.email,
        },process.env.JWT_SECRET, { expiresIn: "1d" })

        const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3000}`;
        const verificationUrl = new URL("/api/auth/verify-email", backendUrl);
        verificationUrl.searchParams.set("token", emailVerificationToken);

        try {
            await sendEmail({
                to: email,
                subject: "Welcome To queryNest",
                text: `Hi ${username},\n\n Thankyou For Registering at QueryNest-AI We are Exited to have you on! `,
                html: `<p>Hi ${username} , </p><p> Thankyou for registering at <strong>QueryNext-AI</strong> we are exited you on board!</p> 
                <p>Please verify your email by clicking the link below:</p>
                <a href="${verificationUrl.toString()}">Verify Email</a> 

                <p>Best Regards <br> QueryNest Team </br> </p>`
            });
        } catch (error) {
            await userModel.findByIdAndDelete(User._id);
            return res.status(502).json({
                message: "Registration failed because the verification email could not be sent",
                success: false,
                error: error.message,
            });
        }

        res.status(201).json({
            message:"user Registerd Successfully ",
            success:true,
            user:{
                Id:User._id,
                username:User.username,
                email:User.email
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: "Registration failed",
            success: false,
            error: error.message,
        });
    }
};




// Login Api
export async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "User not exist",
                success: false,
            });
        }

        const isPasswordCorrect = await user.comparePassword(password);

        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "Invalid Password",
                success: false,
            });
        }

        if (!user.verified) {
            return res.status(400).json({
                message: "Please verify your email",
                success: false,
            });
        }

        // 4. Token
        const token = Jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.cookie("token", token).status(200).json({
            message: "Login Successfully",
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message,
        });
    }
}
    

export async function getme(req,res) {
    const userid = req.user._id

    const user = await userModel.findById(userid).select("-password")

    if(!user){
        return res.status(404).json({
            message:"User Not Found",
            success:false,
        })
    }
    return res.status(200).json({
        message:"User Found",
        success:true,
        user
    })
    
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

        user.verified = true;
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

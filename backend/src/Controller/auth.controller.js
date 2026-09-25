import userModel from "../models/user.model.js";
import Jwt from "jsonwebtoken";
import sendEmail from "../services/mail.service.js"



// register api

export async function register(req, res) {
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
        }, process.env.JWT_SECRET, { expiresIn: "1d" })

        const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3000}`;
        const verificationUrl = new URL("/api/auth/verify-email", backendUrl);
        verificationUrl.searchParams.set("token", emailVerificationToken);

        try {
            await sendEmail({
                to: email,
                subject: "Verify your email – QueryNest AI",
                html: `
                <!DOCTYPE html>
                <html>
                <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
                <body style="margin:0;padding:0;background:#0f0f0f;font-family:'Segoe UI',Arial,sans-serif;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f0f;padding:40px 20px;">
                    <tr><td align="center">
                      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#18181b;border-radius:16px;overflow:hidden;border:1px solid #31b8c633;">
                        
                        <!-- Header -->
                        <tr><td style="background:linear-gradient(135deg,#31b8c6,#1e7a84);padding:36px 40px;text-align:center;">
                          <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:-0.5px;">QueryNest AI</h1>
                          <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Verify your email address</p>
                        </td></tr>

                        <!-- Body -->
                        <tr><td style="padding:36px 40px;">
                          <p style="margin:0 0 8px;color:#a1a1aa;font-size:14px;">Hello,</p>
                          <h2 style="margin:0 0 16px;color:#f4f4f5;font-size:22px;font-weight:600;">Welcome, ${username}! 👋</h2>
                          <p style="margin:0 0 24px;color:#a1a1aa;font-size:15px;line-height:1.7;">
                            Thanks for signing up at <strong style="color:#31b8c6;">QueryNest AI</strong>. 
                            Please verify your email address to activate your account and get started.
                          </p>

                          <!-- Verify Button -->
                          <div style="text-align:center;margin:32px 0;">
                            <a href="${verificationUrl.toString()}" 
                               style="display:inline-block;padding:14px 40px;background:linear-gradient(135deg,#31b8c6,#1e7a84);color:#ffffff;text-decoration:none;border-radius:10px;font-size:16px;font-weight:700;letter-spacing:0.3px;box-shadow:0 4px 20px rgba(49,184,198,0.4);">
                              ✉ Verify Email
                            </a>
                          </div>

                          <p style="margin:24px 0 0;color:#71717a;font-size:13px;line-height:1.6;">
                            This link expires in <strong style="color:#a1a1aa;">24 hours</strong>. If you didn't create an account, you can safely ignore this email.
                          </p>
                        </td></tr>

                        <!-- Footer -->
                        <tr><td style="padding:20px 40px;border-top:1px solid #27272a;text-align:center;">
                          <p style="margin:0;color:#52525b;font-size:12px;">© 2026 QueryNest AI · All rights reserved</p>
                        </td></tr>

                      </table>
                    </td></tr>
                  </table>
                </body>
                </html>
                `
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
            message: "user Registerd Successfully ",
            success: true,
            user: {
                Id: User._id,
                username: User.username,
                email: User.email
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


//get Me
export async function getme(req, res) {
    const userid = req.user._id

    const user = await userModel.findById(userid).select("-password")

    if (!user) {
        return res.status(404).json({
            message: "User Not Found",
            success: false,
        })
    }
    return res.status(200).json({
        message: "User Found",
        success: true,
        user
    })

}

// email verification    

export async function verifyEmail(req, res) {
    try {
        const { token } = req.query;

        const decode = Jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findOne({ email: decode.email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid Token",
                success: false,
                err: "User Not Found"
            });
        }

    user.verified = true;
        await user.save();

        const html = `
        <!DOCTYPE html>
        <html>
        <head><title>Email Verified - QueryNest AI</title></head>
        <body style="font-family: sans-serif; background: #f4f4f4; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0;">
            <div style="background: white; padding: 40px; border-radius: 12px; text-align: center; max-width: 420px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                <div style="font-size: 60px; margin-bottom: 10px;">✅</div>
                <h2 style="color: #2d2d2d; margin-bottom: 8px;">Email Verified Successfully!</h2>
                <p style="color: #555;">Hi <strong>${user.username}</strong>,</p>
                <p style="color: #555;">Your email has been verified. You can now login and use all features of <strong>QueryNest-AI</strong>.</p>
                <a href="http://localhost:5173/login" 
                   style="display: inline-block; margin-top: 20px; padding: 12px 32px; background: #4f46e5; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                   Go to Login
                </a>
                <p style="color: #aaa; font-size: 12px; margin-top: 24px;">QueryNest Team</p>
            </div>
        </body>
        </html>
        `;

        return res.status(200).send(html);

    } catch (error) {
        return res.status(400).json({
            message: "Invalid or expired token",
            success: false,
            error: error.message,
        });
    }
}



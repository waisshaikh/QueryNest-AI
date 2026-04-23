import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";    

export async function authMiddleware(req, res, next) {
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({
            message: "Unauthorized",
            success: false,
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({
                message: "Unauthorized",
                success: false,
            });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized",
            success: false,
        });
    }
}
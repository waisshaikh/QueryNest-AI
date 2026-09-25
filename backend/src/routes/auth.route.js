import { Router } from "express";
import {login, register, getme, verifyEmail} from "../Controller/auth.controller.js";
import {registerValidator,loginValidator} from"../validators/auth.validator.js"
import { authMiddleware } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register",registerValidator,register);


authRouter.post("/login",loginValidator,login);

authRouter.get("/get-me", authMiddleware,getme)
    
authRouter.get("/verify-email", verifyEmail);


export default authRouter; 
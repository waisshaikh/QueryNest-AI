import { Router } from "express";
import { register } from "../Controller/auth.controller.js";
import {registerValidator} from"../validators/auth.validator.js"

const authRouter = Router();


authRouter.post("/register",registerValidator,register)


export default authRouter; 
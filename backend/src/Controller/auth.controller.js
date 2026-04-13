import { syncIndexes } from "mongoose";
import userModel from "../models/user.model.js";
import Jwt from "jsonwebtoken";

export async function register ( ) {
    const {username,email,password} = req.body

    const userAlreadyExist = await userModel.findOne({$or:[{username},{email}]});

    if(userAlreadyExist){
        return res.status(400).json({
            message:"User Already exist",
            success: false,
            err: "user Already exist"
        });
    }

    const User = await userModel.create({username,email,password})

    
    
}
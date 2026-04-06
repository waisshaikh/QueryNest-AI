import userModel from "../models/user.model.js";

import jwt from "jsonwebtoken";

export async function register(req,res) {
    const {username,password,email}=req.body;
    
    const isUserExist = await userModel.findOne({
        $or:[{username},{email}]
    })
    if(isUserExist){
        res.status(402).json({
            "message": "User Alreday Exist with this email",
            success:false,
            
        })
    }

    const User = userModel.create({username ,email ,password})
    
    
}

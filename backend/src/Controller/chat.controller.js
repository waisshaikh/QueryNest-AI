import { response } from "express"
import { generateResponse, generateChatTittle } from "../services/ai.service.js"
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js"
import { AIMessageChunk } from "@langchain/core/messages";


export async function sendMessage (req,res){

    const {message} = req.body  

    const tittle = await generateChatTittle(message);
    console.log(tittle)

    const result  = await generateResponse(message);

    const chat = await chatModel.create({
        user: req.user._id,
        tittle
    })

    const userMessage = await messageModel.create({
        chat:chat.id,
        content:result,
        role:"user"
    })
   
    const aiMessage = await messageModel.create({
        chat: chat.id,
        content:result,
        role:"ai"
    })

   res.status(201).json({
     tittle,
    chat,
    aiMessage
})

}
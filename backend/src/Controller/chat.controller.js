import { response } from "express"
import { generateResponse, generateChatTittle } from "../services/ai.service.js"
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js"
import { AIMessageChunk } from "@langchain/core/messages";


export async function sendMessage (req,res){

    const {message,chat:chatId} = req.body  

    let tittle = null , chat = null

    if(!chatId){
     tittle = await generateChatTittle(message);

     chat = await chatModel.create({
        user: req.user._id,
        tittle
    });
        
    }

    const activeChatId = chatId || chat._id;

    const userMessage = await messageModel.create({
        chat: activeChatId,
        content: message,
        role:"user"
    })
   
    const messages = await messageModel.find({chat: activeChatId})

    const result  = await generateResponse(messages);
   
    const aiMessage = await messageModel.create({
        chat: activeChatId,
        content: result,
        role:"ai"
    })

   res.status(201).json({
     tittle,
    chat,
    aiMessage
})

}
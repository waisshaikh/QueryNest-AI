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

export async function getChats(req,res) {
    const user = req.user
    const chats = await chatModel.find({user:user.id})

    res.status(200).json({
        message:"Chat recive successfully",
        chats  
    });
   
}

export async function getMessages(req,res){
    const {chatId} = req.params

    const chat = await chatModel.findOne({
        _id:chatId,
        user:req.user.id
    })

    if(!chat){
        return res.status(404).json({
            message:"chat not found"
        })
    }

    const messages= await messageModel.find({
        chat:chatId
    })
    res.status(200).json({
        message:"messages retrived successfully",
        messages
    })
}

export async function deleteChat(req,res) {
    const {chatId}= req.params;
    const chat = await chatModel.findOneAndDelete({
        _id:chatId,
        user:req.user.id
    })

     await messageModel.deleteMany({
        chat:chatId
    })

    if(!chat){
        return res.status(400).json({
            message:"chat Not Found"
        })
    }
   
    res.status(200).json({
        message:"chat Deleted Successfully"
    })

    
}


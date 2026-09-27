import { response } from "express"
import { generateResponse, generateChatTittle } from "../services/ai.service.js"
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js"
import { AIMessageChunk } from "@langchain/core/messages";


export async function sendMessage (req,res){
    try {
        const { message, chat, chatId: reqChatId } = req.body;
        const activeChatIdInput = chat || reqChatId;

        let tittle = null;
        let newChatObj = null;

        if(!activeChatIdInput){
            tittle = await generateChatTittle(message);
            newChatObj = await chatModel.create({
                user: req.user._id || req.user.id,
                tittle,
                title: tittle
            });
        }

        const activeChatId = activeChatIdInput || newChatObj._id;

        const userMessage = await messageModel.create({
            chat: activeChatId,
            content: message,
            role: "user"
        });
       
        const messages = await messageModel.find({ chat: activeChatId }).sort({ createdAt: 1 });

        const result = await generateResponse(messages);
       
        const aiMessage = await messageModel.create({
            chat: activeChatId,
            content: result,
            role: "ai"
        });

        res.status(201).json({
            tittle,
            chat: newChatObj,
            userMessage,
            aiMessage
        });
    } catch (error) {
        console.error("Error in sendMessage controller:", error);
        res.status(500).json({ message: "Failed to send message", error: error.message });
    }
}

export async function getChats(req,res) {
    try {
        const userId = req.user._id || req.user.id;
        const chats = await chatModel.find({ user: userId }).sort({ updatedAt: -1 });

        res.status(200).json({
            message: "Chats retrieved successfully",
            chats  
        });
    } catch (error) {
        console.error("Error in getChats controller:", error);
        res.status(500).json({ message: "Failed to fetch chats", error: error.message });
    }
}

export async function getMessages(req,res){
    try {
        const { chatId } = req.params;
        const userId = req.user._id || req.user.id;

        const chat = await chatModel.findOne({
            _id: chatId,
            user: userId
        });

        if(!chat){
            return res.status(404).json({
                message: "Chat not found"
            });
        }

        const messages = await messageModel.find({
            chat: chatId
        }).sort({ createdAt: 1 });

        res.status(200).json({
            message: "Messages retrieved successfully",
            messages
        });
    } catch (error) {
        console.error("Error in getMessages controller:", error);
        res.status(500).json({ message: "Failed to fetch messages", error: error.message });
    }
}

export async function deleteChat(req,res) {
    try {
        const { chatId } = req.params;
        const userId = req.user._id || req.user.id;

        const chat = await chatModel.findOneAndDelete({
            _id: chatId,
            user: userId
        });

        await messageModel.deleteMany({
            chat: chatId
        });

        if(!chat){
            return res.status(404).json({
                message: "Chat not found"
            });
        }
       
        res.status(200).json({
            message: "Chat deleted successfully"
        });
    } catch (error) {
        console.error("Error in deleteChat controller:", error);
        res.status(500).json({ message: "Failed to delete chat", error: error.message });
    }
}



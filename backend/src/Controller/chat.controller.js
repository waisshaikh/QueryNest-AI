import { response } from "express"
import { generateResponse, generateChatTitle } from "../services/ai.service.js"
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js"
import { AIMessageChunk } from "@langchain/core/messages";


export async function sendMessage (req,res){
    try {
        const { message, chat, chatId: reqChatId } = req.body;
        const userId = req.user._id || req.user.id;
        let activeChatIdInput = chat || reqChatId;

        let title = null;
        let newChatObj = null;
        let activeChatId = null;

        if (activeChatIdInput) {
            // Verify existing chat belongs to user
            const existingChat = await chatModel.findOne({
                _id: activeChatIdInput,
                user: userId
            });
            if (existingChat) {
                activeChatId = existingChat._id;
            }
        }

        if (!activeChatId) {
            title = await generateChatTitle(message);
            newChatObj = await chatModel.create({
                user: userId,
                title
            });
            activeChatId = newChatObj._id;
        }

        // 1. Save User Message
        const userMessage = await messageModel.create({
            chat: activeChatId,
            content: message,
            role: "user"
        });
       
        // 2. Retrieve existing messages for AI context
        const messages = await messageModel.find({ chat: activeChatId }).sort({ createdAt: 1 });

        // 3. Generate AI response safely
        let aiContent = "";
        try {
            aiContent = await generateResponse(messages);
        } catch (aiErr) {
            console.error("AI Generation Error in sendMessage:", aiErr);
            aiContent = "I'm sorry, I encountered an issue generating a response right now. Please try again.";
        }

        // 4. Save AI Message
        const aiMessage = await messageModel.create({
            chat: activeChatId,
            content: aiContent,
            role: "ai"
        });

        // 5. Update Chat timestamp to push to top of history
        await chatModel.findByIdAndUpdate(activeChatId, { updatedAt: new Date() });

        res.status(201).json({
            title: title || (newChatObj ? newChatObj.title : null),
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



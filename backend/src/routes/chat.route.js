import {Router} from "express";
import { sendMessage, getChats, getMessages,deleteChat } from "../Controller/chat.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const chatRouter = Router();

chatRouter.post("/message", authMiddleware, sendMessage);
chatRouter.get("/", authMiddleware, getChats);
chatRouter.get("/:chatId/messages", authMiddleware, getMessages);
chatRouter.delete("/delete/:chatId/messages", authMiddleware,deleteChat);

export default chatRouter;
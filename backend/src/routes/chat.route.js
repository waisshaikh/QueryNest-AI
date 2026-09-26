import {Router} from "express";
import { sendMessage, getChats,getMessages } from "../Controller/chat.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const chatRouter = Router()

chatRouter.post("/message",authMiddleware,sendMessage)

chatRouter.get("/", authMiddleware,sendMessage)


chatRouter.get("/:chatId/messages", authMiddleware,getMessages)




export default chatRouter
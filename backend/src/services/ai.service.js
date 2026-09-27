import dotenv from "dotenv"
dotenv.config()
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";



import dotenv from "dotenv";
dotenv.config();
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";

const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const geminiModel = new ChatGoogleGenerativeAI({
  model: modelName,
  apiKey: process.env.GEMINI_API_KEY,
  maxRetries: 2,
});

export async function generateResponse(messages) {
  try {
    const formattedMessages = messages
      .map((msg) => {
        if (msg.role === "user") {
          return new HumanMessage(msg.content);
        } else if (msg.role === "ai") {
          return new AIMessage(msg.content);
        }
        return null;
      })
      .filter(Boolean);

    const response = await geminiModel.invoke(formattedMessages);
    return response.text;
  } catch (error) {
    console.error("Gemini AI Primary Model Error:", error.message);
    // Fallback to gemini-1.5-flash if primary model fails
    try {
      const fallbackModel = new ChatGoogleGenerativeAI({
        model: "gemini-1.5-flash",
        apiKey: process.env.GEMINI_API_KEY,
        maxRetries: 1,
      });
      const formattedMessages = messages
        .map((msg) => {
          if (msg.role === "user") return new HumanMessage(msg.content);
          if (msg.role === "ai") return new AIMessage(msg.content);
          return null;
        })
        .filter(Boolean);
      const fallbackResponse = await fallbackModel.invoke(formattedMessages);
      return fallbackResponse.text;
    } catch (fallbackError) {
      console.error("Gemini AI Fallback Error:", fallbackError.message);
      throw new Error(`AI Service Error: ${error.message}`);
    }
  }
}

export async function generateChatTittle(message) {
  try {
    const response = await geminiModel.invoke([
      new SystemMessage(`You are a helpful assistant that generates a concise and interesting title for a chat conversation in 2 to 5 words. Do not use quotes or punctuation.`),
      new HumanMessage(`First message: "${message}"`),
    ]);
    return response.text.trim().replace(/^["']|["']$/g, '');
  } catch (error) {
    console.warn("Failed to generate chat title with AI, using fallback title:", error.message);
    // Safe fallback title from first few words of user message
    const words = message.trim().split(/\s+/).slice(0, 4).join(" ");
    return words ? (words.length > 30 ? words.slice(0, 30) + "..." : words) : "New Conversation";
  }
}


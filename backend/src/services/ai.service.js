import dotenv from "dotenv"
dotenv.config()
import { ChatGoogleGenerativeAI   } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";


const modelName = process.env.GEMINI_MODEL || "gemini-3.6-flash";

const geminiModel = new ChatGoogleGenerativeAI({
  model: modelName,
  apiKey: process.env.GEMINI_API_KEY,
  maxRetries: 2,
});

const groqModel = new ChatGroq({
  model: "qwen/qwen3.8-27b",
  apiKey: process.env.GROQ_API_KEY,
  temperature: 0.3,
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

export async function generateChatTitle(message) {
  try {
    const response = await groqModel.invoke([
      new SystemMessage(
        `You are a helpful assistant that generates concise and interesting titles for any chat in 2 to 5 words.
      The title should be clear, relevant, and engaging without quotes or punctuation.`
      ),

      new HumanMessage(
        `First message: "${message}"`
      ),
    ]);

    return response.content
      .toString()
      .trim()
      .replace(/^["']|["']$/g, "");

  } catch (error) {
    console.warn(
      "Failed to generate chat title with Groq, using fallback title:",
      error.message
    );

    const words = message
      .trim()
      .split(/\s+/)
      .slice(0, 4)
      .join(" ");

    return words
      ? words.length > 30
        ? words.slice(0, 30) + "..."
        : words
      : "New Conversation";
  }
}


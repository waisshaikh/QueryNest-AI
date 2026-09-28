import dotenv from "dotenv";
dotenv.config();
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { createAgent } from "langchain";
import * as z from "zod";
import { searchInternet } from "./internet.service.js";

// const modelName = process.env.GEMINI_MODEL || "gemini-3.6-flash";

// const geminiModel = new ChatGoogleGenerativeAI({
//   model: modelName,
//   apiKey: process.env.GEMINI_API_KEY,
//   maxRetries: 2,
// });

const groqModel = new ChatGroq({
  model: process.env.GROQ_MODEL || "qwen/qwen3.8-27b",
  apiKey: process.env.GROQ_API_KEY,
  temperature: 0.3,
  maxRetries: 2,
});

const searchInternetTool = tool(
  async ({ query }) => {
    return await searchInternet(query);
  },
  {
    name: "searchInternet",
    description: "use this tool to get the latest information from the internet.",
    schema: z.object({
      query: z.string().describe("the Search query to look up on the internet."),
    }),
  }
);

const agent = createAgent({
  // model: geminiModel,
  model: groqModel,
  tools: [searchInternetTool],
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

    const response = await agent.invoke({
      messages: formattedMessages,
    });

    const lastMessage = response.messages[response.messages.length - 1];
    return typeof lastMessage.content === "string"
      ? lastMessage.content
      : lastMessage.text || JSON.stringify(lastMessage.content);
  } catch (error) {
    console.error("Agent generateResponse Error:", error.message);
    try {
      const formattedMessages = messages
        .map((msg) => {
          if (msg.role === "user") return new HumanMessage(msg.content);
          if (msg.role === "ai") return new AIMessage(msg.content);
          return null;
        })
        .filter(Boolean);

      // const fallbackResponse = await geminiModel.invoke(formattedMessages);
      // return typeof fallbackResponse.content === "string"
      //   ? fallbackResponse.content
      //   : fallbackResponse.text;

      const fallbackResponse = await groqModel.invoke(formattedMessages);
      return typeof fallbackResponse.content === "string"
        ? fallbackResponse.content
        : fallbackResponse.text;
    } catch (fallbackError) {
      console.error("Groq AI Fallback Error:", fallbackError.message);
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
      new HumanMessage(`First message: "${message}"`),
    ]);

    const titleText = typeof response.content === "string" ? response.content : response.text || "";
    return titleText
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

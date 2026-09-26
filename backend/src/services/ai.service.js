import dotenv from "dotenv"
dotenv.config()
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";



const model = new ChatGoogleGenerativeAI({
  model: "gemini-3.5-flash",
  apiKey: process.env.GEMINI_API_KEY
});

export async function generateResponse(message) {
  
  const response = await model.invoke([
    new HumanMessage(message)
  ]);

  return response.text

}
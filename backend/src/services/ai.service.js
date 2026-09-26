import dotenv from "dotenv"
dotenv.config()
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";



const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-3.6-flash",
  apiKey: process.env.GEMINI_API_KEY
});



export async function generateResponse(message) {

  const response = await geminiModel.invoke([
    new HumanMessage(message)
  ]);

  return response.text
}



export async function generateChatTittle(message) {

  const response = await geminiModel.invoke([

    new SystemMessage(` you are a helpfull assistant that generate concise and intresting title
      for any chat in less than 5 words.

      user will provide you the first message of a chat conversation,
      and you will  generate a tittle that capture the essence of convarsaton in 2 to 5 words.
      the tittle should be clear, relavent, and engaging, giving users a quick understanding of what the chat is about
      
    `),
    new HumanMessage(`
      generate  a tittle  for a chat conversation based on the following first message
      " ${message} " 
      `)
  ])

  return response.text

}

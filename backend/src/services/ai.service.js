import dotenv from "dotenv"
dotenv.config()
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";



const model = new ChatGoogleGenerativeAI({
  model: "gemini-3.6-flash",
  apiKey: process.env.GEMINI_API_KEY
});

export async function testAi() {
  model.invoke("what is thermo dynamics explain under 100 words?").then((response)=>{
    console.log(response.text)
  })

}
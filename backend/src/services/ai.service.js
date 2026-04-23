import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export async function testAi() {

  const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite",
    apiKey: process.env.GOOGLE_API_KEY,
  });

  const response = await model.invoke("okay, tell me a joke");
  console.log(response.content);
}
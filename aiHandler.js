import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.TOGETHER_API_KEY,
});

export async function getAIResponse(message) {
  try {
    const response = await openai.chat.completions.create({
      model: "meta-llama/Llama-3-8b-chat-hf",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: message },
      ],
    });

    return response.choices[0].message.content;
  } catch (err) {
    console.error(err);
    return "❌ Sorry, AI se jawab nahi mila.";
  }
}

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
export async function callGemini(messages) {
    const model = new ChatGoogleGenerativeAI({
        model: "gemini-2.5-flash",
        maxOutputTokens: 1000,
        apiKey: process.env.GEMINI_API_KEY,
    });
    const response = await model.invoke(messages);
    return response.content;
}

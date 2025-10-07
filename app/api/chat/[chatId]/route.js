import dotenv from "dotenv";
import { auth } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, AIMessage, SystemMessage } from "langchain/schema";
import { NextResponse } from "next/server";

import { MemoryManager } from "@/lib/memory";
import { ratelimit } from "@/lib/rate-limit";
import prismadb from "@/lib/prismadb";

dotenv.config({ path: `.env` });

export async function POST(request, { params }) {
  try {
    const { prompt } = await request.json();
    const user = await currentUser();

    if (!user || !user.firstName || !user.id) {
      return new NextResponse("Unauthorized!", { status: 401 });
    }

    const resolvedParams = await params;
    const { chatId } = resolvedParams;
    if (!chatId) {
      return new NextResponse("Missing chatId", { status: 400 });
    }

    const identifier = `${request.url}-${user.id}`;
    const { success } = await ratelimit(identifier);
    if (!success) {
      return new NextResponse("Rate limit Exceeded!", { status: 429 });
    }

    const companion = await prismadb.companion.findUnique({
      where: { id: chatId },
    });

    if (!companion) {
      return new NextResponse("Companion Not Found.", { status: 404 });
    }

    const name = companion.id;
    const companionKey = {
      companionName: name,
      userId: user.id,
      modelName: "gemini-2.5-flash",
    };

    const memoryManager = await MemoryManager.getInstance();
    const recentChatHistory = await memoryManager.readLatestHistory(
      companionKey
    );

    if (recentChatHistory.length === 0) {
      await memoryManager.seedChatHistory(companion.seed, "\n\n", companionKey);
    }

    await memoryManager.writeToHistory(`User: ${prompt}\n`, companionKey);

    let recentChatHistoryStr = await memoryManager.readLatestHistory(
      companionKey
    );

    const systemPrompt = `
      ONLY generate plain sentences without prefix of who is speaking. DO NOT use ${companion.name}: prefix.
      ${companion.instructions}
      Below is the relevant chat history:
      ${recentChatHistoryStr}
    `;

    const historyMessages = recentChatHistoryStr
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line) => {
        if (line.startsWith("User:")) {
          return new HumanMessage(line.replace("User:", "").trim());
        } else {
          return new AIMessage(line.replace(`${companion.name}:`, "").trim());
        }
      });

    const model = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      maxOutputTokens: 2048,
      apiKey: process.env.GEMINI_API_KEY,
    });

    const modelResponse = await model.invoke([
      new SystemMessage(systemPrompt),
      ...historyMessages,
    ]);

    const aiResponse =
      modelResponse?.content?.toString() ||
      "Sorry, I couldn't generate a response.";

    console.log("DEBUG AI RESPONSE");
    console.log("modelResponse:", modelResponse);
    console.log("modelResponse.content:", modelResponse?.content);
    console.log("aiResponse:", aiResponse);
    console.log("aiResponse length:", aiResponse?.length);
    console.log("aiResponse trimmed:", aiResponse.trim());
    console.log("=== END DEBUG ===");

    const formattedAiResponse = `${companion.name}: ${aiResponse.trim()}`;
    await memoryManager.writeToHistory(formattedAiResponse, companionKey);

    await prismadb.companion.update({
      where: { id: chatId },
      data: {
        messages: {
          create: {
            content: prompt,
            role: "user",
            userId: user.id,
          },
        },
      },
    });

    await prismadb.companion.update({
      where: { id: chatId },
      data: {
        messages: {
          create: {
            content: aiResponse.trim(),
            role: "system",

            userId: user.id,
          },
        },
      },
    });

    return NextResponse.json({ text: aiResponse });
  } catch (error) {
    console.error("[CHAT_POST_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

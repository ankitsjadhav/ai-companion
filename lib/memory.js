import { Redis } from "@upstash/redis";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/community/vectorstores/pinecone";

export class MemoryManager {
  static instance;

  history;
  vectorDBClient;

  constructor() {
    this.history = Redis.fromEnv();

    this.vectorDBClient = new Pinecone();
  }

  async init() {}

  async vectorSearch(recentChatHistory, companionFileName) {
    const pineconeClient = this.vectorDBClient;

    const pineconeIndex = pineconeClient.index(
      process.env.PINECONE_INDEX || ""
    );

    const vectorStore = await PineconeStore.fromExistingIndex(
      new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GEMINI_API_KEY,
      }),
      { pineconeIndex }
    );

    const similarDocs = await vectorStore
      .similaritySearch(recentChatHistory, 3, { fileName: companionFileName })
      .catch((err) =>
        console.error("Failed to Get Vector Search Results.", err)
      );

    return similarDocs;
  }

  static async getInstance() {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();

      await MemoryManager.instance.init();
    }
    return MemoryManager.instance;
  }

  generateRedisCompanionKey(companionKey) {
    return `${companionKey.companionName}-${companionKey.modelName}-${companionKey.userId}`;
  }

  async writeToHistory(text, companionKey) {
    if (!companionKey || typeof companionKey.userId === "undefined") {
      console.error("Companion Key Set Incorrectly!");
      return "";
    }

    const key = this.generateRedisCompanionKey(companionKey);
    const result = await this.history.zadd(key, {
      score: Date.now(),
      member: text,
    });

    return result;
  }

  async readLatestHistory(companionKey) {
    if (!companionKey || typeof companionKey.userId === "undefined") {
      console.error("Companion Key Set Incorrectly!");
      return "";
    }

    const key = this.generateRedisCompanionKey(companionKey);
    let result = await this.history.zrange(key, 0, Date.now(), {
      byScore: true,
    });

    result = result.slice(-30).reverse();
    const recentChats = result.join("\n");
    return recentChats;
  }

  async seedChatHistory(seedContent, delimiter = "\n", companionKey) {
    const key = this.generateRedisCompanionKey(companionKey);
    if (await this.history.exists(key)) {
      console.log("User Already Has Chat History.");
      return;
    }

    const content = seedContent.split(delimiter);
    let counter = 0;
    for (const line of content) {
      await this.history.zadd(key, { score: counter, member: line });
      counter += 1;
    }
  }
}

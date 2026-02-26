import Groq from "groq-sdk";
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});
export async function callGroq(messages) {
    const formattedMessages = messages.map((msg) => {
        if (msg._getType() === "human") {
            return { role: "user", content: msg.content };
        } else if (msg._getType() === "system") {
            return { role: "system", content: msg.content };
        } else if (msg._getType() === "ai") {
            return { role: "assistant", content: msg.content };
        }
        return { role: "user", content: msg.content };
    });
    const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 1000,
    });
    return completion.choices[0].message.content;
}

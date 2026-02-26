import { callGemini } from "./gemini";
import { callGroq } from "./groq";
let geminiBlockedUntil = null;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
function getNextDailyResetTime() {
    const nextReset = new Date();
    nextReset.setUTCHours(8, 0, 0, 0);
    if (Date.now() > nextReset.getTime()) {
        nextReset.setUTCDate(nextReset.getUTCDate() + 1);
    }
    return nextReset.getTime();
}
function isQuotaError(err) {
    const msg = err?.message?.toLowerCase() || "";
    const status = err?.response?.status || err?.status;
    return status === 429 || msg.includes("quota") || msg.includes("too many requests") || msg.includes("429");
}
async function fetchWithRetry(fn, retries = 2, baseDelay = 2000) {
    let attempt = 0;
    while (attempt <= retries) {
        try {
            return await fn();
        } catch (err) {
            if (isQuotaError(err) && attempt < retries) {
                attempt++;
                const waitTime = baseDelay * attempt;
                await delay(waitTime);
            } else {
                throw err;
            }
        }
    }
}
export async function generateResponse(messages) {
    if (geminiBlockedUntil && Date.now() < geminiBlockedUntil) {
        return callGroq(messages);
    }
    try {
        return await fetchWithRetry(() => callGemini(messages), 2, 2000);
    } catch (err) {
        if (isQuotaError(err)) {
            const isDailyLimit = err.message.toLowerCase().includes("per day");
            if (isDailyLimit) {
                geminiBlockedUntil = getNextDailyResetTime();
            } else {
                geminiBlockedUntil = Date.now() + 60 * 1000;
            }
        }
        return callGroq(messages);
    }
}

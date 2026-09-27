import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config({ path: './config/.env' });

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000;
const TIMEOUT_MS = 20000; 

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function callGroq(text, prompt) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GROQ_API_KEY in config/.env");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: text }
        ],
        response_format: { type: "json_object" }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    return res;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new Error("Groq API request timed out");
    }
    throw err;
  }
}

export async function generateAIResponse(text, prompt, retryCount = 0) {
  const res = await callGroq(text, prompt);
  const data = await res.json();

  if (!res.ok) {
    const isRetryable = res.status === 429 || res.status >= 500;

    if (isRetryable && retryCount < MAX_RETRIES) {
      await sleep(RETRY_DELAY_MS * (retryCount + 1)); // 1s, then 2s
      return generateAIResponse(text, prompt, retryCount + 1);
    }

    throw new Error(data.error?.message || "Groq API error");
  }

  return data.choices[0].message.content;
}
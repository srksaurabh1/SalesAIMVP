import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const GROQ_API_URL = process.env.GROQ_API_URL;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL   = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

if (!GROQ_API_URL) {
  console.warn("GROQ_API_URL not set; groqClient will be a stub in local dev.");
}

export async function queryGroq(prompt: string, options: any = {}) {
  if (!GROQ_API_URL) return { error: "no_groq_url", prompt };

  const payload = {
    model: GROQ_MODEL,
    messages: [{ role: "user", content: prompt }],
    ...options,
  };

  const res = await axios.post(
    GROQ_API_URL,
    payload,
    {
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      timeout: 20_000,
    }
  );

  return res.data;
}

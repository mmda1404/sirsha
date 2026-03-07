import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  baseURL: "https://openrouter.ai/api",
  defaultHeaders: {
    "HTTP-Referer": "https://gravityclaw.com",
    "X-Title": "Gravity Claw"
  }
});

async function main() {
  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-latest",
      max_tokens: 10,
      messages: [{ role: "user", content: "Hello" }]
    });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}
main();

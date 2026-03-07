import dotenv from "dotenv";
dotenv.config();

async function main() {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.ANTHROPIC_API_KEY}`,
        "HTTP-Referer": "https://gravityclaw.com",
        "X-Title": "Gravity Claw",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "anthropic/claude-3.5-sonnet",
        "messages": [
          {"role": "user", "content": "What is the meaning of life?"}
        ]
      })
    });
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
main();

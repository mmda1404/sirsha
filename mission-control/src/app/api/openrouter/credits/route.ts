import { NextResponse } from "next/server";

export async function GET() {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || !apiKey.startsWith('sk-or-')) {
        return NextResponse.json({ error: "OpenRouter API key not configured or invalid" }, { status: 500 });
    }

    try {
        const response = await fetch("https://openrouter.ai/api/v1/credits", {
            headers: {
                "Authorization": `Bearer ${apiKey}`,
            },
        });

        if (!response.ok) {
            throw new Error(`OpenRouter API error: ${response.statusText}`);
        }

        const data = await response.json();
        const { total_credits, total_usage } = data.data;
        return NextResponse.json({
            total_credits,
            total_usage,
            remaining_credits: total_credits - total_usage,
        });
    } catch (error) {
        console.error("Error fetching OpenRouter credits:", error);
        return NextResponse.json({ error: "Failed to fetch credits" }, { status: 500 });
    }
}

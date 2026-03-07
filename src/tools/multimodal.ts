import fs from 'fs';
import OpenAI from 'openai';
import { config } from '../config.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

export async function parsePdfDocument(filePath: string): Promise<string> {
    const pdfParse = require('pdf-parse');
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
}

export async function analyzeImageFile(filePath: string, prompt: string = "Describe this image in comprehensive detail. Identify every element you can see — text, charts, graphs, products, people, UI elements, data, context, and anything else relevant."): Promise<string> {
    const apiKey = config.openRouterApiKey || (config.anthropicApiKey?.startsWith('sk-or-') ? config.anthropicApiKey : config.openaiApiKey);
    if (!apiKey) {
        throw new Error("No Vision-capable API key found for image analysis.");
    }

    const isOpenRouter = !config.openaiApiKey || config.anthropicApiKey?.startsWith('sk-or-');

    const client = new OpenAI({
        apiKey,
        baseURL: isOpenRouter ? "https://openrouter.ai/api/v1" : undefined,
        defaultHeaders: isOpenRouter ? { "HTTP-Referer": "https://sirsha.ai", "X-Title": "Sirsha" } : undefined,
    });

    const base64Image = fs.readFileSync(filePath, { encoding: 'base64' });
    const mimeType = filePath.endsWith('.png') ? 'image/png' : 'image/jpeg';
    const dataUri = `data:${mimeType};base64,${base64Image}`;

    // Use  the correct model ID format for each provider
    // OpenRouter: "anthropic/claude-3.5-sonnet" (no 'openrouter/' prefix)
    // OpenAI direct: "gpt-4o"
    const modelToUse = isOpenRouter ? "anthropic/claude-3.5-sonnet" : "gpt-4o";

    const response = await client.chat.completions.create({
        model: modelToUse,
        max_tokens: 2048,
        messages: [
            {
                role: "user",
                content: [
                    { type: "text", text: prompt },
                    { type: "image_url", image_url: { url: dataUri } }
                ]
            }
        ]
    });

    return response.choices[0].message.content || "Empty description.";
}


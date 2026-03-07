import { config } from "../config.js";
import fs from "fs";
import { FormData } from "formdata-node";
import { fileFromPath } from "formdata-node/file-from-path";

export async function transcribeAudio(audioFilePath: string): Promise<string> {
    if (!config.groqApiKey) {
        throw new Error("Groq API key missing for transcription.");
    }

    const form = new FormData();
    form.append("file", await fileFromPath(audioFilePath));
    form.append("model", "whisper-large-v3");

    const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${config.groqApiKey}`,
        },
        body: form as any,
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Groq Transcription API error: ${response.status} ${errText}`);
    }

    const data = await response.json() as { text: string };
    return data.text;
}

export async function generateSpeech(text: string, outputFilePath: string): Promise<void> {
    if (!config.groqApiKey) {
        throw new Error("Groq API key missing for TTS.");
    }

    const response = await fetch("https://api.groq.com/openai/v1/audio/speech", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${config.groqApiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "canopylabs/orpheus-v1-english",
            input: text,
            response_format: "wav",
            voice: "autumn"
        })
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Groq TTS API error: ${response.status} ${errText}`);
    }

    const buffer = await response.arrayBuffer();
    fs.writeFileSync(outputFilePath, Buffer.from(buffer));
}

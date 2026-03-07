import { Bot, Context, NextFunction, InputFile } from "grammy";
import { config } from "../config.js";
import { runAgentLoop } from "../agent/loop.js";

export const bot = new Bot(config.telegramBotToken);

// SEC-REQ: User ID Whitelist Middleware
bot.use(async (ctx: Context, next: NextFunction) => {
    const userId = ctx.from?.id;

    if (!userId || !config.telegramUserIdWhitelist.includes(userId)) {
        console.warn(`[SECURITY] Unauthorized access attempt from user ID: ${userId}`);
        // Silently ignore other users
        return;
    }

    await next();
});

const userSettings = new Map<number, { model: string, thinkingLevel: string }>();

/**
 * Helper to keep 'typing' status active during long-running agent tasks
 */
function withTyping(ctx: Context, action: "typing" | "upload_voice" | "upload_photo" | "upload_document" = "typing") {
    const interval = setInterval(() => {
        ctx.replyWithChatAction(action).catch(() => { });
    }, 4000);
    ctx.replyWithChatAction(action).catch(() => { });

    return () => clearInterval(interval);
}

bot.command("start", async (ctx) => {
    await ctx.reply("Welcome to Sirsha. Use /model to switch LLM and /think to adjust reasoning level.");
});

bot.command("model", async (ctx) => {
    const userId = ctx.from?.id;
    if (!userId) return;
    const model = ctx.match;
    if (!model) {
        let msg = "🤖 *Available Providers:*\n";
        msg += "• `auto` (Default: Smart Routing)\n";
        msg += "• `openrouter/moonshotai/kimi-k2.5`\n";
        msg += "• `openrouter/anthropic/claude-sonnet-4.6`\n";
        msg += "• `openrouter/anthropic/claude-opus-4.6`\n";
        msg += "• `openrouter/openai/gpt-5.3`\n\n";
        msg += "Usage: `/model <provider>/<name>` or `/model auto`";
        await ctx.reply(msg, { parse_mode: "Markdown" });
        return;
    }
    const settings = userSettings.get(userId) || { model: "auto", thinkingLevel: 'off' };
    settings.model = model.toLowerCase();
    userSettings.set(userId, settings);
    await ctx.reply(`✅ Primary model switched to: \`${settings.model}\``, { parse_mode: "Markdown" });
});

bot.command("new", async (ctx) => {
    const userId = ctx.from?.id;
    if (!userId) return;
    clearSession(userId);
    saveSessionSummary(userId, "");
    await ctx.reply("✨ *New session started.* Conversation history has been cleared.", { parse_mode: "Markdown" });
});

bot.command("status", async (ctx) => {
    const userId = ctx.from?.id;
    if (!userId) return;

    const uptime = Math.floor(process.uptime() / 60);
    const whitelistCount = config.telegramUserIdWhitelist.length;
    const hasAnthropic = !!config.anthropicApiKey;
    const hasOpenAI = !!config.openaiApiKey;
    const hasOpenRouter = !!config.openRouterApiKey;

    let status = "🛡️ *Sirsha Status*\n\n";
    status += `• *Uptime:* ${uptime}m\n`;
    status += `• *Whitelist:* ${whitelistCount} user(s) active\n`;
    status += `• *Providers:* ${hasAnthropic ? '✅' : '❌'} Anthropic, ${hasOpenAI ? '✅' : '❌'} OpenAI, ${hasOpenRouter ? '✅' : '❌'} OpenRouter\n`;
    status += `• *Primary Model:* \`${config.primaryModel}\`\n`;
    status += `• *User Model:* \`${userSettings.get(userId)?.model || 'Default'}\`\n`;
    status += `• *Memory:* SQLite + Pinecone Active\n`;

    await ctx.reply(status, { parse_mode: "Markdown" });
});

bot.command("usage", async (ctx) => {
    // Feature 4: Usage Tracking is not yet implemented, providing a placeholder.
    await ctx.reply("📊 *Usage Tracking Statistics*\n\n_Usage logging is currently being implemented. Check back soon for cost and token breakdowns._", { parse_mode: "Markdown" });
});

bot.command("think", async (ctx) => {
    const userId = ctx.from?.id;
    if (!userId) return;
    const level = ctx.match?.toLowerCase();
    if (!['off', 'low', 'medium', 'high'].includes(level)) {
        await ctx.reply("Usage: /think <off|low|medium|high>");
        return;
    }
    const settings = userSettings.get(userId) || { model: config.primaryModel, thinkingLevel: 'off' };
    settings.thinkingLevel = level;
    userSettings.set(userId, settings);
    await ctx.reply(`🧠 Thinking level set to: ${level}`);
});

import { clearSession, getSessionMessages, saveSessionSummary } from "../db.js";
import { callLLMWithFailover } from "../agent/llm_provider.js";

bot.command("clear", async (ctx) => {
    const userId = ctx.from?.id;
    if (!userId) return;
    clearSession(userId);
    saveSessionSummary(userId, "");
    await ctx.reply("🧹 Conversation history cleared.");
});

bot.command("compact", async (ctx) => {
    const userId = ctx.from?.id;
    if (!userId) return;

    await ctx.reply("📦 *Compacting conversation history...*", { parse_mode: "Markdown" });
    try {
        const history = getSessionMessages(userId, 50);
        if (history.length === 0) {
            await ctx.reply("No history to compact.");
            return;
        }

        const summaryPrompt = [
            { role: "system", content: "You are a helpful assistant. Summarize the following conversation history into a concise context block that retains all important facts, preferences, and ongoing topics. This will be used as long-term context for future messages." },
            { role: "user", content: JSON.stringify(history) }
        ];

        const response = await callLLMWithFailover([config.primaryModel], summaryPrompt as any, []);
        const summary = response.content;

        if (summary) {
            saveSessionSummary(userId, summary);
            clearSession(userId);
            await ctx.reply(`📑 *History Compacted:*\n\n${summary}`, { parse_mode: "Markdown" });
        }
    } catch (e) {
        console.error("Compact error", e);
        await ctx.reply("❌ Error compacting history.");
    }
});

bot.on("message:text", async (ctx) => {
    const stopTyping = withTyping(ctx);
    // Acknowledge receipt
    const waitMessage = await ctx.reply("⏳ Thinking...");

    try {
        const userId = ctx.from?.id!;
        const settings = userSettings.get(userId) || { model: "auto", thinkingLevel: 'off' };

        // Pass the chosen model down to the loop
        const { finalReply, finalModel } = await runAgentLoop(userId, ctx.message.text, settings.model, settings.thinkingLevel);
        const parsedModel = finalModel.split('/').pop() || finalModel;
        const signedReply = `${finalReply}\n\n*(Powered by: ${parsedModel})*`;
        await ctx.api.editMessageText(ctx.chat.id, waitMessage.message_id, signedReply, { parse_mode: "Markdown" });
    } catch (error) {
        console.error("[ERROR] Agent loop error:", error);
        await ctx.api.editMessageText(
            ctx.chat.id,
            waitMessage.message_id,
            "❌ Sorry, an error occurred while processing your request."
        );
    } finally {
        stopTyping();
    }
});

import fs from 'fs';
import path from 'path';
import { transcribeAudio, generateSpeech } from '../tools/voice.js';

bot.on("message:voice", async (ctx) => {
    const stopTyping = withTyping(ctx, "upload_voice");
    const waitMessage = await ctx.reply("🎧 Processing voice...");
    try {
        const file = await ctx.getFile();
        const fileUrl = `https://api.telegram.org/file/bot${config.telegramBotToken}/${file.file_path}`;

        const response = await fetch(fileUrl);
        const buffer = await response.arrayBuffer();

        const tmpDir = path.join(process.cwd(), 'data', 'tmp');
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

        const inputPath = path.join(tmpDir, `voice_${Date.now()}.ogg`);
        fs.writeFileSync(inputPath, Buffer.from(buffer));

        const text = await transcribeAudio(inputPath);

        const userId = ctx.from?.id!;
        const settings = userSettings.get(userId) || { model: "auto", thinkingLevel: 'off' };

        // Pass the transcribed text to the loop
        const { finalReply, finalModel } = await runAgentLoop(userId, `[Voice Message Transcription]: ${text}`, settings.model, settings.thinkingLevel);
        const parsedModel = finalModel.split('/').pop() || finalModel;
        const signedReply = `${finalReply}\n\n*(Powered by: ${parsedModel})*`;

        await ctx.api.editMessageText(ctx.chat.id, waitMessage.message_id, `🎤 *Whisper:* ${text}\n\n${signedReply}`, { parse_mode: "Markdown" });

        // Use Groq to reply with Voice
        if (config.groqApiKey && finalReply.length < 1000) { // Limit TTS size to avoid high latency/cost
            const outputPath = path.join(tmpDir, `reply_${Date.now()}.wav`);
            await generateSpeech(finalReply, outputPath);
            await ctx.replyWithVoice(new InputFile(outputPath));
        }
    } catch (error) {
        console.error("[ERROR] Voice loop error:", error);
        await ctx.api.editMessageText(
            ctx.chat.id,
            waitMessage.message_id,
            "❌ Sorry, an error occurred while processing your voice message."
        );
    } finally {
        stopTyping();
    }
});

import { analyzeImageFile, parsePdfDocument } from '../tools/multimodal.js';

bot.on("message:photo", async (ctx) => {
    const stopTyping = withTyping(ctx, "upload_photo");
    const waitMessage = await ctx.reply("🖼️ Looking at photo...");
    try {
        const photo = ctx.message.photo[ctx.message.photo.length - 1]; // get highest res
        const file = await ctx.api.getFile(photo.file_id);
        const fileUrl = `https://api.telegram.org/file/bot${config.telegramBotToken}/${file.file_path}`;

        const response = await fetch(fileUrl);
        const buffer = await response.arrayBuffer();

        const tmpDir = path.join(process.cwd(), 'data', 'tmp');
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

        const inputPath = path.join(tmpDir, `photo_${Date.now()}.jpg`);
        fs.writeFileSync(inputPath, Buffer.from(buffer));

        const description = await analyzeImageFile(inputPath);

        const userId = ctx.from?.id!;
        const settings = userSettings.get(userId) || { model: "auto", thinkingLevel: 'off' };

        const userCaption = ctx.message.caption ? `\nUser says: ${ctx.message.caption}` : '';
        const { finalReply, finalModel } = await runAgentLoop(userId, `[Image Received]: ${description}${userCaption}`, settings.model, settings.thinkingLevel);
        const parsedModel = finalModel.split('/').pop() || finalModel;
        const signedReply = `${finalReply}\n\n*(Powered by: ${parsedModel})*`;

        await ctx.api.editMessageText(ctx.chat.id, waitMessage.message_id, signedReply, { parse_mode: "Markdown" });
    } catch (error) {
        console.error("[ERROR] Photo processing error:", error);
        await ctx.api.editMessageText(
            ctx.chat.id,
            waitMessage.message_id,
            "❌ Sorry, an error occurred while processing your photo."
        );
    } finally {
        stopTyping();
    }
});

bot.on("message:document", async (ctx) => {
    const stopTyping = withTyping(ctx, "upload_document");
    const waitMessage = await ctx.reply("📄 Reading document...");
    try {
        const doc = ctx.message.document;
        if (!doc.file_name?.endsWith('.pdf')) {
            await ctx.api.editMessageText(ctx.chat.id, waitMessage.message_id, "❌ I only support PDF documents right now.");
            return;
        }

        const file = await ctx.api.getFile(doc.file_id);
        const fileUrl = `https://api.telegram.org/file/bot${config.telegramBotToken}/${file.file_path}`;

        const response = await fetch(fileUrl);
        const buffer = await response.arrayBuffer();

        const tmpDir = path.join(process.cwd(), 'data', 'tmp');
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

        const inputPath = path.join(tmpDir, `doc_${Date.now()}.pdf`);
        fs.writeFileSync(inputPath, Buffer.from(buffer));

        const text = await parsePdfDocument(inputPath);

        const userId = ctx.from?.id!;
        const settings = userSettings.get(userId) || { model: "auto", thinkingLevel: 'off' };

        const userCaption = ctx.message.caption ? `\nUser says: ${ctx.message.caption}` : '';
        const limitText = text.slice(0, 15000); // Prevent context massive bloat
        const { finalReply, finalModel } = await runAgentLoop(userId, `[PDF Document Received - ${doc.file_name}]:\n${limitText}\n...${userCaption}`, settings.model, settings.thinkingLevel);
        const parsedModel = finalModel.split('/').pop() || finalModel;
        const signedReply = `${finalReply}\n\n*(Powered by: ${parsedModel})*`;

        await ctx.api.editMessageText(ctx.chat.id, waitMessage.message_id, signedReply, { parse_mode: "Markdown" });
    } catch (error) {
        console.error("[ERROR] Document processing error:", error);
        await ctx.api.editMessageText(
            ctx.chat.id,
            waitMessage.message_id,
            "❌ Sorry, an error occurred while parsing your document."
        );
    } finally {
        stopTyping();
    }
});

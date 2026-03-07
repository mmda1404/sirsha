import cron from 'node-cron';
import { config } from '../config.js';
import { runAutonomousLoop } from './loop.js';
import { bot as telegramBot } from '../bot/telegram.js';
import { getFacts } from '../db.js';

/**
 * Heartbeat System
 * Pulses every minute to check for proactive tasks.
 */

export function initHeartbeat() {
    console.log("💓 Heartbeat System initialized (1-minute interval)");

    // Pulse every minute
    cron.schedule('* * * * *', async () => {
        await processPulse();
    });
}

async function processPulse() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    // In a multi-user system, we'd iterate over active users.
    // For Michelle's bot, we use her specific whitelist ID.
    const userId = config.telegramUserIdWhitelist[0];

    if (!userId) return;

    // Trigger 1: Morning Briefing (8:00 AM)
    if (hours === 8 && minutes === 0) {
        console.log("⏰ Heartbeat: Triggering Morning Briefing...");
        await triggerProactiveTask(userId, "System: Provide a high-energy morning briefing. Review the $1M revenue goal and brand authority objective. Synthesize today's date, calendar events, and recent context to give her a strategic roadmap for the day.");
    }

    // Trigger 2: Goal Reflection (2:00 PM)
    if (hours === 14 && minutes === 0) {
        console.log("⏰ Heartbeat: Triggering Mid-Day Goal Reflection...");
        await triggerProactiveTask(userId, "System: It's mid-day. Perform a quick reflection on the day's branding and revenue efforts. Reach out to Michelle with a strategic question or a high-value nudge to keep her momentum high on removing herself as the bottleneck.");
    }

    // Trigger 3: Evening Recap (9:00 PM)
    if (hours === 21 && minutes === 0) {
        console.log("⏰ Heartbeat: Triggering Evening Recap...");
        await triggerProactiveTask(userId, "System: Provide a thoughtful evening recap. Summarize what was accomplished today regarding the $1M goal and brand growth. Suggest one high-impact priority for tomorrow.");
    }

    // Trigger 4: Deep Reflection Pulse (Every 6 hours at minute 30)
    if (hours % 6 === 0 && minutes === 30) {
        console.log("⏰ Heartbeat: Running Deep Reflection Pulse...");
        await triggerProactiveTask(userId, "System: Deep Reflection Mode. Review the last 48 hours of memory. If you identify a significant insight, a missed opportunity, or a new way to establish authority that hasn't been discussed, reach out with it now. If nothing urgent is found, you may remain silent.");
    }
}

async function triggerProactiveTask(userId: number, systemCommand: string) {
    try {
        console.log(`💓 [HEARTBEAT] Executing Pulse: "${systemCommand.substring(0, 50)}..."`);

        // Run the agent loop using the dedicated heartbeat model (Ollama)
        // We wrap the command to ensure the model doesn't just hallucinate tools
        const { finalReply, finalModel } = await runAutonomousLoop(userId, systemCommand, config.heartbeatModel);

        if (finalReply && finalReply.trim() && !finalReply.includes("⚠️ Agent hit the maximum number of iterations")) {
            // Send the proactive response to Telegram
            const parsedModel = finalModel.split('/').pop() || finalModel;
            await telegramBot.api.sendMessage(userId, `✨ *Sirsha Strategic Pulse*\n\n${finalReply}\n\n*(Powered by: ${parsedModel})*`, { parse_mode: 'Markdown' });
            console.log("📢 Proactive message sent to user.");
        } else {
            console.log("🤫 Heartbeat pulse resulted in no message or an error iteration.");
        }
    } catch (err) {
        console.error("❌ Heartbeat Task Failed:", err);
    }
}

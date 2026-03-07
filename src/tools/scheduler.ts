import cron from 'node-cron';
import { runAutonomousLoop } from '../agent/loop.js';
import { config } from '../config.js';
import { bot } from '../index.js'; // We might need to export bot from index.ts or pass it in

export function initScheduler() {
    console.log("⏰ [SCHEDULER] Initializing...");

    // Example: Morning Briefing at 8:00 AM
    // cron.schedule('0 8 * * *', async () => {
    //     console.log("⏰ [SCHEDULER] Triggering Morning Briefing...");
    //     const result = await runAutonomousLoop(config.userId, "It's 8:00 AM. Provide a morning briefing including weather, top news, and today's calendar events.");
    //     if (bot && config.userId) {
    //         await bot.telegram.sendMessage(config.userId, result);
    //     }
    // });

    // Test task: Every 5 minutes (disabled by default, can be used for verification)
    cron.schedule('*/5 * * * *', async () => {
        console.log("⏰ [SCHEDULER] Running 5-minute status check...");
        // const result = await runAutonomousLoop(config.userId, "Perform a quick system status check. Are there any urgent emails or calendar conflicts?");
        // ...
    });

    console.log("✅ [SCHEDULER] Ready.");
}

export function scheduleManualTask(cronExpression: string, userId: number, directive: string) {
    cron.schedule(cronExpression, async () => {
        console.log(`⏰ [SCHEDULER] Triggering manual task: ${directive}`);
        const result = await runAutonomousLoop(userId, directive);
        if (bot) {
            await bot.api.sendMessage(userId, `🔔 *Scheduled Task:* \n\n${result}`, { parse_mode: 'Markdown' });
        }
    });
}

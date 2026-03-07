import { scheduleManualTask } from './src/tools/scheduler.js';
import { config } from './src/config.js';

async function testScheduler() {
    console.log("🧪 Testing Scheduler...");

    const userId = config.telegramUserIdWhitelist[0];
    if (!userId) {
        console.error("❌ No whitelisted user ID found.");
        return;
    }

    console.log(`📅 Scheduling a one-time task for user ${userId} in 5 seconds...`);

    // Schedule for 5 seconds from now
    const now = new Date();
    const triggerTime = new Date(now.getTime() + 10000); // 10 seconds to be safe
    const cronExpr = `${triggerTime.getSeconds()} ${triggerTime.getMinutes()} ${triggerTime.getHours()} ${triggerTime.getDate()} ${triggerTime.getMonth() + 1} *`;

    console.log(`Cron expression: ${cronExpr}`);

    scheduleManualTask(cronExpr, userId, "System: This is a test of the Sirsha Scheduled Task system. Just reply with 'Scheduled Task Test Successful!' and a fun fact about gravity.");

    console.log("⏳ Waiting for trigger... (You should see a message in Telegram if the bot is running)");
    console.log("Note: This script will keep running to allow the cron job to fire. Press Ctrl+C to stop.");
}

testScheduler().catch(console.error);

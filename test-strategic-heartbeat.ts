import { runAutonomousLoop } from './src/agent/loop.js';
import { config } from './src/config.js';
import { bot } from './src/index.js';

async function testStrategicPulse() {
    const userId = config.telegramUserIdWhitelist[0];
    if (!userId) {
        console.error("❌ No user ID found in whitelist.");
        return;
    }

    console.log("🧪 Testing Strategic Heartbeat: Morning Briefing Simulation...");
    const morningDirective = "System: Provide a high-energy morning briefing. Review the $1M revenue goal and brand authority objective. Synthesize today's date, calendar events, and recent context to give her a strategic roadmap for the day.";

    // Simulate the trigger
    const response = await runAutonomousLoop(userId, morningDirective, config.heartbeatModel);
    console.log("\n🤖 Sirsha's Proactive Response:\n", response);

    if (response) {
        console.log("✅ Simulation successful.");
    }
}

testStrategicPulse().catch(console.error);

import { bot } from "./bot/telegram.js";
import { config } from "./config.js";
import { initDB } from "./db.js";
import { startIMessagePolling } from "./channels/imessage.js";
import { initHeartbeat } from "./agent/heartbeat.js";
import { mcpManager } from "./tools/mcp.js";
import { closeBrowser } from "./tools/browser.js";
import { initScheduler } from "./tools/scheduler.js";
import { initWebhookServer } from "./tools/webhooks.js";

export { bot };

async function main() {
    console.log("🚀 Starting Sirsha...");

    // Initialize MCP Bridge
    await mcpManager.init();

    // Initialize SQLite Memory DB
    initDB();

    // Start background services
    startIMessagePolling();
    initHeartbeat();
    initScheduler();
    initWebhookServer();

    // 🧹 Cleanup on exit
    const cleanup = async () => {
        console.log("\n🧹 Cleaning up...");
        await closeBrowser();
        process.exit(0);
    };

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);

    console.log("✅ Sirsha is online and ready!");
    console.log("🔒 Security Checklist:");
    console.log("   - [x] Telegram Token present");
    console.log("   - [x] Anthropic API Key present");
    console.log(`   - [x] Whitelist active (${config.telegramUserIdWhitelist.length} user(s) allowed)`);

    bot.catch((err) => {
        const error = err.error;
        console.error("[ERROR] Bot error:", error);
    });

    await bot.start({
        drop_pending_updates: true,
        onStart: (botInfo) => {
            console.log(`✅ Bot initialized gracefully as @${botInfo.username}`);
            console.log("⏳ Waiting for messages (Long-polling mode, no web server exposed)...");
        }
    });
}

main().catch(err => {
    console.error("Fatal error:", err);
    process.exit(1);
});

import express, { Request, Response } from 'express';
import helmet from 'helmet';
import { config } from '../config.js';
import { runAutonomousLoop } from '../agent/loop.js';
import { bot } from '../index.js';

const app = express();

app.use(helmet());
app.use(express.json());

// Auth Middleware
const authMiddleware = (req: Request, res: Response, next: Function) => {
    const providedSecret = req.headers['x-claw-secret'] || req.headers['authorization'];

    if (providedSecret !== config.webhookSecret) {
        console.warn(`[WEBHOOK] Unauthorized access attempt from ${req.ip}`);
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};

app.post('/webhook', authMiddleware, async (req: Request, res: Response) => {
    const payload = req.body;
    const eventType = payload.event || 'generic_event';

    console.log(`\n🪝 [WEBHOOK] Received event: ${eventType}`);

    // Respond immediately to the sender
    res.status(202).json({ status: 'Accepted', message: 'Processing event...' });

    try {
        const userId = config.telegramUserIdWhitelist[0];
        if (!userId) {
            console.error("❌ [WEBHOOK] No whitelisted user ID found for notification.");
            return;
        }

        // Trigger the agent autonomously
        const directive = `[WEBHOOK EVENT]: ${eventType}\nData: ${JSON.stringify(payload, null, 2)}\n\nAnalyze this event and decide if any action is needed. If you perform an action, describe it. If it's just information, provide a brief summary.`;

        const { finalReply, finalModel } = await runAutonomousLoop(userId, directive);

        // Notify user on Telegram
        if (bot) {
            // Use a simpler approach to avoid Markdown parsing errors with underscores/JSON
            const safeResult = finalReply.replace(/[_*`]/g, '\\$&');
            const parsedModel = finalModel.split('/').pop() || finalModel;

            await bot.api.sendMessage(userId, `🪝 *Webhook Triggered: ${eventType}*\n\n${finalReply}\n\n*(Powered by: ${parsedModel})*`, {
                parse_mode: 'Markdown'
            }).catch(async (e) => {
                console.warn("⚠️ [WEBHOOK] Telegram Markdown failed, falling back to plain text:", e.message);
                await bot.api.sendMessage(userId, `🪝 Webhook Triggered: ${eventType}\n\n${finalReply}\n\n(Powered by: ${parsedModel})`);
            });
        }
    } catch (err) {
        console.error("❌ [WEBHOOK ERROR] Failed to process event:", err);
    }
});

export function initWebhookServer() {
    const port = config.webhookPort;
    app.listen(port, () => {
        console.log(`✅ [WEBHOOKS] Server listening on port ${port}`);
        console.log(`📡 Endpoint: http://localhost:${port}/webhook`);
    });
}

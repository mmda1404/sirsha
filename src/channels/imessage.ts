import { config } from '../config.js';
import { runAgentLoop } from '../agent/loop.js';

export const sendIMessageTool = {
    name: "send_imessage",
    description: "Send an iMessage or SMS via the BlueBubbles server.",
    input_schema: {
        type: "object",
        properties: {
            chatGuid: {
                type: "string",
                description: "The GUID of the chat or the phone number / email to send to"
            },
            message: {
                type: "string",
                description: "The text message content to send"
            }
        },
        required: ["chatGuid", "message"]
    }
};

export async function handleIMessageTools(name: string, input: any): Promise<string> {
    if (!config.blueBubblesUrl || !config.blueBubblesPassword) {
        return "Error: BlueBubbles URL or Password is not configured.";
    }

    if (name === "send_imessage") {
        const url = `${config.blueBubblesUrl}/api/v1/message/text?password=${config.blueBubblesPassword}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chatGuid: input.chatGuid,
                tempGuid: `temp-${Date.now()}`,
                message: input.message,
                method: "apple-script"
            })
        });

        if (!response.ok) {
            return `Failed to send iMessage. Status: ${response.statusText}`;
        }
        return `Successfully sent iMessage to ${input.chatGuid}`;
    }

    throw new Error(`Unknown iMessage tool: ${name}`);
}

// Temporary memory for last checked message ID to prevent duplicates
let lastMessageId = 0;

export async function startIMessagePolling() {
    if (!config.blueBubblesUrl || !config.blueBubblesPassword) {
        console.warn("BlueBubbles not configured. Polling disabled.");
        return;
    }

    console.log("🟢 Starting iMessage polling via BlueBubbles...");
    setInterval(async () => {
        try {
            const url = `${config.blueBubblesUrl}/api/v1/message?password=${config.blueBubblesPassword}&limit=5&sort=DESC`;
            const response = await fetch(url);
            if (!response.ok) return;

            const json = await response.json();
            const messages = json.data;
            if (!messages || messages.length === 0) return;

            // Simple highest ID tracking
            const highestId = Math.max(...messages.map((m: any) => m.id));
            if (lastMessageId === 0) {
                // First run, just set baseline
                lastMessageId = highestId;
                return;
            }

            const newMessages = messages.filter((m: any) => m.id > lastMessageId && m.isFromMe === false);
            lastMessageId = highestId;

            for (const msg of newMessages) {
                console.log(`[iMessage] New msg from ${msg.handle?.address}: ${msg.text}`);

                // Assuming admin user ID for agent trigger
                const adminUserId = config.telegramUserIdWhitelist[0];
                if (adminUserId && msg.text) {
                    // Send to agent loop. In a full implementation, we'd map iMessage chats to sessions
                    // but for simplicity, we funnel it into the primary admin session context with a prefix.
                    await runAgentLoop(adminUserId, `[iMessage from ${msg.handle?.address}]: ${msg.text}`);
                }
            }
        } catch (error) {
            console.error("iMessage polling error", error);
        }
    }, 10000); // Check every 10 seconds
}

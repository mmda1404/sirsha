import { google } from 'googleapis';
import { authorizeGoogle } from './google_auth.js';

export const readEmailTool = {
    name: "read_email",
    description: "Read the latest unread emails from the connected Gmail account.",
    input_schema: {
        type: "object",
        properties: {
            limit: {
                type: "number",
                description: "Max number of emails to read."
            }
        },
        required: []
    }
};

export async function handleGmailTools(name: string, input: any): Promise<string> {
    const auth = await authorizeGoogle();
    if (!auth) return "Error: Google account is not authenticated. The user must complete the OAuth flow.";

    const gmail = google.gmail({ version: 'v1', auth });


    if (name === "read_email") {
        const res = await gmail.users.messages.list({
            userId: 'me',
            q: 'is:unread',
            maxResults: input.limit || 5,
        });
        const messages = res.data.messages;
        if (!messages || messages.length === 0) return "No unread emails found.";

        const emailDetails = await Promise.all(messages.map(async (msg) => {
            const m = await gmail.users.messages.get({ userId: 'me', id: msg.id! });
            const payload = m.data.payload;
            const headers = payload?.headers;
            const subject = headers?.find(h => h.name === 'Subject')?.value || 'No Subject';
            const from = headers?.find(h => h.name === 'From')?.value || 'Unknown';
            const snippet = m.data.snippet;

            // Mark as read after fetching
            await gmail.users.messages.modify({
                userId: 'me',
                id: msg.id!,
                requestBody: { removeLabelIds: ['UNREAD'] }
            });

            return `From: ${from}\nSubject: ${subject}\nSnippet: ${snippet}`;
        }));

        return emailDetails.join('\n\n---\n\n');
    }
    throw new Error(`Unknown Gmail tool: ${name}`);
}

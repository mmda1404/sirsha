import { google } from 'googleapis';
import { authorizeGoogle } from './google_auth.js';

export const listEventsTool = {
    name: "list_calendar_events",
    description: "List upcoming events from the primary Google Calendar.",
    input_schema: {
        type: "object",
        properties: {
            limit: {
                type: "number",
                description: "Maximum number of events to list (default 10)."
            }
        }
    }
};

export const createEventTool = {
    name: "create_calendar_event",
    description: "Create a new event in the primary Google Calendar.",
    input_schema: {
        type: "object",
        properties: {
            summary: { type: "string", description: "Title of the event." },
            description: { type: "string", description: "Detailed description of the event." },
            startISO: { type: "string", description: "Start time in ISO 8601 format (e.g. 2024-03-01T10:00:00Z)." },
            endISO: { type: "string", description: "End time in ISO 8601 format (e.g. 2024-03-01T11:00:00Z)." }
        },
        required: ["summary", "startISO", "endISO"]
    }
};

export async function handleCalendarTools(name: string, input: any): Promise<string> {
    const auth = await authorizeGoogle();
    if (!auth) return "Error: Google account is not authenticated.";

    const calendar = google.calendar({ version: 'v3', auth });

    if (name === "list_calendar_events") {
        const res = await calendar.events.list({
            calendarId: 'primary',
            timeMin: new Date().toISOString(),
            maxResults: input.limit || 10,
            singleEvents: true,
            orderBy: 'startTime',
        });
        const events = res.data.items;
        if (!events || events.length === 0) return "No upcoming events found.";

        return events.map(event => {
            const start = event.start?.dateTime || event.start?.date;
            return `- ${event.summary} (${start})`;
        }).join('\n');
    }

    if (name === "create_calendar_event") {
        const event = {
            summary: input.summary,
            description: input.description,
            start: { dateTime: input.startISO },
            end: { dateTime: input.endISO },
        };

        const res = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: event,
        });

        return `Successfully created event: ${res.data.htmlLink}`;
    }

    throw new Error(`Unknown Calendar tool: ${name}`);
}

import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';
import { authenticate } from '@google-cloud/local-auth';

// If modifying these scopes, delete token.json.
export const GOOGLE_SCOPES = [
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/calendar.events'
];

const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

let authClient: any = null;

async function loadSavedCredentialsIfExist() {
    try {
        const content = fs.readFileSync(TOKEN_PATH, 'utf8');
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (err) {
        return null;
    }
}

async function saveCredentials(client: any) {
    const content = fs.readFileSync(CREDENTIALS_PATH, 'utf8');
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    fs.writeFileSync(TOKEN_PATH, payload);
}

export async function authorizeGoogle() {
    if (authClient) return authClient;

    if (!fs.existsSync(CREDENTIALS_PATH)) {
        console.warn("Google credentials.json not found!");
        return null;
    }

    let client = await loadSavedCredentialsIfExist();
    if (client) {
        authClient = client;
        return client;
    }

    try {
        console.log("Waiting for Google OAuth authentication in browser...");
        client = await authenticate({
            scopes: GOOGLE_SCOPES,
            keyfilePath: CREDENTIALS_PATH,
        }) as any;
        if (client && client.credentials) {
            await saveCredentials(client);
        }
        authClient = client;
        return client;
    } catch (e) {
        console.warn("Failed to authorize Google automatically", e);
        return null;
    }
}

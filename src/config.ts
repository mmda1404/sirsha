import dotenv from 'dotenv';

// Load variables from .env
dotenv.config();

export const config = {
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
    // Parse comma-separated string into array of numbers, ignoring empty or invalid entries
    telegramUserIdWhitelist: (process.env.TELEGRAM_USER_ID_WHITELIST || '')
        .split(',')
        .map(id => parseInt(id.trim(), 10))
        .filter(id => !isNaN(id)),
    anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    openRouterApiKey: process.env.OPENROUTER_API_KEY || '',
    ollamaBaseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
    googleApiKey: process.env.GOOGLE_API_KEY || '',
    elevenLabsApiKey: process.env.ELEVENLABS_API_KEY || '',
    pineconeApiKey: process.env.PINECONE_API_KEY || '',
    primaryModel: process.env.PRIMARY_MODEL || 'auto',
    blueBubblesUrl: process.env.BLUEBUBBLES_URL || '',
    blueBubblesPassword: process.env.BLUEBUBBLES_PASSWORD || '',
    groqApiKey: process.env.GROQ_API_KEY || '',
    heartbeatModel: process.env.HEARTBEAT_MODEL || 'moonshotai/kimi-k2.5',
    vercelToken: (process.env.VERCEL_TOKEN || '').trim(),
    ghlToken: (process.env.GHL_TOKEN || '').trim(),
    tavilyApiKey: (process.env.TAVILY_API_KEY || '').trim(),
    webhookPort: parseInt(process.env.WEBHOOK_PORT || '3000', 10),
    webhookSecret: process.env.WEBHOOK_SECRET || 'claw_secret_123',
    supabaseUrl: (process.env.SUPABASE_URL || '').trim(),
    supabaseServiceKey: (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim(),
    allowedRoots: [
        process.cwd(), // Always allow current working directory
        '/Users/michelle.anderson/Desktop/GravityClaw'
    ],
};

// Security Validations - Non-negotiable requirements
if (!config.telegramBotToken) {
    throw new Error("❌ SEC-FATAL: TELEGRAM_BOT_TOKEN is missing in .env");
}

if (!config.anthropicApiKey && !config.openRouterApiKey && !config.openaiApiKey && !config.googleApiKey && !config.ollamaBaseUrl) {
    throw new Error("❌ SEC-FATAL: At least one LLM API KEY or OLLAMA_BASE_URL is missing in .env");
}

if (config.telegramUserIdWhitelist.length === 0) {
    throw new Error("❌ SEC-FATAL: TELEGRAM_USER_ID_WHITELIST is missing or invalid. You must specify at least one authorized Telegram user ID.");
}

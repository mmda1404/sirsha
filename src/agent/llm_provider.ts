import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { config } from "../config.js";
import { logApiCost } from "../lib/logger.js";
import { getModelPricing } from "../lib/openrouter.js";

const pricingCache: Record<string, { prompt: number, completion: number }> = {};

interface ProviderClients {
    openai?: OpenAI;
    openrouter?: OpenAI;
    ollama?: OpenAI;
    anthropic?: Anthropic;
}

const clients: ProviderClients = {};

if (config.openaiApiKey) clients.openai = new OpenAI({ apiKey: config.openaiApiKey });
if (config.openRouterApiKey) {
    clients.openrouter = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: config.openRouterApiKey,
        defaultHeaders: { "HTTP-Referer": "https://sirsha.ai", "X-Title": "Sirsha" }
    });
} else if (config.anthropicApiKey?.startsWith('sk-or-')) {
    // Fallback: If ANTHROPIC_API_KEY is actually an OpenRouter key
    clients.openrouter = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: config.anthropicApiKey,
        defaultHeaders: { "HTTP-Referer": "https://sirsha.ai", "X-Title": "Sirsha" }
    });
}

clients.ollama = new OpenAI({ baseURL: `${config.ollamaBaseUrl}/v1`, apiKey: "ollama" });

if (config.anthropicApiKey && !config.anthropicApiKey.startsWith('sk-or-')) {
    clients.anthropic = new Anthropic({ apiKey: config.anthropicApiKey });
}


export async function callLLMWithFailover(
    prioritizedModels: string[],
    messages: any[],
    tools: any[]
): Promise<any> {
    for (const modelId of prioritizedModels) {
        try {
            console.log(`[LLM] Attempting model: ${modelId}`);
            const response = await callSingleLLM(modelId, messages, tools);

            // Log cost if usage data is available
            if (response.usage) {
                const promptTokens = response.usage.prompt_tokens || 0;
                const completionTokens = response.usage.completion_tokens || 0;

                // Get accurate pricing
                let pricing = pricingCache[modelId];
                if (!pricing) {
                    pricing = await getModelPricing(modelId);
                    pricingCache[modelId] = pricing;
                }

                const estimatedCost = (promptTokens * pricing.prompt) + (completionTokens * pricing.completion);

                logApiCost(modelId.split('/')[0], modelId, promptTokens, completionTokens, estimatedCost).catch(err => {
                    console.error("⚠️ [SUPABASE COST ERROR]:", err);
                });
            }

            return { modelId, ...response };
        } catch (error) {
            console.error(`[LLM] Model ${modelId} failed:`, error instanceof Error ? error.message : error);
            // Continue to next model in failover priority
        }
    }
    throw new Error("❌ SEC-FATAL: All models in failover priority failed.");
}

async function callSingleLLM(modelId: string, messages: any[], tools: any[]) {
    // Model IDs format: "provider/model_name"
    const [provider, ...rest] = modelId.split('/');
    const modelName = rest.join('/');

    // Route: native Anthropic SDK (only if a real sk-ant- key is set)
    if (provider === 'anthropic' && clients.anthropic) {
        // falls through to the anthropic block below
    } else if (provider === 'ollama') {
        const client = clients.ollama;
        if (!client) throw new Error(`Ollama client not initialized`);
        const response = await client.chat.completions.create({
            model: modelName,
            messages,
            tools: tools.length > 0 ? tools : undefined,
            tool_choice: tools.length > 0 ? "auto" : undefined,
        });
        return {
            content: response.choices[0].message.content,
            tool_calls: response.choices[0].message.tool_calls,
            rawMessage: response.choices[0].message,
            usage: response.usage
        };
    } else {
        // Everything else routes through OpenRouter:
        // moonshotai, google, meta-llama, mistral, openai (via OR), anthropic (via OR), etc.
        let client: OpenAI | undefined;
        let resolvedModelId: string;

        if (provider === 'openai' && clients.openai) {
            client = clients.openai;     // Direct OpenAI API
            resolvedModelId = modelName; // Just the model name, no prefix
        } else {
            client = clients.openrouter; // OpenRouter handles everything else
            resolvedModelId = modelId;   // Full "provider/model" format
        }

        if (!client) throw new Error(`No OpenRouter client — check OPENROUTER_API_KEY. Tried: ${modelId}`);

        const response = await client.chat.completions.create({
            model: resolvedModelId,
            messages,
            max_tokens: 8192, // Increased safety cap since credit limit was raised
            tools: tools.length > 0 ? tools : undefined,
            tool_choice: tools.length > 0 ? "auto" : undefined,
        });
        return {
            content: response.choices[0].message.content,
            tool_calls: response.choices[0].message.tool_calls,
            rawMessage: response.choices[0].message,
            usage: response.usage
        };
    }

    if (provider === 'anthropic' && clients.anthropic) {
        if (!clients.anthropic) throw new Error("Anthropic client not initialized");

        // Needs mapping to Anthropic format
        const systemMessage = messages.find(m => m.role === 'system')?.content || '';
        const anthropicMessages = messages.filter(m => m.role !== 'system').map(m => {
            if (m.role === 'tool') {
                return {
                    role: 'user',
                    content: [{ type: 'tool_result', tool_use_id: m.tool_call_id, content: m.content }]
                };
            }
            if (m.tool_calls) {
                const toolCalls = m.tool_calls.map((tc: any) => ({
                    type: 'tool_use',
                    id: tc.id,
                    name: tc.function.name,
                    input: tc.function.arguments ? JSON.parse(tc.function.arguments) : {}
                }));
                return {
                    role: 'assistant',
                    content: m.content ? [{ type: 'text', text: m.content }, ...toolCalls] : toolCalls
                };
            }
            return { role: m.role, content: m.content };
        });

        const anthropicTools = tools.map((t: any) => ({
            name: t.function.name,
            description: t.function.description,
            input_schema: t.function.parameters
        }));

        const response = await clients.anthropic.messages.create({
            model: modelName,
            max_tokens: 4096,
            system: systemMessage,
            messages: anthropicMessages as any[],
            tools: anthropicTools.length > 0 ? anthropicTools : undefined,
        });

        // Map back to OpenAI format for the loop
        const textBlock = response.content.find((c: any) => c.type === 'text') as any;
        const toolUseBlocks = response.content.filter((c: any) => c.type === 'tool_use') as any[];

        const tool_calls = toolUseBlocks.length > 0 ? toolUseBlocks.map((tu) => ({
            id: tu.id,
            type: 'function',
            function: {
                name: tu.name,
                arguments: JSON.stringify(tu.input)
            }
        })) : undefined;

        return {
            content: textBlock ? textBlock.text : null,
            tool_calls,
            rawMessage: {
                role: 'assistant',
                content: textBlock ? textBlock.text : null,
                tool_calls
            },
            usage: {
                prompt_tokens: response.usage.input_tokens,
                completion_tokens: response.usage.output_tokens
            }
        };
    } else {
        throw new Error(`Unsupported provider: ${provider}`);
    }
}

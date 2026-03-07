import { config } from '../config.js';

export interface OpenRouterModel {
    id: string;
    name: string;
    pricing: {
        prompt: string;
        completion: string;
        request: string;
        image: string;
    };
    context_length: number;
}

export async function fetchOpenRouterCredits() {
    const apiKey = config.openRouterApiKey || (config.anthropicApiKey?.startsWith('sk-or-') ? config.anthropicApiKey : '');
    if (!apiKey) return null;

    try {
        const response = await fetch('https://openrouter.ai/api/v1/credits', {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
            }
        });
        const data = await response.json();
        return data.data; // { total_credits: number, usage: number }
    } catch (error) {
        console.error('Error fetching OpenRouter credits:', error);
        return null;
    }
}

export async function fetchOpenRouterModels(): Promise<OpenRouterModel[]> {
    try {
        const response = await fetch('https://openrouter.ai/api/v1/models');
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching OpenRouter models:', error);
        return [];
    }
}

export async function getModelPricing(modelId: string) {
    const models = await fetchOpenRouterModels();
    const model = models.find(m => m.id === modelId);
    if (!model) return { prompt: 0.000015, completion: 0.000075 }; // Default fallback

    return {
        prompt: parseFloat(model.pricing.prompt),
        completion: parseFloat(model.pricing.completion)
    };
}

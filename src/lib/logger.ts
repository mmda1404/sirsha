import { supabase } from './supabase.js';

export async function logAgentEvent(eventType: string, description: string, metadata: any = {}) {
    try {
        const { error } = await supabase
            .from('agent_logs')
            .insert([
                {
                    event_type: eventType,
                    description: description,
                    metadata: metadata
                }
            ]);

        if (error) console.error('⚠️ [SUPABASE LOG ERROR]:', error.message);
    } catch (err) {
        console.error('⚠️ [SUPABASE LOG FATAL]:', err);
    }
}

export async function logApiCost(provider: string, model: string, promptTokens: number, completionTokens: number, estimatedCost: number) {
    try {
        const { error } = await supabase
            .from('api_costs')
            .insert([
                {
                    provider,
                    model,
                    token_usage_prompt: promptTokens,
                    token_usage_completion: completionTokens,
                    estimated_cost_usd: estimatedCost
                }
            ]);

        if (error) console.error('⚠️ [SUPABASE COST ERROR]:', error.message);
    } catch (err) {
        console.error('⚠️ [SUPABASE COST FATAL]:', err);
    }
}

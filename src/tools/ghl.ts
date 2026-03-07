import { supabase } from '../lib/supabase.js';
import { mcpManager } from './mcp.js';

export const ghlSyncTool = {
    name: "ghl_sync",
    description: "Sync GoHighLevel pipelines and opportunities to Mission Control.",
    parameters: {
        type: "object",
        properties: {
            sync_type: { type: "string", enum: ["pipelines", "opportunities", "all"], default: "all" }
        }
    }
};

export async function handleGhlTools(toolName: string, args: any) {
    if (toolName !== "ghl_sync") {
        throw new Error(`Unknown GHL tool: ${toolName}`);
    }

    const results = [];

    // 1. Sync Pipelines
    if (args.sync_type === "pipelines" || args.sync_type === "all") {
        console.log("🔄 Syncing GHL Pipelines...");
        try {
            const pipelinesRaw = await mcpManager.callTool("ghl_get_pipelines", {});
            const pipelines = JSON.parse(pipelinesRaw);

            for (const p of pipelines) {
                const { error } = await supabase
                    .from('ghl_pipelines')
                    .upsert({
                        id: p.id,
                        name: p.name,
                        stages: p.stages
                    });
                if (error) console.error(`❌ Error syncing pipeline ${p.id}:`, error.message);
            }
            results.push(`Synced ${pipelines.length} pipelines.`);
        } catch (err) {
            console.error("❌ Failed to sync GHL pipelines:", err);
            results.push("Failed to sync pipelines.");
        }
    }

    // 2. Sync Opportunities
    if (args.sync_type === "opportunities" || args.sync_type === "all") {
        console.log("🔄 Syncing GHL Opportunities...");
        try {
            // Note: In a real scenario, we might iterate through pipelines or stages. 
            // For now, assume a general list if available or fetch from a primary pipeline.
            const opportunitiesRaw = await mcpManager.callTool("ghl_search_opportunities", { limit: 50 });
            const opportunities = JSON.parse(opportunitiesRaw);

            for (const o of opportunities) {
                const { error } = await supabase
                    .from('ghl_opportunities')
                    .upsert({
                        id: o.id,
                        pipeline_id: o.pipelineId,
                        contact_id: o.contactId,
                        name: o.name,
                        status: o.status,
                        stage_id: o.stageId,
                        monetary_value: o.monetaryValue,
                        ghl_contact_name: o.contact?.name,
                        ghl_contact_email: o.contact?.email,
                        updated_at: new Date().toISOString()
                    });
                if (error) console.error(`❌ Error syncing opportunity ${o.id}:`, error.message);
            }
            results.push(`Synced ${opportunities.length} opportunities.`);
        } catch (err) {
            console.error("❌ Failed to sync GHL opportunities:", err);
            results.push("Failed to sync opportunities.");
        }
    }

    return results.join(" ");
}

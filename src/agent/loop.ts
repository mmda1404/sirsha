import { config } from "../config.js";
import { getCurrentTimeTool, getCurrentTime } from "../tools/time.js";
import { saveMemoryTool, searchMemoryTool, getRecentMemoryTool, handleMemoryTools } from "../tools/memory.js";
import { callLLMWithFailover } from "./llm_provider.js";
import { getSessionMessages, getSessionSummary, saveSessionMessage } from "../db.js";
import { readEmailTool, handleGmailTools } from "../tools/gmail.js";
import { saveVectorMemoryTool, searchVectorMemoryTool, handlePineconeTools } from "../tools/pinecone.js";
import { listEventsTool, createEventTool, handleCalendarTools } from "../tools/calendar.js";
import { sendIMessageTool, handleIMessageTools } from "../channels/imessage.js";
import { memoryManager } from "../memory/manager.js";
import { mcpManager } from "../tools/mcp.js";
import { readFileTool, writeFileTool, listFilesTool, searchFilesTool, handleFileTools } from "../tools/files.js";
import { browseUrlTool, takeScreenshotTool, clickElementTool, typeTextTool, handleBrowserTools } from "../tools/browser.js";
import { webSearchTool, handleSearchTools } from "../tools/search.js";
import { logWeightTool, logNutritionTool, logWellnessTool, logHabitTool, handleHealthTools } from "../tools/health.js";
import { ghlSyncTool, handleGhlTools } from "../tools/ghl.js";
import {
    ghlCreateAppointmentTool, ghlTriggerWorkflowTool,
    ghlFormsCreateFormTool, ghlFormsListFormsTool, ghlFormsGetFormTool,
    ghlProductsCreateProductTool, ghlProductsCreatePriceTool, ghlProductsListProductsTool,
    ghlMediaUploadTool, ghlFunnelsListFunnelsTool, ghlFunnelsGetPagesTool,
    handleGhlCustomTools
} from "../tools/ghl_custom.js";
import { callWithRouting } from './modelRouter.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { logAgentEvent } from '../lib/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOUL_PATH = path.join(__dirname, 'soul.md');

const MAX_ITERATIONS = 5;

// Define available tools (Note: We've migrated to defining them inline for OpenAI schema format below)
// The original Anthropic tools array is no longer strictly used the same way.

export async function runAgentLoop(userId: number, userMessage: string, primaryModel: string = config.primaryModel, thinkingLevel: string = 'off'): Promise<{ finalReply: string, finalModel: string }> {
    const { messages, systemPrompt } = await prepareContext(userId, userMessage, thinkingLevel);

    messages.push({ role: "user", content: userMessage });
    saveSessionMessage(userId, "user", userMessage);
    logAgentEvent('task_start', `User message received: ${userMessage.substring(0, 50)}...`, { userId });

    return executeLoop(userId, messages, primaryModel, thinkingLevel, userMessage);
}

export async function runAutonomousLoop(userId: number, systemDirective: string, primaryModel: string = config.primaryModel, thinkingLevel: string = 'off'): Promise<{ finalReply: string, finalModel: string }> {
    console.log(`\n🤖 [AUTONOMOUS LOOP] Triggered: "${systemDirective}"`);
    const { messages, systemPrompt } = await prepareContext(userId, `[System Trigger]: ${systemDirective}`, thinkingLevel);

    messages.push({ role: "user", content: `[SYSTEM TRIGGER]: ${systemDirective}` });
    saveSessionMessage(userId, "user", `[SYSTEM TRIGGER]: ${systemDirective}`);
    logAgentEvent('heartbeat', `Autonomous loop triggered: ${systemDirective}`, { userId });

    return executeLoop(userId, messages, primaryModel, thinkingLevel, systemDirective);
}

import { loadActiveSkills } from './skills_manager.js';

async function prepareContext(userId: number, trigger: string, thinkingLevel: string) {
    let systemPrompt = `You are Sirsha, a powerful and secure personal AI agent.`;

    try {
        if (fs.existsSync(SOUL_PATH)) {
            systemPrompt = fs.readFileSync(SOUL_PATH, 'utf-8');
        }
    } catch (err) {
        console.error("⚠️ Failed to load soul.md:", err);
    }

    const skills = await loadActiveSkills();
    if (skills) {
        systemPrompt += `\n\n[Active Skills & Expert Protocols]:\n${skills}`;
    }

    systemPrompt += `\n\n[Operational Guidelines]:
- Your goal is to fulfill requests using your available tools.
- If you need information you don't have, use the search_memory or search_vector_memory tools.
- If the user tells you personal facts or preferences, save them to memory immediately.
- Be concise, helpful, and prioritize security.
- When you have the final answer, provide it clearly without mentioning the tools you used unless asked.`;

    if (thinkingLevel === 'low') systemPrompt += "\nTake a brief moment to reason through your answer.";
    if (thinkingLevel === 'medium') systemPrompt += "\nThink step-by-step and provide a well-reasoned answer.";
    if (thinkingLevel === 'high') systemPrompt += "\nAnalyze the request deeply, consider multiple angles, and explain your reasoning extensively before answering.";

    const summary = getSessionSummary(userId);
    if (summary) {
        systemPrompt += `\n\n[Prior Conversation Summary]:\n${summary}`;
    }

    const { memoryBlock, onboardingPrompt } = await memoryManager.retrieveContext(userId, trigger);
    if (memoryBlock) {
        systemPrompt += `\n\n[Long-Term Memories & Facts]:\n${memoryBlock}`;
    }
    if (onboardingPrompt) {
        systemPrompt += `\n\n${onboardingPrompt}`;
    }

    let messages: any[] = [{ role: "system", content: systemPrompt }];
    const history = getSessionMessages(userId, 20);
    for (const msg of history) {
        messages.push({ role: msg.role, content: msg.content });
    }

    return { messages, systemPrompt };
}

async function executeLoop(userId: number, messages: any[], primaryModel: string, thinkingLevel: string, originalTrigger: string): Promise<{ finalReply: string, finalModel: string }> {
    for (let i = 0; i < MAX_ITERATIONS; i++) {
        console.log(`\n🔄 [ITERATION ${i + 1}/${MAX_ITERATIONS}]`);

        // Use the new Model Router for dynamic task classification and model selection
        let responseMessage: any;
        let modelUsed: string = "";
        let taskType: string = "default";

        const tools = [
            { type: "function", function: { name: "get_current_time", description: "Get the current time and date in ISO 8601 format.", parameters: { type: "object", properties: {} } } },
            { type: "function", function: { name: "save_memory", description: "Save an important fact or piece of context to long-term memory for future reference.", parameters: { type: "object", properties: { content: { type: "string" } }, required: ["content"] } } },
            { type: "function", function: { name: "search_memory", description: "Search long-term memory for previously saved facts or context based on a keyword query.", parameters: { type: "object", properties: { query: { type: "string" }, limit: { type: "number" } }, required: ["query"] } } },
            { type: "function", function: { name: "get_recent_memory", description: "Retrieve the most recently saved memories.", parameters: { type: "object", properties: { limit: { type: "number" } } } } },
            { type: "function", function: readEmailTool },
            { type: "function", function: saveVectorMemoryTool },
            { type: "function", function: searchVectorMemoryTool },
            { type: "function", function: listEventsTool },
            { type: "function", function: createEventTool },
            { type: "function", function: sendIMessageTool },
            { type: "function", function: readFileTool },
            { type: "function", function: writeFileTool },
            { type: "function", function: listFilesTool },
            { type: "function", function: searchFilesTool },
            { type: "function", function: browseUrlTool },
            { type: "function", function: takeScreenshotTool },
            { type: "function", function: clickElementTool },
            { type: "function", function: typeTextTool },
            { type: "function", function: webSearchTool },
            { type: "function", function: logWeightTool },
            { type: "function", function: logNutritionTool },
            { type: "function", function: logWellnessTool },
            { type: "function", function: logHabitTool },
            { type: "function", function: ghlSyncTool },
            { type: "function", function: ghlCreateAppointmentTool },
            { type: "function", function: ghlTriggerWorkflowTool },
            { type: "function", function: ghlFormsCreateFormTool },
            { type: "function", function: ghlFormsListFormsTool },
            { type: "function", function: ghlFormsGetFormTool },
            { type: "function", function: ghlProductsCreateProductTool },
            { type: "function", function: ghlProductsCreatePriceTool },
            { type: "function", function: ghlProductsListProductsTool },
            { type: "function", function: ghlMediaUploadTool },
            { type: "function", function: ghlFunnelsListFunnelsTool },
            { type: "function", function: ghlFunnelsGetPagesTool },
            ...mcpManager.getTools()
        ];
        console.log(`📡 [PROMPT] Sending ${tools.length} total tools to LLM (MCP: ${mcpManager.getTools().length})`);

        try {
            // Strip the system message before passing to router as it adds it itself
            const historyWithoutSystem = messages.filter(m => m.role !== 'system');

            const result = await callWithRouting(
                originalTrigger,
                historyWithoutSystem,
                messages.find(m => m.role === 'system')?.content || "",
                config.openRouterApiKey || config.anthropicApiKey || "",
                false, // hasImages - router will check keywords in originalTrigger
                tools
            );

            responseMessage = {
                modelId: result.modelUsed,
                content: result.response.content,
                tool_calls: result.response.tool_calls,
                rawMessage: result.response
            };
            modelUsed = result.modelUsed;
            taskType = result.taskType;

            console.log(`[Loop] ✅ Task: ${taskType} | Model used: ${modelUsed}`);
        } catch (err: any) {
            if (err.message === 'OLLAMA_ROUTE') {
                console.log("🛣️ [ROUTER] Routing to OLLAMA...");
                // Fallback to our existing failover for Ollama cases (optional)
                // but since the user requested direct pattern, we can just throw or handle.
                // For now, let's usesonnet as a fallback for Ollama to stay within OpenRouter.
                const result = await callWithRouting(originalTrigger, messages.filter(m => m.role !== 'system'), messages.find(m => m.role === 'system')?.content || "", config.openRouterApiKey || "", false, tools);
                responseMessage = { modelId: result.modelUsed, content: result.response.content, tool_calls: result.response.tool_calls, rawMessage: result.response };
                modelUsed = result.modelUsed;
            } else {
                throw err;
            }
        }

        messages.push(responseMessage.rawMessage);

        if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
            console.log(`🛠️ [TOOLS] Agent called ${responseMessage.tool_calls.length} tool(s)`);

            for (const rawToolCall of responseMessage.tool_calls) {
                const toolCall = rawToolCall as any;
                let resultValue: unknown;

                console.log(`   🔸 ${toolCall.function.name}(${toolCall.function.arguments || ''})`);

                try {
                    const args = toolCall.function.arguments ? JSON.parse(toolCall.function.arguments) : {};
                    if (toolCall.function.name === "get_current_time") {
                        resultValue = getCurrentTime();
                    } else if (["save_memory", "search_memory", "get_recent_memory"].includes(toolCall.function.name)) {
                        resultValue = handleMemoryTools(toolCall.function.name, args);
                    } else if (toolCall.function.name === "read_email") {
                        resultValue = await handleGmailTools(toolCall.function.name, args);
                    } else if (["list_calendar_events", "create_calendar_event"].includes(toolCall.function.name)) {
                        resultValue = await handleCalendarTools(toolCall.function.name, args);
                    } else if (["save_vector_memory", "search_vector_memory"].includes(toolCall.function.name)) {
                        resultValue = await handlePineconeTools(toolCall.function.name, args);
                    } else if (toolCall.function.name === "send_imessage") {
                        resultValue = await handleIMessageTools(toolCall.function.name, args);
                    } else if (["read_file", "write_file", "list_files", "search_files"].includes(toolCall.function.name)) {
                        resultValue = await handleFileTools(toolCall.function.name, args);
                    } else if (["browse_url", "take_screenshot", "click_element", "type_text"].includes(toolCall.function.name)) {
                        resultValue = await handleBrowserTools(toolCall.function.name, args);
                    } else if (["log_weight", "log_nutrition", "log_wellness", "log_habit"].includes(toolCall.function.name)) {
                        resultValue = await handleHealthTools(toolCall.function.name, args);
                    } else if (toolCall.function.name === "ghl_sync") {
                        resultValue = await handleGhlTools(toolCall.function.name, args);
                    } else if ([
                        "ghl_create_appointment", "ghl_trigger_workflow",
                        "ghl_forms_create_form", "ghl_forms_list_forms", "ghl_forms_get_form",
                        "ghl_products_create_product", "ghl_products_create_price", "ghl_products_list_products",
                        "ghl_media_upload", "ghl_funnels_list_funnels", "ghl_funnels_get_pages"
                    ].includes(toolCall.function.name)) {
                        resultValue = await handleGhlCustomTools(toolCall.function.name, args);
                    } else if (toolCall.function.name === "web_search") {
                        resultValue = await handleSearchTools(toolCall.function.name, args);
                    } else if (mcpManager.isMcpTool(toolCall.function.name)) {
                        resultValue = await mcpManager.callTool(toolCall.function.name, args);
                    } else {
                        resultValue = `Error: Unknown tool ${toolCall.function.name}`;
                    }
                } catch (error) {
                    console.error(`❌ [TOOL ERROR] ${toolCall.function.name}:`, error);
                    resultValue = `Error executing tool: ${error instanceof Error ? error.message : String(error)}`;
                }

                messages.push({
                    role: "tool",
                    tool_call_id: toolCall.id,
                    name: toolCall.function.name,
                    content: typeof resultValue === 'string' ? resultValue : JSON.stringify(resultValue),
                });
            }
        } else {
            const finalReply = responseMessage.content || "No response generated.";
            console.log(`✅ [COMPLETE] Agent provided final answer.`);
            saveSessionMessage(userId, "assistant", finalReply);

            memoryManager.processExchange(userId, originalTrigger, finalReply).catch(err => {
                console.error("⚠️ [MEMORY] Failed to process exchange:", err);
            });

            return { finalReply, finalModel: responseMessage.modelId || primaryModel };
        }
    }

    const maxItersReply = `⚠️ Agent hit the maximum number of iterations (${MAX_ITERATIONS}) without finishing.`;
    console.warn(maxItersReply);
    saveSessionMessage(userId, "assistant", maxItersReply);
    return { finalReply: maxItersReply, finalModel: primaryModel };
}


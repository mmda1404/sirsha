import Anthropic from "@anthropic-ai/sdk";
import { saveMemory, searchMemories, getRecentMemories } from "../db.js";

export const saveMemoryTool: Anthropic.Tool = {
    name: "save_memory",
    description: "Save an important fact or piece of context to long-term memory for future reference. Use this when the user mentions preferences, personal facts, or instructions they want you to remember.",
    input_schema: {
        type: "object",
        properties: {
            content: {
                type: "string",
                description: "The fact or instruction to remember"
            }
        },
        required: ["content"]
    }
};

export const searchMemoryTool: Anthropic.Tool = {
    name: "search_memory",
    description: "Search long-term memory for previously saved facts or context based on a keyword query.",
    input_schema: {
        type: "object",
        properties: {
            query: {
                type: "string",
                description: "Keywords to search for in memory"
            },
            limit: {
                type: "number",
                description: "Maximum number of results to return (default 5)"
            }
        },
        required: ["query"]
    }
};

export const getRecentMemoryTool: Anthropic.Tool = {
    name: "get_recent_memory",
    description: "Retrieve the most recently saved memories. Useful for gaining conversational context.",
    input_schema: {
        type: "object",
        properties: {
            limit: {
                type: "number",
                description: "Maximum number of recent memories to return"
            }
        },
        required: []
    }
};

export function handleMemoryTools(name: string, input: any): string {
    if (name === "save_memory") {
        const id = saveMemory(input.content);
        return `Successfully saved to memory with ID ${id}.`;
    }

    if (name === "search_memory") {
        const results = searchMemories(input.query, input.limit || 5);
        return results.length > 0
            ? JSON.stringify(results, null, 2)
            : "No matching memories found.";
    }

    if (name === "get_recent_memory") {
        const results = getRecentMemories(input.limit || 5);
        return results.length > 0
            ? JSON.stringify(results, null, 2)
            : "No recent memories.";
    }

    throw new Error(`Unknown memory tool: ${name}`);
}

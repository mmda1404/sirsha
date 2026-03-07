import Anthropic from "@anthropic-ai/sdk";

export const getCurrentTimeTool: Anthropic.Tool = {
    name: "get_current_time",
    description: "Get the current time and date in ISO 8601 format.",
    input_schema: {
        type: "object",
        properties: {},
        required: []
    }
};

export function getCurrentTime(): string {
    return new Date().toISOString();
}

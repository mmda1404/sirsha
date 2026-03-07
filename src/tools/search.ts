import { config } from '../config.js';

export const webSearchTool = {
    name: "web_search",
    description: "Search the web using Tavily API and return relevant research results.",
    parameters: {
        type: "object",
        properties: {
            query: { type: "string", description: "The search query." }
        },
        required: ["query"]
    }
};

export async function handleSearchTools(name: string, args: any): Promise<string> {
    if (!config.tavilyApiKey) {
        return "Error: Tavily API key is not configured. Please add TAVILY_API_KEY to your .env file.";
    }

    try {
        switch (name) {
            case "web_search": {
                console.log(`🔍 Searching Tavily for: ${args.query}`);

                const response = await fetch('https://api.tavily.com/search', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        api_key: config.tavilyApiKey,
                        query: args.query,
                        search_depth: "basic",
                        max_results: 5,
                        include_answer: true
                    })
                });

                if (!response.ok) {
                    const error = await response.text();
                    return `Error from Tavily API: ${error}`;
                }

                const data = await response.json() as any;

                let output = "";
                if (data.answer) {
                    output += `### Summary Answer:\n${data.answer}\n\n`;
                }

                if (data.results && data.results.length > 0) {
                    output += `### Top Results:\n`;
                    output += data.results.map((r: any, i: number) =>
                        `${i + 1}. **${r.title}**\n   URL: ${r.url}\n   Snippet: ${r.content}`
                    ).join('\n\n');
                } else {
                    output += "No specific results found.";
                }

                return output;
            }
            default:
                return `Error: Unknown search tool ${name}`;
        }
    } catch (err) {
        return `Error performing web search: ${err instanceof Error ? err.message : String(err)}`;
    }
}

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { config } from "../config.js";

/**
 * MCP Manager handles connections to external MCP servers
 * currently supports Vercel (hosted SSE transport)
 */
export class MCPManager {
    private clients: Map<string, Client> = new Map();
    private toolMap: Map<string, { serverName: string, tool: any }> = new Map();

    constructor() { }

    async init() {
        console.log("🔌 Initializing MCP Bridge...");
        if (config.vercelToken) {
            await this.connectVercel();
        } else {
            console.log("⚠️ VERCEL_TOKEN missing, skipping Vercel MCP.");
        }

        if (config.ghlToken) {
            console.log("🔹 GHL Token detected, initializing...");
            await this.connectGHL();
        } else {
            console.log("⚠️ GHL_TOKEN missing or empty in config, skipping GHL.");
        }
    }

    private async connectGHL() {
        try {
            console.log("🚀 Connecting to GoHighLevel MCP (Official Endpoint)...");
            const transport = new StreamableHTTPClientTransport(new URL("https://services.leadconnectorhq.com/mcp/"), {
                requestInit: {
                    headers: {
                        Authorization: `Bearer ${config.ghlToken}`,
                        Accept: "application/json, text/event-stream"
                    }
                }
            });
            const client = new Client(
                { name: "Sirsha", version: "1.0.0" },
                { capabilities: {} }
            );

            await client.connect(transport);
            this.clients.set("ghl", client);

            const { tools } = await client.listTools();
            for (const tool of tools) {
                const uniqueName = `ghl_${tool.name}`;
                this.toolMap.set(uniqueName, { serverName: "ghl", tool });
            }

            console.log(`✅ GoHighLevel MCP Connected (${tools.length} tools discovered)`);
            console.log(`🔹 Current total tools in map: ${this.toolMap.size}`);
        } catch (err) {
            console.error("❌ Failed to connect to GoHighLevel MCP:", err);
        }
    }

    private async connectVercel() {
        try {
            console.log("🚀 Connecting to Vercel MCP (Streamable HTTP)...");
            const transport = new StreamableHTTPClientTransport(new URL("https://mcp.vercel.com/"), {
                requestInit: {
                    headers: {
                        Authorization: `Bearer ${config.vercelToken}`,
                        Accept: "application/json, text/event-stream"
                    }
                }
            });
            const client = new Client(
                { name: "Sirsha", version: "1.0.0" },
                { capabilities: {} }
            );

            await client.connect(transport);
            this.clients.set("vercel", client);

            const { tools } = await client.listTools();
            for (const tool of tools) {
                // Namespace tools to avoid collisions
                const uniqueName = `vercel_${tool.name}`;
                this.toolMap.set(uniqueName, { serverName: "vercel", tool });
            }

            console.log(`✅ Vercel MCP Connected (${tools.length} tools)`);
        } catch (err) {
            console.error("❌ Failed to connect to Vercel MCP:", err);
        }
    }

    isMcpTool(name: string): boolean {
        return this.toolMap.has(name);
    }

    getTools() {
        return Array.from(this.toolMap.entries()).map(([name, { serverName, tool }]) => ({
            type: "function",
            function: {
                name,
                description: `[${serverName.toUpperCase()}] ${tool.description}`,
                parameters: tool.inputSchema
            }
        }));
    }

    async callTool(name: string, args: any) {
        const toolInfo = this.toolMap.get(name);
        if (!toolInfo) throw new Error(`MCP Tool ${name} not found`);

        const client = this.clients.get(toolInfo.serverName);
        if (!client) throw new Error(`MCP Client ${toolInfo.serverName} not connected`);

        // Remove prefix before calling the actual server
        const originalName = name.replace(`${toolInfo.serverName}_`, "");

        console.log(`🛠️ Calling MCP [${toolInfo.serverName}]: ${originalName}`);
        const result = await client.callTool({
            name: originalName,
            arguments: args
        });

        return JSON.stringify(result.content);
    }
}

export const mcpManager = new MCPManager();

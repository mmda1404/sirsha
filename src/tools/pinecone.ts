import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import { config } from '../config.js';

let pc: Pinecone | null = null;
let openai: OpenAI | null = null;
const INDEX_NAME = 'gravity-claw';

async function initClients() {
    if (!config.pineconeApiKey) throw new Error("Pinecone API key is missing.");

    // Choose the best available key for embeddings
    const embeddingKey = config.openaiApiKey || config.openRouterApiKey || config.anthropicApiKey;
    if (!embeddingKey) throw new Error("No LLM API key (OpenAI/OpenRouter/Anthropic) found for embeddings.");

    if (!pc) pc = new Pinecone({ apiKey: config.pineconeApiKey });
    if (!openai) {
        const isActuallyOpenAI = config.openaiApiKey && !embeddingKey.startsWith('sk-or-');
        openai = new OpenAI({
            apiKey: embeddingKey,
            baseURL: isActuallyOpenAI ? undefined : "https://openrouter.ai/api/v1"
        });
    }

    // Auto-create index if it does not exist (1536 dims for text-embedding-3-small)
    const existing = await pc.listIndexes();
    if (!existing.indexes?.find(i => i.name === INDEX_NAME)) {
        console.log(`Creating Pinecone index: ${INDEX_NAME}`);
        await pc.createIndex({
            name: INDEX_NAME,
            dimension: 1536,
            metric: 'cosine',
            spec: { serverless: { cloud: 'aws', region: 'us-east-1' } }
        });
    }
}

export const saveVectorMemoryTool = {
    name: "save_vector_memory",
    description: "Save an important fact to the Pinecone semantic vector database.",
    input_schema: {
        type: "object",
        properties: {
            content: {
                type: "string",
                description: "The fact to remember semantically"
            }
        },
        required: ["content"]
    }
};

export const searchVectorMemoryTool = {
    name: "search_vector_memory",
    description: "Search long-term semantic memory in Pinecone for context.",
    input_schema: {
        type: "object",
        properties: {
            query: {
                type: "string",
                description: "The semantic query to search for"
            },
            limit: {
                type: "number",
                description: "Max results to return (default 3)"
            }
        },
        required: ["query"]
    }
};

export async function handlePineconeTools(name: string, input: any): Promise<string> {
    await initClients();
    if (!pc || !openai) throw new Error("Clients not initialized");

    const index = pc.Index(INDEX_NAME);

    if (name === "save_vector_memory") {
        const text = input.content;
        const res = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: text,
        });

        if (!res.data || res.data.length === 0) {
            throw new Error("No embedding data returned from provider.");
        }

        const embedding = res.data[0].embedding;
        const id = `mem_${Date.now()}`;

        console.log(`✨ [PINECONE] Upserting record ${id} (dim: ${embedding.length})`);

        await index.upsert({
            records: [{
                id: id,
                values: embedding,
                metadata: { text: String(text) }
            }]
        });

        return `Saved semantic memory with ID ${id}`;
    }

    if (name === "search_vector_memory") {
        const res = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: input.query,
        });

        if (!res.data || res.data.length === 0) {
            return "Error: Could not generate embeddings for search.";
        }

        const embedding = res.data[0].embedding;
        const results = await index.query({
            vector: embedding,
            topK: input.limit || 3,
            includeMetadata: true
        });

        if (!results.matches || results.matches.length === 0) return "No semantic memories found.";
        const texts = results.matches.map(m => `(Score: ${(m.score || 0).toFixed(2)}) ${m.metadata?.text}`);
        return texts.join('\n\n');
    }

    throw new Error(`Unknown Pinecone tool: ${name}`);
}

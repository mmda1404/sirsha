import { saveFact, getFacts } from "../db.js";
import { handlePineconeTools } from "../tools/pinecone.js";
import { callLLMWithFailover } from "../agent/llm_provider.js";
import { config } from "../config.js";

const CORE_CATEGORIES = [
    { key: 'identity', label: 'Identity', description: 'Name, background, and current role.' },
    { key: 'goals', label: 'Goals', description: 'Long-term objectives and what they want to achieve with you.' },
    { key: 'stack', label: 'Stack', description: 'Preferred tools, languages, and technical environment.' },
    { key: 'boundaries', label: 'Boundaries', description: 'Preferred communication style and constraints.' }
];

/**
 * Automates the three-tier memory system
 */
export class MemoryManager {
    /**
     * Retrieves relevant context from both Fact Store (SQLite) and Episodic Memory (Pinecone)
     */
    async retrieveContext(userId: number, query: string): Promise<{ memoryBlock: string, onboardingPrompt: string }> {
        console.log(`🧠 [MEMORY] Retrieving context for: "${query.substring(0, 30)}..."`);

        // 1. Get structured facts
        const facts = getFacts(userId);

        // Prioritize Core Facts
        const coreFacts = facts.filter(f => CORE_CATEGORIES.some(c => c.key === f.category));
        const otherFacts = facts.filter(f => !CORE_CATEGORIES.some(c => c.key === f.category));

        let factBlock = "";
        if (coreFacts.length > 0) {
            factBlock += "\n[Core User Profile]:\n" + coreFacts.map(f => `- ${f.category.toUpperCase()}: ${f.fact}`).join('\n');
        }
        if (otherFacts.length > 0) {
            factBlock += "\n[Additional Context]:\n" + otherFacts.map(f => `- [${f.category}] ${f.fact}`).join('\n');
        }

        // 2. Identify Missing Core Information
        const missing = CORE_CATEGORIES.filter(c => !facts.some(f => f.category === c.key));
        let onboardingPrompt = "";
        if (missing.length > 0) {
            onboardingPrompt = `\n[ONBOARDING DIRECTIVE]: You are still learning about the user. If appropriate, naturally weave in a question to learn about their ${missing[0].key} (${missing[0].description}). Only ask one question at a time and don't force it if the conversation is focused elsewhere.`;
        }

        // 3. Get semantic episodic memory
        let episodicBlock = "";
        try {
            const semanticResults = await handlePineconeTools("search_vector_memory", { query, limit: 3 });
            if (semanticResults && !semanticResults.includes("No semantic memories found")) {
                episodicBlock = "\n[Relevant Past Conversions]:\n" + semanticResults;
            }
        } catch (err) {
            console.error("⚠️ [MEMORY] Pinecone search failed:", err);
        }

        return {
            memoryBlock: `${factBlock}${episodicBlock}`.trim(),
            onboardingPrompt
        };
    }

    /**
     * Distills the latest exchange into structured facts and indexes it semantically
     */
    async processExchange(userId: number, userMsg: string, assistantMsg: string) {
        // 1. Semantic Indexing (Episodic)
        const combined = `User: ${userMsg}\nAssistant: ${assistantMsg}`;
        try {
            await handlePineconeTools("save_vector_memory", { content: combined });
        } catch (err) {
            console.error("⚠️ [MEMORY] Pinecone index failed:", err);
        }

        // 2. Fact Extraction (Declarative)
        await this.extractFacts(userId, userMsg);
    }

    private async extractFacts(userId: number, text: string) {
        const extractionPrompt = [
            {
                role: "system",
                content: `Extract core facts about the user from the text. 
                Focus on preferences, biography, work, or important instructions.
                Return ONLY a JSON array of objects: [{"category": "string", "fact": "string"}]
                If no facts exist, return [].
                Recommended categories: identity, goals, stack, boundaries, preference, bio, work, other.`
            },
            { role: "user", content: text }
        ];

        try {
            // Use a faster model if possible, or primary
            const response = await callLLMWithFailover([config.primaryModel], extractionPrompt, []);
            const content = response.content;

            if (content) {
                // Clean markdown JSON blocks if present
                const jsonStr = content.replace(/```json|```/g, '').trim();
                const facts = JSON.parse(jsonStr);

                for (const item of facts) {
                    console.log(`✨ [MEMORY] Extracted fact: [${item.category}] ${item.fact}`);
                    saveFact(userId, item.category, item.fact);
                }
            }
        } catch (err) {
            console.error("⚠️ [MEMORY] Fact extraction failed:", err);
        }
    }
}

export const memoryManager = new MemoryManager();

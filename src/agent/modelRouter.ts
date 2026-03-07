/**
 * agent/modelRouter.ts
 * Fixed version — accepts and passes tools correctly to OpenRouter.
 */

export const MODELS = {
  KIMI:        'moonshotai/kimi-k2.5',
  CLAUDE_SON:  'anthropic/claude-sonnet-4-6',
  CLAUDE_OPU:  'anthropic/claude-opus-4-6',
  GPT5_CODEX:  'openai/gpt-5.3-codex',
  GEMINI:      'google/gemini-3.1-flash-image-preview',
  OLLAMA:      '__ollama__',
} as const;

export type ModelString = typeof MODELS[keyof typeof MODELS];
export type TaskType = 'coding' | 'vision' | 'strategy' | 'writing' | 'heartbeat' | 'default';

const ROUTING_TABLE: Record<TaskType, { primary: ModelString; fallback: ModelString }> = {
  coding:    { primary: MODELS.GPT5_CODEX,  fallback: MODELS.CLAUDE_SON },
  vision:    { primary: MODELS.GEMINI,      fallback: MODELS.CLAUDE_SON },
  strategy:  { primary: MODELS.CLAUDE_OPU,  fallback: MODELS.CLAUDE_SON },
  writing:   { primary: MODELS.CLAUDE_SON,  fallback: MODELS.KIMI       },
  heartbeat: { primary: MODELS.OLLAMA,      fallback: MODELS.KIMI       },
  default:   { primary: MODELS.KIMI,        fallback: MODELS.CLAUDE_SON },
};

export function classifyTask(input: string, hasImages = false): TaskType {
  if (hasImages) return 'vision';

  const text = input.toLowerCase();

  const codingKeywords = [
    'code', 'bug', 'error', 'debug', 'fix', 'function', 'typescript',
    'javascript', 'python', 'script', 'deploy', 'railway', 'npm', 'install',
    'build', 'compile', 'syntax', 'loop', 'api', 'endpoint', 'refactor',
    'implement', 'import', 'export', 'module', 'class', 'interface',
  ];
  const visionKeywords = [
    'image', 'photo', 'screenshot', 'picture', 'look at', 'see this',
    'what is in', 'analyze this image', 'describe this',
  ];
  const strategyKeywords = [
    'strategy', 'research', 'analyze', 'analysis', 'plan', 'roadmap',
    'competitive', 'market', 'revenue', 'growth', 'funnel', 'pipeline',
    'should i', 'what do you think', 'advise', 'recommend', 'decision',
    'brand', 'positioning', 'audience', 'hypothesis', 'why is', 'how should',
    'financial', 'invest', 'pricing', 'kpi', 'metrics',
  ];
  const writingKeywords = [
    'write', 'draft', 'email', 'post', 'caption', 'reel', 'script',
    'content', 'copy', 'message', 'blog', 'article', 'hook', 'headline',
    'newsletter', 'dm', 'proposal', 'pitch', 'sales', 'outreach',
    'linkedin', 'instagram', 'twitter', 'social',
  ];

  if (codingKeywords.some(k => text.includes(k)))   return 'coding';
  if (visionKeywords.some(k => text.includes(k)))   return 'vision';
  if (strategyKeywords.some(k => text.includes(k))) return 'strategy';
  if (writingKeywords.some(k => text.includes(k)))  return 'writing';

  return 'default';
}

export interface OpenRouterMessage {
  role:    'system' | 'user' | 'assistant' | 'tool';
  content: string | null;
  tool_calls?: any[];
  tool_call_id?: string;
  name?: string;
}

// Calls OpenRouter and returns the full message object (not just a string)
// so tool_calls are preserved for the agent loop to handle.
async function callOpenRouter(
  model: ModelString,
  messages: OpenRouterMessage[],
  apiKey: string,
  tools: any[] = [],
): Promise<any> {
  const body: any = {
    model,
    messages,
    max_tokens: 2048,
    temperature: 0.7,
  };

  if (tools.length > 0) {
    body.tools = tools;
    body.tool_choice = 'auto';
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type':  'application/json',
      'HTTP-Referer':  'https://merakimedia.co',
      'X-Title':       'GravityClaw / Sirsha',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter error (${response.status}) model=${model}: ${error}`);
  }

  const data = await response.json();
  const message = data?.choices?.[0]?.message;

  if (!message) throw new Error(`OpenRouter returned no message for model: ${model}`);

  return message; // Full message object: { role, content, tool_calls? }
}

export async function callWithRouting(
  userInput:    string,
  messages:     OpenRouterMessage[],
  systemPrompt: string,
  apiKey:       string,
  hasImages =   false,
  tools:        any[] = [],
): Promise<{ response: any; modelUsed: ModelString; taskType: TaskType }> {

  const taskType = classifyTask(userInput, hasImages);
  const { primary, fallback } = ROUTING_TABLE[taskType];

  console.log(`[Router] Task: ${taskType} → Model: ${primary}`);

  if (primary === MODELS.OLLAMA) throw new Error('OLLAMA_ROUTE');

  const allMessages: OpenRouterMessage[] = [
    { role: 'system', content: systemPrompt },
    ...messages,
  ];

  try {
    const response = await callOpenRouter(primary, allMessages, apiKey, tools);
    console.log(`[Router] ✅ ${taskType} → ${primary}`);
    return { response, modelUsed: primary, taskType };
  } catch (primaryError) {
    console.warn(`[Router] ⚠️ Primary failed (${primary}), falling back to (${fallback})`);
    console.warn(primaryError);
    const response = await callOpenRouter(fallback, allMessages, apiKey, tools);
    console.log(`[Router] ✅ ${taskType} → ${fallback} (fallback)`);
    return { response, modelUsed: fallback, taskType };
  }
}

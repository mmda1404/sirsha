import fs from 'fs';
import path from 'path';

const MD_DIR = path.join(process.cwd(), 'data');
const MD_FILE = path.join(MD_DIR, 'memory.md');

export function syncAllMemoriesToMarkdown(memories: { id: number, content: string, timestamp: string }[]) {
    if (!fs.existsSync(MD_DIR)) {
        fs.mkdirSync(MD_DIR, { recursive: true });
    }

    let markdownContent = `# Sirsha Memory\n\n*This file is automatically synced with the agent's SQLite memory.*\n\n`;

    for (const mem of memories) {
        markdownContent += `## Memory ${mem.id}\n`;
        markdownContent += `**Date:** ${mem.timestamp}\n\n`;
        markdownContent += `${mem.content}\n\n---\n\n`;
    }

    fs.writeFileSync(MD_FILE, markdownContent, 'utf-8');
}

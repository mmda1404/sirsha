import fs from 'fs/promises';
import path from 'path';
import { config } from '../config.js';

/**
 * Security check to ensure the path is within allowed roots
 */
function isPathAllowed(targetPath: string): boolean {
    const absolutePath = path.resolve(targetPath);
    return config.allowedRoots.some(root => absolutePath.startsWith(path.resolve(root)));
}

export const readFileTool = {
    name: "read_file",
    description: "Read the full content of a file from the local filesystem.",
    parameters: {
        type: "object",
        properties: {
            path: { type: "string", description: "Absolute or relative path to the file." }
        },
        required: ["path"]
    }
};

export const writeFileTool = {
    name: "write_file",
    description: "Create a new file or overwrite an existing file with the provided content.",
    parameters: {
        type: "object",
        properties: {
            path: { type: "string", description: "Absolute or relative path to the file." },
            content: { type: "string", description: "The content to write to the file." }
        },
        required: ["path", "content"]
    }
};

export const listFilesTool = {
    name: "list_files",
    description: "List the contents of a directory (non-recursive).",
    parameters: {
        type: "object",
        properties: {
            path: { type: "string", description: "Absolute or relative path to the directory." }
        },
        required: ["path"]
    }
};

export const searchFilesTool = {
    name: "search_files",
    description: "Search for a string pattern within files in a directory (recursively).",
    parameters: {
        type: "object",
        properties: {
            directory: { type: "string", description: "The directory to search within." },
            pattern: { type: "string", description: "The string or regex pattern to search for." },
            extension: { type: "string", description: "Optional file extension to filter by (e.g., '.ts')." }
        },
        required: ["directory", "pattern"]
    }
};

export async function handleFileTools(name: string, args: any): Promise<string> {
    const targetPath = args.path || args.directory;
    if (!targetPath) return "Error: Missing path or directory argument.";

    if (!isPathAllowed(targetPath)) {
        return `Error: Access denied. Path is outside of allowed directories. Allowed: ${config.allowedRoots.join(', ')}`;
    }

    try {
        switch (name) {
            case "read_file": {
                const content = await fs.readFile(targetPath, 'utf-8');
                return content;
            }
            case "write_file": {
                await fs.mkdir(path.dirname(targetPath), { recursive: true });
                await fs.writeFile(targetPath, args.content, 'utf-8');
                return `Successfully wrote to ${targetPath}`;
            }
            case "list_files": {
                const files = await fs.readdir(targetPath, { withFileTypes: true });
                return files.map(f => `${f.isDirectory() ? '[DIR] ' : '[FILE] '}${f.name}`).join('\n');
            }
            case "search_files": {
                // Simplified recursive search
                const results: string[] = [];
                async function walk(dir: string) {
                    const entries = await fs.readdir(dir, { withFileTypes: true });
                    for (const entry of entries) {
                        const fullPath = path.join(dir, entry.name);
                        if (entry.isDirectory()) {
                            await walk(fullPath);
                        } else if (!args.extension || fullPath.endsWith(args.extension)) {
                            const content = await fs.readFile(fullPath, 'utf-8');
                            if (content.includes(args.pattern)) {
                                results.push(fullPath);
                            }
                        }
                    }
                }
                await walk(targetPath);
                return results.length > 0 ? `Found pattern in:\n${results.join('\n')}` : "No matches found.";
            }
            default:
                return `Error: Unknown file tool ${name}`;
        }
    } catch (err) {
        return `Error: ${err instanceof Error ? err.message : String(err)}`;
    }
}

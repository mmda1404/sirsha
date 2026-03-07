import fs from 'fs';
import path from 'path';

const SKILLS_DIR = path.join(process.cwd(), 'src/agent/skills');

/**
 * Skills Manager
 * Loads additional persona contexts and expert instructions from Markdown files.
 */
export async function loadActiveSkills(): Promise<string> {
    let combinedSkills = "";

    try {
        if (!fs.existsSync(SKILLS_DIR)) {
            fs.mkdirSync(SKILLS_DIR, { recursive: true });
            return "";
        }

        const files = fs.readdirSync(SKILLS_DIR);
        const mdFiles = files.filter(f => f.endsWith('.md'));

        for (const file of mdFiles) {
            const content = fs.readFileSync(path.join(SKILLS_DIR, file), 'utf-8');
            const skillName = file.replace('.md', '').toUpperCase().replace(/_/g, ' ');

            combinedSkills += `\n\n[Skill: ${skillName}]:\n${content}`;
            console.log(`🧩 [SKILLS] Loaded: ${file}`);
        }

    } catch (err) {
        console.error("❌ [SKILLS] Failed to load skills:", err);
    }

    return combinedSkills;
}

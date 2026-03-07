import { chromium, Browser, BrowserContext, Page } from 'playwright';
import TurndownService from 'turndown';
import path from 'path';
import fs from 'fs/promises';

const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced'
});

let browser: Browser | null = null;
let context: BrowserContext | null = null;
let page: Page | null = null;

export async function ensureBrowser() {
    if (!browser) {
        browser = await chromium.launch({ headless: true });
        context = await browser.newContext({
            viewport: { width: 1280, height: 720 },
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        });
        page = await context.newPage();
    }
    return page!;
}

export const browseUrlTool = {
    name: "browse_url",
    description: "Navigate to a URL and return the page content as Markdown.",
    parameters: {
        type: "object",
        properties: {
            url: { type: "string", description: "The URL to navigate to." },
            wait_for_selector: { type: "string", description: "Optional CSS selector to wait for before extracting content." }
        },
        required: ["url"]
    }
};

export const takeScreenshotTool = {
    name: "take_screenshot",
    description: "Take a screenshot of the current page.",
    parameters: {
        type: "object",
        properties: {
            name: { type: "string", description: "Optional name for the screenshot file." }
        }
    }
};

export const clickElementTool = {
    name: "click_element",
    description: "Click an element on the page using a CSS selector.",
    parameters: {
        type: "object",
        properties: {
            selector: { type: "string", description: "The CSS selector of the element to click." }
        },
        required: ["selector"]
    }
};

export const typeTextTool = {
    name: "type_text",
    description: "Type text into an input field.",
    parameters: {
        type: "object",
        properties: {
            selector: { type: "string", description: "The CSS selector of the input field." },
            text: { type: "string", description: "The text to type." }
        },
        required: ["selector", "text"]
    }
};

export async function handleBrowserTools(name: string, args: any): Promise<string> {
    const p = await ensureBrowser();

    try {
        switch (name) {
            case "browse_url": {
                console.log(`🌐 Navigating to: ${args.url}`);
                await p.goto(args.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
                if (args.wait_for_selector) {
                    await p.waitForSelector(args.wait_for_selector, { timeout: 5000 });
                }
                const html = await p.content();
                const markdown = turndownService.turndown(html);
                return `--- Page Title: ${await p.title()} ---\n\n${markdown.slice(0, 10000)}${markdown.length > 10000 ? '\n\n(Content truncated...)' : ''}`;
            }
            case "take_screenshot": {
                const fileName = `screenshot_${args.name || Date.now()}.png`;
                const filePath = path.join(process.cwd(), 'data', fileName);
                await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true });
                await p.screenshot({ path: filePath, fullPage: true });
                return `Screenshot saved to: ${filePath}`;
            }
            case "click_element": {
                await p.click(args.selector);
                return `Clicked element: ${args.selector}`;
            }
            case "type_text": {
                await p.type(args.selector, args.text);
                return `Typed into ${args.selector}`;
            }
            default:
                return `Error: Unknown browser tool ${name}`;
        }
    } catch (err) {
        return `Error interacting with browser: ${err instanceof Error ? err.message : String(err)}`;
    }
}

export async function closeBrowser() {
    if (browser) {
        await browser.close();
        browser = null;
        context = null;
        page = null;
    }
}

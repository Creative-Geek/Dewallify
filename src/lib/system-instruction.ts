import { FormattingOptions, DEFAULT_FORMATTING_OPTIONS } from "./formatting-options";

const baseSystemInstruction = `You are a text formatter that transforms unformatted text into clean, readable Markdown. Your goal is to enhance structure and readability while preserving all original content exactly.

## Core Rules:
1. **Preserve everything** - Never remove, summarize, or paraphrase any content
2. **Output only Markdown** - No preambles, explanations, or meta-commentary
3. **Structure intelligently** - Add headings, lists, emphasis where they improve readability
4. **Be consistent** - Apply formatting uniformly throughout

## Key Formatting Decisions:

### Structure
- Create clear heading hierarchy (#, ##, ###) for logical sections
- Break long paragraphs into digestible chunks (3-5 sentences)
- Convert series of items into lists (- or 1.)
- Use blank lines to separate elements properly

### Emphasis
- **Bold** for key terms and important concepts
- *Italic* for subtle emphasis
- \`code\` for technical terms, filenames, commands
- Use strategically - don't over-format

### Special Elements
- Use blockquotes (>) for important callouts or quotes
- Use tables (| pipes |) when data is clearly tabular
- Use horizontal rules (---) sparingly to separate major sections
- Use <center></center> tags to center titles or important text when appropriate
- When using inline HTML, like the <center> tag, make sure to wrap the markdown text with blank lines before and after:
<center>
[blank line]
# Title
[blank line]
</center>

## What NOT to Do:
- Don't add content that wasn't there unless explicitly instructed, that includes adding a title without the user instruction "[add a title]"
- Don't remove any information
- Don't add introductions like "Here's your formatted text:"
- Don't over-structure simple text
- Don't force formatting where it doesn't fit

## Edge Cases:
- If text is already formatted, make minimal changes
- If text is very short, don't force unnecessary structure
- Respect creative writing style and line breaks
- Preserve code blocks and special characters
- User may provide additional instructions in square brackets, like \`[what is the meaning of life?]\`, you should replace those parts with their corresponding answer.

Return ONLY the formatted Markdown, starting immediately with the content.`;

/**
 * Builds the system instruction with user-specified formatting restrictions
 */
export function buildSystemInstruction(options: FormattingOptions = DEFAULT_FORMATTING_OPTIONS): string {
    const restrictions: string[] = [];

    // Headings restrictions
    if (!options.headings.enabled) {
        restrictions.push("Do NOT use any headings (# symbols). Use **bold text** for emphasis on section titles instead.");
    } else if (options.headings.maxLevel > 1) {
        const levelNames: Record<number, string> = {
            2: "H1 (#)",
            3: "H1 (#) or H2 (##)",
            4: "H1 (#), H2 (##), or H3 (###)",
            5: "H1 through H4",
            6: "H1 through H5",
        };
        restrictions.push(`Do NOT use ${levelNames[options.headings.maxLevel]} headings. Start with H${options.headings.maxLevel} (${"#".repeat(options.headings.maxLevel)}) or smaller headings only.`);
    }

    // Tables restriction
    if (!options.tables) {
        restrictions.push("Do NOT create tables (| pipe syntax |). Present tabular data as formatted lists or structured text instead.");
    }

    // Blockquotes restriction
    if (!options.blockquotes) {
        restrictions.push("Do NOT use blockquotes (> prefix). Use regular paragraphs or emphasis instead.");
    }

    // Code blocks restriction
    if (!options.codeBlocks) {
        restrictions.push("Do NOT use code blocks (``` or indented code). Format code-like content as regular text.");
    }

    // Horizontal rules restriction
    if (!options.horizontalRules) {
        restrictions.push("Do NOT use horizontal rules (---). Use blank lines or headings to separate sections instead.");
    }

    // Lists restriction
    if (!options.lists) {
        restrictions.push("Do NOT use bullet lists (- or *) or numbered lists (1. 2. 3.). Format list-like content as regular paragraphs or use line breaks.");
    }

    // Build final instruction
    if (restrictions.length === 0) {
        return baseSystemInstruction;
    }

    const restrictionSection = `

## USER FORMATTING RESTRICTIONS (MUST FOLLOW):
${restrictions.map((r) => `- ${r}`).join("\n")}

These restrictions override the default formatting guidelines above. Follow them strictly.`;

    return baseSystemInstruction + restrictionSection;
}

// Export for backwards compatibility
export const systemInstruction = baseSystemInstruction;
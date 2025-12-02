// Formatting options that control which Markdown elements the AI will generate

export interface FormattingOptions {
    headings: {
        enabled: boolean;
        maxLevel: 1 | 2 | 3 | 4 | 5 | 6; // 1 = allow all (H1+), 2 = H2 and below only, etc.
    };
    tables: boolean;
    blockquotes: boolean;
    codeBlocks: boolean;
    horizontalRules: boolean;
    lists: boolean;
}

export const DEFAULT_FORMATTING_OPTIONS: FormattingOptions = {
    headings: { enabled: true, maxLevel: 1 },
    tables: true,
    blockquotes: true,
    codeBlocks: true,
    horizontalRules: true,
    lists: true,
};

// Heading level options for the dropdown
export const HEADING_LEVEL_OPTIONS = [
    { value: 1, label: "H1 (All levels)" },
    { value: 2, label: "H2 and below" },
    { value: 3, label: "H3 and below" },
    { value: 4, label: "H4 and below" },
] as const;

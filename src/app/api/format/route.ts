import { GoogleGenAI, HarmBlockThreshold, HarmCategory } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    console.log("API route called");
    const { text } = await request.json();
    console.log("Text received, length:", text?.length);

    if (!text || typeof text !== "string") {
      console.error("Invalid input text received:", typeof text);
      return NextResponse.json(
        { error: "Invalid input text" },
        { status: 400 },
      );
    }


    // The API is available by default. Any environment-based API key checks
    // are intentionally removed so callers can use the endpoint without a
    // separate status probe. The AI client will still attempt to initialize
    // using any configured GEMINI_API_KEY if present.

    // Initialize the Google AI client
    console.log("Initializing Google AI client...");
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const config = {
      thinkingConfig: {
        thinkingBudget: -1,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ],
      systemInstruction: [
        {
          text: `You are a text formatter that transforms unformatted text into clean, readable Markdown. Your goal is to enhance structure and readability while preserving all original content exactly.

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
- Don't add content that wasn't there
- Don't remove any information
- Don't add introductions like "Here's your formatted text:"
- Don't over-structure simple text
- Don't force formatting where it doesn't fit

## Edge Cases:
- If text is already formatted, make minimal changes
- If text is very short, don't force unnecessary structure
- Respect creative writing style and line breaks
- Preserve code blocks and special characters

Return ONLY the formatted Markdown, starting immediately with the content.`,
        },
      ],
    };

    const model = "gemini-flash-latest";
    const contents = [
      {
        role: "user",
        parts: [
          {
            text: text,
          },
        ],
      },
    ];

    console.log("Starting content generation...");
    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });
    console.log("Content generation started successfully");

    // Create a readable stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let fullText = "";

          for await (const chunk of response) {
            const chunkText = chunk.text;
            if (chunkText) {
              fullText += chunkText;
            }
          }

          // Send the complete formatted text
          controller.enqueue(
            encoder.encode(
              JSON.stringify({
                formatted: fullText.trim(),
              }),
            ),
          );
          controller.close();
        } catch (error) {
          console.error("Error processing stream:", error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Error formatting text:", error);
    const errorObj = error as any;
    console.error("Error details:", {
      name: errorObj?.name,
      message: errorObj?.message,
      stack: errorObj?.stack,
    });

    // Check if it's a Gemini API specific error
    if (errorObj?.message?.includes("API_KEY_INVALID")) {
      return NextResponse.json(
        {
          error:
            "Invalid API key. Please check your GEMINI_API_KEY in .env.local",
        },
        { status: 500 },
      );
    }

    if (
      errorObj?.message?.includes("quota") ||
      errorObj?.message?.includes("limit")
    ) {
      return NextResponse.json(
        { error: "API quota exceeded. Please try again later." },
        { status: 429 },
      );
    }

    return NextResponse.json(
      {
        error: `Failed to format text: ${errorObj?.message || "Unknown error"}`,
      },
      { status: 500 },
    );
  }
}

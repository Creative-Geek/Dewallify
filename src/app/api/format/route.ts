// This API route handles text formatting requests. It receives text and a provider, then uses the selected AI provider to format the text as Markdown based on a detailed system instruction. It streams the formatted text back to the client.

import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createGroq } from '@ai-sdk/groq';
import { createCerebras } from '@ai-sdk/cerebras';
import { streamText, CoreMessage } from 'ai';
import { NextRequest, NextResponse } from "next/server";
import { HarmBlockThreshold, HarmCategory } from "@google/genai"; // Keep for safety settings enum

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    console.log("API route called");
    const { text, provider } = await request.json();
    console.log("Text received, length:", text?.length, "Provider:", provider);

    if (!text || typeof text !== "string") {
      console.error("Invalid input text received:", typeof text);
      return NextResponse.json(
        { error: "Invalid input text" },
        { status: 400 },
      );
    }

    let llm;

    // Dynamically select the provider and model
    // Model selection is centralized here in the backend
    switch (provider) {
      case 'groq':
        const groq = createGroq({
          apiKey: process.env.GROQ_API_KEY,
        });
        llm = groq('moonshotai/kimi-k2-instruct-0905');
        break;

      case 'google':
        const google = createGoogleGenerativeAI({
          apiKey: process.env.GOOGLE_API_KEY, // Use GOOGLE_API_KEY for AI SDK Google provider
        });
        llm = google('gemini-2.5-flash');
        break;

      case 'cerebras':
        const cerebras = createCerebras({
          apiKey: process.env.CEREBRAS_API_KEY,
        });
        llm = cerebras('llama-4-maverick-17b-128e-instruct');
        break;

      default: // Default to OpenAI
        const openai = createOpenAI({
          apiKey: process.env.OPENAI_API_KEY,
          baseURL: process.env.OPENAI_API_BASE,
        });
        llm = openai('gpt-5-chat-latest:free');
        break;
    }

    const systemInstruction = `You are a text formatter that transforms unformatted text into clean, readable Markdown. Your goal is to enhance structure and readability while preserving all original content exactly.

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
- 
code
 for technical terms, filenames, commands
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
- User may provide additional instructions in [] like [what is the meaning of life?], you should replace those parts with their corresponding answer.

Return ONLY the formatted Markdown, starting immediately with the content.`;

    // Construct messages for the AI SDK
    const messages: CoreMessage[] = [
      { role: 'system', content: systemInstruction },
      { role: 'user', content: text },
    ];

    // Note: AI SDK's streamText does not directly support safetySettings in the same way
    // as GoogleGenAI's generateContentStream. Safety settings would typically be configured
    // at the model provider level or handled by the model itself.
    // For Google models, the AI SDK's createGoogleGenerativeAI might have its own way
    // of handling safety, or it might rely on default API settings.
    // For now, we'll omit the explicit safetySettings from the streamText call.

    const result = streamText({
      model: llm,
      messages: messages,
    });

    // Respond with the stream, sending chunks as they arrive
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.textStream) {
            // Send each chunk immediately as it arrives
            controller.enqueue(
              encoder.encode(
                JSON.stringify({
                  chunk: chunk,
                }) + '\n',
              ),
            );
          }
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
        "Connection": "keep-alive",
        "Transfer-Encoding": "chunked",
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

    // Check for specific API key errors
    if (errorObj?.message?.includes("API_KEY_INVALID")) {
      return NextResponse.json(
        {
          error:
            "Invalid API key. Please check your environment variables for the selected provider.",
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
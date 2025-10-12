// This API route handles text formatting requests. It receives text and a provider, then uses the selected AI provider to format the text as Markdown based on a detailed system instruction. It streams the formatted text back to the client.

import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createGroq } from '@ai-sdk/groq';
import { createCerebras } from '@ai-sdk/cerebras';
import { streamText, CoreMessage } from 'ai';
import { NextRequest, NextResponse } from "next/server";
import { systemInstruction } from "@/lib/system-instruction";

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
      case 'gemini': // alias for Google Gemini
        const google = createGoogleGenerativeAI({
          apiKey: process.env.GEMINI_API_KEY,
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

    // Construct messages for the AI SDK
    const messages: CoreMessage[] = [
      { role: 'system', content: systemInstruction },
      { role: 'user', content: text },
    ];

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
// This API route handles text formatting requests. It receives text and a provider, then uses the selected AI provider to format the text as Markdown based on a detailed system instruction. It streams the formatted text back to the client.

import { streamText } from "ai";
import { createModel } from "@/lib/providers";
import { resolveProvider } from "@/lib/modes";
import { NextRequest, NextResponse } from "next/server";
import { buildSystemInstruction } from "@/lib/system-instruction";
import {
  DEFAULT_FORMATTING_OPTIONS,
  type FormattingOptions,
} from "@/lib/formatting-options";

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    console.log("API route called");
    const { text, provider, formattingOptions } = await request.json();

    // Use provided formatting options or defaults
    const options: FormattingOptions =
      formattingOptions || DEFAULT_FORMATTING_OPTIONS;

    if (!text || typeof text !== "string") {
      console.error("Invalid input text received:", typeof text);
      return NextResponse.json(
        { error: "Invalid input text" },
        { status: 400 },
      );
    }

    // Enforce maximum input length for security
    if (typeof text === "string" && text.length > 25000) {
      console.warn("Input exceeds maximum allowed length:", text.length);
      return NextResponse.json(
        { error: "Input too long. Maximum allowed is 25000 characters." },
        { status: 413 },
      );
    }

    const resolvedProvider = resolveProvider(provider);
    const llm = createModel(resolvedProvider);
    console.log(
      "Text received, length:",
      text?.length,
      " | Mode:",
      provider,
      " | Provider:",
      resolvedProvider,
      " | Model:",
      (llm as { modelId: string }).modelId,
    );

    // Construct messages for the AI SDK
    const result = streamText({
      model: llm,
      system: buildSystemInstruction(options),
      prompt: text,
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
                }) + "\n",
              ),
            );
          }
          controller.close();
        } catch (error) {
          console.error("Error processing stream:", error);
          // Send a generic error to the frontend — never leak model names or internal details
          const message =
            "Something went wrong with the AI provider. Please try again or switch providers.";
          try {
            controller.enqueue(
              encoder.encode(JSON.stringify({ error: message }) + "\n"),
            );
          } catch {
            // controller may already be errored, ignore
          }
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
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

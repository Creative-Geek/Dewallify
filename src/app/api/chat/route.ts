import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createGroq } from '@ai-sdk/groq';
import { createCerebras } from '@ai-sdk/cerebras';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        const { messages, provider } = await req.json();

        let llm;

        // Dynamically select the provider
        switch (provider) {
            case 'groq':
                // Groq uses an OpenAI-compatible API
                const groq = createGroq({
                    apiKey: process.env.GROQ_API_KEY,
                });
                llm = groq('llama3-8b-8192');
                break;

            case 'google':
                const google = createGoogleGenerativeAI({
                    apiKey: process.env.GOOGLE_API_KEY,
                });
                llm = google('models/gemini-1.5-pro-latest');
                break;

            case 'cerebras':
                const cerebras = createCerebras({
                    apiKey: process.env.CEREBRAS_API_KEY,
                });
                llm = cerebras('llama3.1-8b');
                break;

            default: // Default to OpenAI
                const openai = createOpenAI({
                    apiKey: process.env.OPENAI_API_KEY,
                });
                llm = openai('gpt-4o');
                break;
        }

        const result = streamText({
            model: llm,
            messages,
        });

        // Respond with the stream
        return result.toUIMessageStreamResponse();
    } catch (error) {
        return new Response(`Error: ${(error as Error).message}`, { status: 500 });
    }
}
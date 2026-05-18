import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { createCerebras } from "@ai-sdk/cerebras";
import type { LanguageModel } from "ai";

export function createModel(provider: string): LanguageModel {
  switch (provider) {
    case "groq": {
      const groq = createGroq({
        apiKey: process.env.GROQ_API_KEY,
      });
      return groq("moonshotai/llama-3.3-70b-versatile");
    }

    case "google":
    case "gemini": {
      const google = createGoogleGenerativeAI({
        apiKey: process.env.GEMINI_API_KEY,
      });
      return google("gemini-2.5-flash");
    }

    case "cerebras": {
      const cerebras = createCerebras({
        apiKey: process.env.CEREBRAS_API_KEY,
      });
      return cerebras("zai-glm-4.7");
    }

    case "nvidia": {
      const rawNvidiaBase =
        process.env.NVIDIA_API_BASE || "https://integrate.api.nvidia.com/v1";
      const trimmedNvidiaBase = rawNvidiaBase.replace(/\/+$/, "");
      const nvidiaBaseURL = trimmedNvidiaBase.endsWith("/v1")
        ? trimmedNvidiaBase
        : `${trimmedNvidiaBase}/v1`;
      const nvidia = createOpenAI({
        apiKey: process.env.NVIDIA_API_KEY,
        baseURL: nvidiaBaseURL,
        name: "nvidia",
      });
      return nvidia.chat("nvidia/nemotron-3-super-120b-a12b");
    }

    case "electron-hub": {
      const electronHub = createOpenAI({
        apiKey: process.env.ELECTRON_HUB_API_KEY,
        baseURL: process.env.ELECTRON_HUB_API_BASE,
        name: "electron-hub",
      });
      return electronHub.chat("gpt-oss-120b:free");
    }

    default: {
      const openai = createOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: process.env.OPENAI_API_BASE,
      });
      return openai("gpt-oss-120b:free");
    }
  }
}

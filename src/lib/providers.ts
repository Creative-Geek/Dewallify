import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type { LanguageModel } from "ai";

export function createModel(provider: string, mode?: string): LanguageModel {
  switch (provider) {
    case "google":
    case "gemini": {
      const google = createGoogleGenerativeAI({
        apiKey: process.env.GEMINI_API_KEY,
      });
      const modelId =
        mode === "speed"
          ? process.env.GEMINI_SPEED_MODEL
          : process.env.GEMINI_QUALITY_MODEL;
      return google(modelId ?? "gemini-flash-latest");
    }

    case "nvidia": {
      const nvidia = createOpenAI({
        apiKey: process.env.NVIDIA_API_KEY,
        baseURL: "https://integrate.api.nvidia.com/v1",
        name: "nvidia",
      });
      return nvidia.chat(
        process.env.NVIDIA_MODEL ?? "nvidia/nemotron-3-super-120b-a12b",
      );
    }

    case "electron-hub": {
      const electronHub = createOpenAI({
        apiKey: process.env.ELECTRON_HUB_API_KEY,
        baseURL: process.env.ELECTRON_HUB_API_BASE,
        name: "electron-hub",
      });
      return electronHub.chat(
        process.env.ELECTRON_HUB_MODEL ?? "gpt-oss-120b:free",
      );
    }

    default: {
      const openai = createOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: process.env.OPENAI_API_BASE,
      });
      return openai(process.env.OPENAI_MODEL ?? "gpt-oss-120b:free");
    }
  }
}

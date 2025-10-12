export const PROVIDER_MODES = [
    { id: "cerebras", label: "Speed" },
    { id: "gemini", label: "Quality" },
    // { id: "claude", label: "Creative" },
] as const;

export type ProviderId = (typeof PROVIDER_MODES)[number]["id"];

export const DEFAULT_PROVIDER: ProviderId = PROVIDER_MODES[0].id;

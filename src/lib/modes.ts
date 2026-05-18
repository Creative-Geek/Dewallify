export const MODES = [
  { id: "speed", label: "Speed", provider: "cerebras" },
  { id: "quality", label: "Quality", provider: "gemini" },
] as const;

export type ModeId = (typeof MODES)[number]["id"];

export const DEFAULT_MODE: ModeId = MODES[0].id;

export function resolveProvider(mode: string): string {
  const found = MODES.find((m) => m.id === mode);
  return found?.provider ?? mode;
}

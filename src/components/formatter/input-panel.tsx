// src/components/formatter/input-panel.tsx
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Sparkles, FileText, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PROVIDER_MODES, type ProviderId } from "@/lib/providers";
import { Ubuntu } from "next/font/google";

const ubuntu = Ubuntu({
  subsets: [
    "latin",
    "latin-ext",
    "cyrillic",
    "cyrillic-ext",
    "greek",
    "greek-ext",
  ],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

interface InputPanelProps {
  value: string;
  onChange: (value: string) => void;
  isFormatting?: boolean;
  onFormat: () => void;
  onClear: () => void;
  isInputEmpty?: boolean;
  provider?: ProviderId;
  onProviderChange: (provider: ProviderId) => void;
}

export function InputPanel({
  value,
  onChange,
  isFormatting = false,
  onFormat,
  onClear,
  isInputEmpty,
  provider,
  onProviderChange,
}: InputPanelProps) {
  return (
    <Card
      className={`${ubuntu.className} flex flex-col h-full gap-4 rounded-[2rem] border-2 border-border bg-card p-6 shadow-sm animate-slideInLeft`}
    >
      <div className="flex items-center gap-2">
        <div className="rounded-full bg-secondary p-2">
          <FileText className="h-5 w-5 text-secondary-foreground" />
        </div>
        <h2 className="text-xl font-semibold text-card-foreground">
          Your Text
        </h2>
      </div>

      <Textarea
        id="inputText"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your unformatted text here... It can be notes, emails, articles, or any wall of text that needs structure."
        className="flex-1 min-h-[300px] resize-none rounded-3xl border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus:animate-glowFocus transition-all duration-300"
        dir="auto"
        maxLength={8000}
      />

      <div className="flex flex-col md:flex-row gap-3 items-center">
        <Button
          onClick={onFormat}
          disabled={isFormatting || isInputEmpty}
          className="w-full md:flex-1 rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:scale-105 hover:shadow-lg transition-all duration-300"
          size="lg"
        >
          {isFormatting ? (
            <>
              <Wand2 className="mr-2 h-5 w-5 animate-spin" />
              Formatting...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Format with AI
            </>
          )}
        </Button>

        <div className="flex w-full md:w-auto items-center justify-between md:justify-start gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground md:block hidden">
              Mode:
            </span>
            <div className="inline-flex rounded-full overflow-hidden border-1">
              {PROVIDER_MODES.map(({ id, label }) => {
                const isActive = provider === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onProviderChange(id)}
                    className={`px-3 py-2 text-sm transition-all duration-300 hover:scale-105 ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-background text-foreground hover:bg-muted"
                    }`}
                    aria-pressed={isActive}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <Button
            onClick={onClear}
            variant="outline"
            className="rounded-full border-2 border-border bg-background text-foreground hover:bg-muted hover:scale-105 hover:shadow-md transition-all duration-300"
            size="lg"
          >
            Clear
          </Button>
        </div>
      </div>
    </Card>
  );
}

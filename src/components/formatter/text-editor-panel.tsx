// This component renders a text editor panel that can be configured as either an input for raw text or an output for formatted text. It handles user input, displays formatted content, and provides controls for formatting, clearing, and copying text.

import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Sparkles, FileText, Wand2, Copy, Check } from "lucide-react";
import DOMPurify from "dompurify";
import { marked } from "marked";
import { Button } from "@/components/ui/button";
import { PROVIDER_MODES, type ProviderId } from "@/lib/providers";
import { Ubuntu } from "next/font/google";

// Load Ubuntu font with broad language support and common weights
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

interface TextEditorPanelProps {
  type: "input" | "output";
  value: string;
  onChange?: (value: string) => void;
  isFormatting?: boolean;
  onCopy?: () => void;
  isCopied?: boolean;
  onFormat?: () => void;
  onClear?: () => void;
  isInputEmpty?: boolean;
  provider?: ProviderId;
  onProviderChange?: (provider: ProviderId) => void;
}

export function TextEditorPanel({
  type,
  value,
  onChange,
  isFormatting = false,
  onCopy,
  isCopied = false,
  onFormat,
  onClear,
  isInputEmpty,
  provider,
  onProviderChange,
}: TextEditorPanelProps) {
  const isInput = type === "input";

  if (isInput) {
    return (
      <Card
        className={`${ubuntu.className} flex flex-col h-full gap-4 rounded-[2rem] border-2 border-border bg-card p-6 shadow-sm`}
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
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="Paste your unformatted text here... It can be notes, emails, articles, or any wall of text that needs structure."
          className="flex-1 min-h-[300px] resize-none rounded-3xl border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
          dir="auto"
        />

        {/* Responsive control layout */}
        <div className="flex flex-col md:flex-row gap-3 items-center">
          {/* Row 1: Format button full-width on mobile */}
          <Button
            onClick={onFormat}
            disabled={isFormatting || isInputEmpty}
            className="w-full md:flex-1 rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 transition-all duration-300"
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

          {/* Row 2 on mobile, same line on desktop */}
          <div className="flex w-full md:w-auto items-center justify-between md:justify-start gap-3">
            {/* Mode Switcher */}
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
                      onClick={() => onProviderChange?.(id)}
                      className={`px-3 py-2 text-sm ${
                        isActive
                          ? "bg-primary text-primary-foreground transition-all duration-300"
                          : "bg-background text-foreground hover:bg-muted transition-all duration-300"
                      }`}
                      aria-pressed={isActive}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Clear button */}
            <Button
              onClick={onClear}
              variant="outline"
              className="rounded-full border-2 border-border bg-background text-foreground hover:bg-muted transition-all duration-300"
              size="lg"
            >
              Clear
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Output Panel
  return (
    <Card
      className={`${ubuntu.className} h-full bg-white/80 border-2 rounded-3xl p-6 shadow-lg`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-accent p-2">
            <Sparkles className="h-5 w-5 text-secondary-foreground" />
          </div>
          <h2 className="text-xl font-semibold ">Formatted Output</h2>
          {isFormatting && (
            <div className="animate-spin">
              <Sparkles className="w-5 h-5 text-[#FFB4A2]" />
            </div>
          )}
        </div>
        {value && onCopy && (
          <button
            onClick={onCopy}
            className="rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 px-3 py-2 text-sm flex items-center font-semibold transition-all duration-300"
          >
            {isCopied ? (
              <>
                <Check className="mr-2 h-4 w-5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-5" />
                Copy
              </>
            )}
          </button>
        )}
      </div>
      <div className="min-h-[500px] max-h-[500px] overflow-y-auto border-2 rounded-2xl p-6 pt-3 pb-3 bg-white/50">
        {value ? (
          <div
            className="prose prose-sm max-w-none text-[#6B5B4F] [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-6 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-3 [&_h2]:mt-5 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:mt-4 [&_p]:mb-3 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:list-inside [&_ul]:mb-3 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:mb-3 [&_ol]:space-y-1 [&_li]:mb-1 [&_li]:leading-relaxed [&_strong]:font-bold [&_strong]:text-[#FFB4A2] [&_em]:italic [&_em]:text-[#E0BBE4] [&_code]:bg-[#E0BBE4]/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono [&_pre]:bg-[#E0BBE4]/10 [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:text-sm [&_pre]:font-mono [&_pre]:overflow-x-auto [&_pre]:mb-3 [&_blockquote]:border-l-4 [&_blockquote]:border-[#FFB4A2] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-3 [&_blockquote]:text-[#8B7E74] [&_table]:min-w-full [&_table]:border-2 [&_table]:border-[#E0BBE4]/20 [&_table]:rounded-lg [&_table]:mb-3 [&_th]:border [&_th]:border-[#E0BBE4]/20 [&_th]:px-3 [&_th]:py-2 [&_th]:font-semibold [&_th]:text-left [&_th]:text-[#6B5B4F] [&_th]:bg-[#E0BBE4]/10 [&_td]:border [&_td]:border-[#E0BBE4]/20 [&_td]:px-3 [&_td]:py-2 [&_td]:text-[#6B5B4F] [&_hr]:my-6 [&_hr]:border-t-2 [&_hr]:border-[#E0BBE4]/20 [&_a]:text-[#FFB4A2] [&_a]:hover:text-[#E0BBE4] [&_a]:underline"
            dir="auto"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(marked.parse(value) as string),
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-center">
            <div className="space-y-2">
              <div className="mx-auto rounded-full bg-muted p-4">
                <Wand2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                Your formatted text will appear here
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

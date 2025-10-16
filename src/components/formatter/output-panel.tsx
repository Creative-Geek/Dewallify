// src/components/formatter/output-panel.tsx
import { Card } from "@/components/ui/card";
import { Sparkles, Copy, Check, Wand2 } from "lucide-react";
import DOMPurify from "dompurify";
import { marked } from "marked";
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

interface OutputPanelProps {
  value: string;
  isFormatting?: boolean;
  onCopy: () => void;
  isCopied?: boolean;
}

export function OutputPanel({
  value,
  isFormatting = false,
  onCopy,
  isCopied = false,
}: OutputPanelProps) {
  return (
    <Card
      className={`${ubuntu.className} h-full w-full min-w-0 max-w-full overflow-x-hidden bg-white/80 border-2 rounded-3xl p-6 shadow-lg animate-slideInRight`}
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
            className={`rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 px-3 py-2 text-sm flex items-center font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md ${
              isCopied ? "animate-pulse-custom" : ""
            }`}
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
      <div className="min-h-[500px] max-h-[500px] w-full max-w-full min-w-0 overflow-y-auto overflow-x-auto border-2 rounded-2xl p-6 pt-3 pb-3 bg-white/50">
        {value ? (
          <div
            className="w-full min-w-0 break-words prose prose-sm max-w-none text-[#6B5B4F] [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-6 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-3 [&_h2]:mt-5 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:mt-4 [&_p]:mb-3 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:list-inside [&_ul]:mb-3 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:mb-3 [&_ol]:space-y-1 [&_li]:mb-1 [&_li]:leading-relaxed [&_strong]:font-bold [&_strong]:text-[#FFB4A2] [&_em]:italic [&_em]:text-[#E0BBE4] [&_code]:bg-[#E0BBE4]/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono [&_pre]:bg-[#E0BBE4]/10 [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:text-sm [&_pre]:font-mono [&_pre]:overflow-x-auto [&_pre]:mb-3 [&_blockquote]:border-l-4 [&_blockquote]:border-[#FFB4A2] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-3 [&_blockquote]:text-[#8B7E74] [&_table]:block [&_table]:max-w-full [&_table]:min-w-max md:[&_table]:min-w-0 [&_table]:overflow-x-auto md:[&_table]:overflow-visible [&_table]:table-fixed md:[&_table]:table-auto [&_table]:border-2 [&_table]:border-[#E0BBE4]/20 [&_table]:rounded-lg [&_table]:mb-3 [&_th]:border [&_th]:border-[#E0BBE4]/20 [&_th]:px-3 [&_th]:py-2 [&_th]:font-semibold [&_th]:text-left [&_th]:text-[#6B5B4F] [&_th]:bg-[#E0BBE4]/10 [&_th]:whitespace-normal [&_th]:break-words [&_td]:border [&_td]:border-[#E0BBE4]/20 [&_td]:px-3 [&_td]:py-2 [&_td]:text-[#6B5B4F] [&_td]:whitespace-normal [&_td]:break-words [&_hr]:my-6 [&_hr]:border-t-2 [&_hr]:border-[#E0BBE4]/20 [&_a]:text-[#FFB4A2] [&_a]:hover:text-[#E0BBE4] [&_a]:underline"
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

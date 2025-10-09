import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface FormattingControlsProps {
  onFormat: () => void;
  onClear: () => void;
  isFormatting: boolean;
  isInputEmpty: boolean;
}

export function FormattingControls({
  onFormat,
  onClear,
  isFormatting,
  isInputEmpty,
}: FormattingControlsProps) {
  return (
    <div className="text-center mb-8 flex justify-center gap-4">
      <Button
        onClick={onFormat}
        disabled={isFormatting || isInputEmpty}
        className="relative px-8 py-6 text-lg font-semibold text-white bg-gradient-to-r from-[#FFB4A2] to-[#E0BBE4] hover:from-[#FFB4A2]/90 hover:to-[#E0BBE4]/90 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <Sparkles className="w-5 h-5 mr-2 inline" />
        {isFormatting ? "Formatting..." : "Format with AI"}
      </Button>

      <Button
        onClick={onClear}
        variant="outline"
        className="px-6 py-6 text-lg font-semibold rounded-full border-2 border-[#8B7E74] text-[#6B5B4F] hover:bg-[#8B7E74]/10 transition-all"
      >
        Clear All
      </Button>
    </div>
  );
}

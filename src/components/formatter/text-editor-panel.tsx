// This component renders a text editor panel that can be configured as either an input for raw text or an output for formatted text. It handles user input, displays formatted content, and provides controls for formatting, clearing, and copying text.

import { type ProviderId } from "@/lib/providers";
import { InputPanel } from "./input-panel";
import { OutputPanel } from "./output-panel";

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
  onSampleText?: () => void;
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
  onSampleText,
}: TextEditorPanelProps) {
  if (type === "input") {
    return (
      <InputPanel
        value={value}
        onChange={onChange!}
        isFormatting={isFormatting}
        onFormat={onFormat!}
        onClear={onClear!}
        isInputEmpty={isInputEmpty}
        provider={provider}
        onProviderChange={onProviderChange!}
        onSampleText={onSampleText}
      />
    );
  }

  // Output Panel
  return (
    <OutputPanel
      value={value}
      isFormatting={isFormatting}
      onCopy={onCopy!}
      isCopied={isCopied}
    />
  );
}

// src/components/formatter/formatting-options-panel.tsx
// Collapsible panel for controlling which Markdown elements the AI generates

import { Settings, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import {
  type FormattingOptions,
  HEADING_LEVEL_OPTIONS,
} from "@/lib/formatting-options";

interface FormattingOptionsPanelProps {
  options: FormattingOptions;
  onChange: (options: FormattingOptions) => void;
  /**
   * Controlled visibility for inline rendering. When false, the panel collapses.
   */
  open?: boolean;
}

// Custom Toggle Switch component matching the app's styling
function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`
        relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full 
        border-2 border-transparent transition-all duration-300
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-50
        ${checked ? "bg-primary" : "bg-muted"}
      `}
    >
      <span
        className={`
          pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg 
          ring-0 transition-transform duration-300 ease-in-out
          ${checked ? "translate-x-5" : "translate-x-0"}
        `}
      />
    </button>
  );
}

// Custom Select component matching the app's styling
function HeadingLevelSelect({
  value,
  onChange,
  disabled = false,
}: {
  value: number;
  onChange: (value: 1 | 2 | 3 | 4 | 5 | 6) => void;
  disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = HEADING_LEVEL_OPTIONS.find((o) => o.value === value);

  return (
    <div className="relative" ref={selectRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-between gap-2 px-3 py-1.5 text-sm
          rounded-full border-2 border-border bg-background text-foreground
          transition-all duration-300 hover:bg-muted hover:scale-105
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
          disabled:cursor-not-allowed disabled:opacity-50
          min-w-[140px]
        `}
      >
        <span>{selectedOption?.label || "Select level"}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-150 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown with fast fade in/out scoped to this component */}
      <div
        className={`
          absolute z-50 mt-1 w-full
          rounded-2xl border-2 border-border bg-background shadow-lg
          overflow-hidden
          transition-[opacity,transform] duration-150 ease-out origin-top
          ${
            isOpen && !disabled
              ? "opacity-100 scale-y-100 pointer-events-auto"
              : "opacity-0 scale-y-95 pointer-events-none"
          }
        `}
      >
        {HEADING_LEVEL_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              onChange(option.value as 1 | 2 | 3 | 4 | 5 | 6);
              setIsOpen(false);
            }}
            className={`
              w-full px-3 py-2 text-sm text-left
              transition-colors duration-100
              ${
                value === option.value
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-foreground"
              }
            `}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// Option row component
function OptionRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export function FormattingOptionsPanel({
  options,
  onChange,
  open = true,
}: FormattingOptionsPanelProps) {
  const updateOption = <K extends keyof FormattingOptions>(
    key: K,
    value: FormattingOptions[K]
  ) => {
    onChange({ ...options, [key]: value });
  };

  const updateHeadingOption = (
    key: keyof FormattingOptions["headings"],
    value: boolean | number
  ) => {
    onChange({
      ...options,
      headings: { ...options.headings, [key]: value },
    });
  };

  // Inline, collapsible container with smoother max-height transition to avoid page overflow
  return (
    <div
      aria-hidden={!open}
      className={
        `w-full overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ` +
        (open ? "max-h-[520px] opacity-100 mt-3" : "max-h-0 opacity-0 mt-0")
      }
    >
      <div className="rounded-2xl border-2 border-border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between pb-2">
          <h3 className="text-sm font-semibold text-foreground">
            Formatting Options
          </h3>
        </div>

        <div className="py-1">
          {/* Headings */}
          <OptionRow label="Headings" description="Use # heading syntax">
            <ToggleSwitch
              checked={options.headings.enabled}
              onChange={(checked) => updateHeadingOption("enabled", checked)}
            />
          </OptionRow>

          {/* Heading Max Level - only show when headings are enabled */}
          {options.headings.enabled && (
            <OptionRow
              label="Min Heading Level"
              description="Smallest heading to use"
            >
              <HeadingLevelSelect
                value={options.headings.maxLevel}
                onChange={(value) => updateHeadingOption("maxLevel", value)}
              />
            </OptionRow>
          )}

          <div className="border-t border-border my-2" />

          {/* Tables */}
          <OptionRow
            label="Tables"
            description="Create tables for tabular data"
          >
            <ToggleSwitch
              checked={options.tables}
              onChange={(checked) => updateOption("tables", checked)}
            />
          </OptionRow>

          {/* Lists */}
          <OptionRow label="Lists" description="Bullet and numbered lists">
            <ToggleSwitch
              checked={options.lists}
              onChange={(checked) => updateOption("lists", checked)}
            />
          </OptionRow>

          {/* Blockquotes */}
          <OptionRow
            label="Blockquotes"
            description="Quote blocks with > prefix"
          >
            <ToggleSwitch
              checked={options.blockquotes}
              onChange={(checked) => updateOption("blockquotes", checked)}
            />
          </OptionRow>

          {/* Code Blocks */}
          <OptionRow label="Code Blocks" description="Fenced code with ```">
            <ToggleSwitch
              checked={options.codeBlocks}
              onChange={(checked) => updateOption("codeBlocks", checked)}
            />
          </OptionRow>

          {/* Horizontal Rules */}
          <OptionRow
            label="Horizontal Rules"
            description="Section dividers with ---"
          >
            <ToggleSwitch
              checked={options.horizontalRules}
              onChange={(checked) => updateOption("horizontalRules", checked)}
            />
          </OptionRow>
        </div>

        <div className="pt-2">
          <p className="text-xs text-muted-foreground text-center">
            Disabled elements won&apos;t be generated
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import DOMPurify from "dompurify";
import { marked } from "marked";

interface UseTextFormattingProps {
    provider?: string;
}

export function useTextFormatting({ provider = "groq" }: UseTextFormattingProps = {}) {
    const [inputText, setInputText] = useState("");
    const [formattedText, setFormattedText] = useState("");
    const [isFormatting, setIsFormatting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const formatText = useCallback(async () => {
        if (!inputText.trim()) {
            setError("Please paste some text to format");
            return;
        }

        setIsFormatting(true);
        setError(null);
        setFormattedText("");

        try {
            const response = await fetch("/api/format", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: inputText,
                    provider,
                }),
            });

            if (!response.ok) {
                throw new Error(`API responded with status: ${response.status}`);
            }

            // Handle streaming response
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) {
                throw new Error("No response body reader available");
            }

            let accumulatedText = "";
            let lastUpdateText = "";
            let updateCounter = 0;

            while (true) {
                const { done, value } = await reader.read();

                if (done) {
                    // Final update when streaming is complete
                    if (accumulatedText !== lastUpdateText) {
                        setFormattedText(accumulatedText);
                    }
                    break;
                }

                const chunk = decoder.decode(value, { stream: true });

                // Try to parse each chunk as JSON
                try {
                    const lines = chunk.split("\n").filter((line) => line.trim());

                    for (const line of lines) {
                        if (line.trim()) {
                            const data = JSON.parse(line);
                            if (data.chunk) {
                                accumulatedText += data.chunk;
                                updateCounter++;

                                // Check for two consecutive line breaks to trigger UI update
                                // OR update every 10 chunks as fallback
                                if (
                                    (accumulatedText.includes("\n") ||
                                        updateCounter % 10 === 0) &&
                                    accumulatedText !== lastUpdateText
                                ) {
                                    setFormattedText(accumulatedText);
                                    lastUpdateText = accumulatedText;
                                }
                            } else if (data.formatted) {
                                // Handle complete response format
                                setFormattedText(data.formatted);
                                accumulatedText = data.formatted;
                                lastUpdateText = data.formatted;
                            }
                        }
                    }
                } catch (parseError) {
                    // If JSON parsing fails, treat as raw text chunk
                    accumulatedText += chunk;
                    updateCounter++;

                    // Check for two consecutive line breaks to trigger UI update
                    // OR update every 10 chunks as fallback
                    if (
                        (accumulatedText.includes("\n\n") || updateCounter % 10 === 0) &&
                        accumulatedText !== lastUpdateText
                    ) {
                        setFormattedText(accumulatedText);
                        lastUpdateText = accumulatedText;
                    }
                }
            }
        } catch (error) {
            setError("Oops! Something went wrong. Please try again.");
            console.error(error);
        } finally {
            setIsFormatting(false);
        }
    }, [inputText, provider]);

    const copyToClipboard = useCallback(async () => {
        if (!formattedText) return;

        try {
            // Use marked and DOMPurify to create consistent and safe HTML for the clipboard
            const rawHtml = marked.parse(formattedText) as string;
            const styledHtmlContent = `
                <div style="font-family: Arial, Verdana, 'Segoe UI', Tahoma, sans-serif; line-height: 1.6;">
                    ${rawHtml}
                </div>
            `;
            const htmlContent = DOMPurify.sanitize(styledHtmlContent);

            const clipboardItem = new ClipboardItem({
                "text/plain": new Blob([formattedText], { type: "text/plain" }),
                "text/html": new Blob([htmlContent], { type: "text/html" }),
            });

            await navigator.clipboard.write([clipboardItem]);
            toast({
                title: "Copied to clipboard",
                description: "Formatted text copied successfully!",
            });
        } catch (err) {
            // Fallback to plain text copy if rich text copy fails
            await navigator.clipboard.writeText(formattedText);
            toast({
                title: "Copied as plain text",
                description: "Rich text copying is not supported in your browser.",
            });
        }
    }, [formattedText, toast]);

    const clearAll = useCallback(() => {
        setInputText("");
        setFormattedText("");
        setError(null);
    }, []);

    return {
        // State
        inputText,
        setInputText,
        formattedText,
        isFormatting,
        error,

        // Actions
        formatText,
        copyToClipboard,
        clearAll,
    };
}

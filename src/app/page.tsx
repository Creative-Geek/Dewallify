"use client";

import { useState } from "react";
import Image from "next/image"; // Added Image import
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Sparkles, Copy, FileText, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DocumentFormatter() {
  const [inputText, setInputText] = useState("");
  const [formattedText, setFormattedText] = useState("");
  const [isFormatting, setIsFormatting] = useState(false);
  const { toast } = useToast();

  const handleFormat = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Oops!",
        description: "Please paste some text first",
        variant: "destructive",
      });
      return;
    }

    setIsFormatting(true);
    try {
      const response = await fetch("/api/format", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await response.json();
      setFormattedText(data.formatted);

      toast({
        title: "✨ Formatted!",
        description: "Your document is ready",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsFormatting(false);
    }
  };

  const handleCopy = async () => {
    if (!formattedText) return;

    await navigator.clipboard.writeText(formattedText);
    toast({
      title: "📋 Copied!",
      description: "Formatted text copied to clipboard",
    });
  };

  const handleClear = () => {
    setInputText("");
    setFormattedText("");
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          {/* Logo */}
          <Image
            src="/images/DeWallify-Logo.png"
            alt="DeWallify Logo"
            width={150}
            height={150}
            className="mx-auto mb-4"
            priority
          />
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
            <span className="text-sm font-medium text-primary-foreground">
              AI Powered
            </span>
          </div>
          <h1 className="mb-3 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Document Formatter
          </h1>
          <p className="text-pretty text-lg text-muted-foreground">
            Paste your plaintext and let AI transform it into beautifully
            formatted content
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Input Section */}
          <Card className="flex flex-col gap-4 rounded-[2rem] border-2 border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-secondary p-2">
                <FileText className="h-5 w-5 text-secondary-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-card-foreground">
                Your Text
              </h2>
            </div>

            <Textarea
              placeholder={`Paste your plaintext here...\n\nTry something like:\n- Meeting notes\n- Email drafts\n- Article content\n- Any unformatted text!`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[300px] resize-none rounded-3xl border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
            />

            <div className="flex gap-3">
              <Button
                onClick={handleFormat}
                disabled={isFormatting || !inputText.trim()}
                className="flex-1 rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
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

              <Button
                onClick={handleClear}
                variant="outline"
                className="rounded-full border-2 border-border bg-background text-foreground hover:bg-muted"
                size="lg"
              >
                Clear
              </Button>
            </div>
          </Card>

          {/* Output Section */}
          <Card className="flex flex-col gap-4 rounded-[2rem] border-2 border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-accent p-2">
                <Sparkles className="h-5 w-5 text-accent-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-card-foreground">
                Formatted Result
              </h2>
            </div>

            <div className="min-h-[300px] flex-1 rounded-3xl border-2 border-border bg-background p-4">
              {formattedText ? (
                <div className="prose prose-sm max-w-none text-foreground">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {formattedText}
                  </pre>
                </div>
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

            <Button
              onClick={handleCopy}
              disabled={!formattedText}
              className="w-full rounded-full bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/90"
              size="lg"
            >
              <Copy className="mr-2 h-5 w-5" />
              Copy Formatted Text
            </Button>
          </Card>
        </div>

        {/* Features */}
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <Card className="rounded-3xl border-2 border-border bg-card p-6 text-center">
            <div className="mx-auto mb-3 w-fit rounded-full bg-primary p-3">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="mb-2 font-semibold text-card-foreground">
              AI Powered
            </h3>
            <p className="text-sm text-muted-foreground">
              Smart formatting using advanced AI models
            </p>
          </Card>

          <Card className="rounded-3xl border-2 border-border bg-card p-6 text-center">
            <div className="mx-auto mb-3 w-fit rounded-full bg-secondary p-3">
              <FileText className="h-6 w-6 text-secondary-foreground" />
            </div>
            <h3 className="mb-2 font-semibold text-card-foreground">
              Professional Output
            </h3>
            <p className="text-sm text-muted-foreground">
              Get document-ready formatted text instantly
            </p>
          </Card>

          <Card className="rounded-3xl border-2 border-border bg-card p-6 text-center">
            <div className="mx-auto mb-3 w-fit rounded-full bg-accent p-3">
              <Copy className="h-6 w-6 text-accent-foreground" />
            </div>
            <h3 className="mb-2 font-semibold text-card-foreground">
              Easy Copy
            </h3>
            <p className="text-sm text-muted-foreground">
              One-click copy to use anywhere you need
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

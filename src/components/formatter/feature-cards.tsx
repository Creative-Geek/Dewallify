// This component renders a set of feature cards that highlight the key functionalities of the application.

import { Card } from "@/components/ui/card";
import { Sparkles, FileText, Copy } from "lucide-react";

export function FeatureCards() {
  const features = [
    {
      icon: (
        <Sparkles
          className="h-6 w-6 text-primary-foreground"
          strokeWidth={1.5}
        />
      ),
      title: "AI Powered",
      description: "Smart formatting using advanced AI models",
      bgColor: "bg-primary",
    },
    {
      icon: (
        <FileText
          className="h-6 w-6 text-secondary-foreground"
          strokeWidth={1.5}
        />
      ),
      title: "Professional Output",
      description: "Get a perfectly structured report for Word or Google Docs.",
      bgColor: "bg-secondary",
    },
    {
      icon: (
        <Copy className="h-6 w-6 text-accent-foreground" strokeWidth={1.5} />
      ),
      title: "One-Click Copy",
      description:
        "Copy the formatted text and paste it directly into your document.",
      bgColor: "bg-accent",
    },
  ];

  return (
    <div className="mt-12 grid gap-4 md:grid-cols-3">
      {features.map((feature, index) => (
        <Card
          key={index}
          className={`rounded-3xl border-2 border-border bg-card p-6 text-center animate-fadeInScale ${
            index === 0 ? "stagger-1" : index === 1 ? "stagger-2" : "stagger-3"
          } hover:shadow-lg transition-shadow duration-300`}
        >
          <div
            className={`mx-auto mb-3 w-fit rounded-full ${feature.bgColor} p-3`}
          >
            {feature.icon}
          </div>
          <h3 className="mb-2 font-semibold text-card-foreground">
            {feature.title}
          </h3>
          <p className="text-sm text-muted-foreground">{feature.description}</p>
        </Card>
      ))}
    </div>
  );
}

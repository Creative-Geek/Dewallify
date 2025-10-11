// This component provides a customized toast notification system for the application, built on top of the 'sonner' library.

"use client";

import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      style={
        {
          "--normal-bg": "hsl(var(--popover))",
          "--normal-border": "hsl(var(--border))",
          "--normal-text": "hsl(var(--popover-foreground))",
          "--success-bg": "#B5EAD7",
          "--success-border": "#B5EAD7",
          "--success-text": "#6B5B4F",
          "--error-bg": "#FFB4A2",
          "--error-border": "#FFB4A2",
          "--error-text": "#6B5B4F",
          "--info-bg": "#E0BBE4",
          "--info-border": "#E0BBE4",
          "--info-text": "#6B5B4F",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
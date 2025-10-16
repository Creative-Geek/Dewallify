// This component renders a styled error message card with an alert icon.

import { AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="max-w-2xl mx-auto mb-4 animate-shake">
      <Card className="bg-red-50 border-2 border-red-200 p-4 rounded-3xl">
        <div className="flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5" />
          <span>{message}</span>
        </div>
      </Card>
    </div>
  );
}

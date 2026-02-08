"use client";

import { useState } from "react";
import { ChevronDown, Lightbulb } from "lucide-react";

interface HintSectionProps {
  hints: string[];
}

export function HintSection({ hints }: HintSectionProps) {
  const [expandedHints, setExpandedHints] = useState<number[]>([]);

  const toggleHint = (level: number) => {
    setExpandedHints((prev) =>
      prev.includes(level)
        ? prev.filter((l) => l !== level)
        : [...prev, level]
    );
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-warning" />
        Need Help?
      </h3>
      {!hints.length ? (
        <p className="text-sm text-muted-foreground">No hints available for this question.</p>
      ) : (
        <div className="space-y-2">
        {hints.map((hint, idx) => (
          <div
            key={idx}
            className="border border-border rounded-lg overflow-hidden"
          >
            <button
              type="button"
              onClick={() => toggleHint(idx)}
              className="w-full flex items-center justify-between p-3 text-left bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              <span className="text-sm font-medium text-foreground">
                Hint {idx + 1}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground transition-transform ${
                  expandedHints.includes(idx) ? "rotate-180" : ""
                }`}
              />
            </button>
            {expandedHints.includes(idx) && (
              <div className="p-3 bg-muted/20 border-t border-border">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {hint}
                </p>
              </div>
            )}
          </div>
        ))}
        </div>
      )}
    </div>
  );
}

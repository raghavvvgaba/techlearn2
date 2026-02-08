"use client";

import { useState } from "react";
import { ChevronDown, Lightbulb } from "lucide-react";

const hints = [
  {
    level: 1,
    title: "Hint 1: Approach",
    content:
      "Think about using a data structure that allows O(1) lookup time to find if a complement exists.",
  },
  {
    level: 2,
    title: "Hint 2: Algorithm",
    content:
      "For each element, the complement would be (target - current element). Use a hash map to store seen values.",
  },
  {
    level: 3,
    title: "Hint 3: Implementation",
    content:
      "Iterate through the array once. For each element, check if (target - element) exists in your hash map. If yes, return the indices.",
  },
];

export function HintSection() {
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
      <div className="space-y-2">
        {hints.map((hint) => (
          <div
            key={hint.level}
            className="border border-border rounded-lg overflow-hidden"
          >
            <button
              type="button"
              onClick={() => toggleHint(hint.level)}
              className="w-full flex items-center justify-between p-3 text-left bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              <span className="text-sm font-medium text-foreground">
                {hint.title}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground transition-transform ${
                  expandedHints.includes(hint.level) ? "rotate-180" : ""
                }`}
              />
            </button>
            {expandedHints.includes(hint.level) && (
              <div className="p-3 bg-muted/20 border-t border-border">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {hint.content}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

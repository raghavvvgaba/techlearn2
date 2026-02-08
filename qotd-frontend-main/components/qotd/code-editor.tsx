'use client';

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Play, Send } from "lucide-react";

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  language: string;
  setLanguage: (language: string) => void;
  onRun: () => void;
  onSubmit: () => void;
}

const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "typescript", label: "TypeScript" },
];

export function CodeEditor({
  code,
  setCode,
  language,
  setLanguage,
  onRun,
  onSubmit,
}: CodeEditorProps) {
  const lineNumbers = code.split("\n").length;

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30">
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-[140px] h-8 text-sm bg-secondary border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRun}
            className="h-8 gap-2 text-sm bg-transparent"
          >
            <Play className="w-3.5 h-3.5" />
            Run Code
          </Button>
          <Button size="sm" onClick={onSubmit} className="h-8 gap-2 text-sm">
            <Send className="w-3.5 h-3.5" />
            Submit
          </Button>
        </div>
      </div>

      <div className="relative flex">
        <div className="flex-shrink-0 py-4 px-3 bg-muted/30 border-r border-border text-right select-none">
          {Array.from({ length: lineNumbers }, (_, i) => (
            <div
              key={i}
              className="text-xs text-muted-foreground font-mono leading-6"
            >
              {i + 1}
            </div>
          ))}
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="flex-1 min-h-[300px] p-4 bg-transparent font-mono text-sm text-foreground resize-none focus:outline-none leading-6"
          spellCheck={false}
          placeholder="// Write your solution here..."
        />
      </div>
    </div>
  );
}

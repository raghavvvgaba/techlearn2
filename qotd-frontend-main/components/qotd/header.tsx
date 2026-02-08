import { Flame, Code2 } from "lucide-react";

interface HeaderProps {
  streak: number;
}

export function Header({ streak }: HeaderProps) {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20">
              <Code2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground tracking-tight">
                TechLearn Solutions
              </h1>
              <p className="text-xs text-muted-foreground">Question of the Day</p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary border border-border">
            <Flame className="w-4 h-4 text-warning" />
            <span className="text-sm font-medium text-foreground">{streak} day streak</span>
          </div>
        </div>
      </div>
    </header>
  );
}

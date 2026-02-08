import { Terminal, CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface OutputSectionProps {
  output: {
    type: "idle" | "success" | "error" | "running";
    message: string;
  };
}

export function OutputSection({ output }: OutputSectionProps) {
  const getStatusIcon = () => {
    switch (output.type) {
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case "error":
        return <XCircle className="w-4 h-4 text-destructive" />;
      case "running":
        return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
      default:
        return <Terminal className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusText = () => {
    switch (output.type) {
      case "success":
        return "Success";
      case "error":
        return "Failed";
      case "running":
        return "Running...";
      default:
        return "Console";
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/30">
        {getStatusIcon()}
        <span className="text-sm font-medium text-foreground">
          {getStatusText()}
        </span>
      </div>

      <div className="p-4 min-h-[120px] bg-muted/20">
        {output.message ? (
          <pre
            className={`font-mono text-sm whitespace-pre-wrap ${
              output.type === "success"
                ? "text-success"
                : output.type === "error"
                  ? "text-destructive"
                  : "text-foreground"
            }`}
          >
            {output.message}
          </pre>
        ) : (
          <p className="text-sm text-muted-foreground">
            Click &quot;Run Code&quot; to test your solution or &quot;Submit&quot; to check all test
            cases.
          </p>
        )}
      </div>
    </div>
  );
}

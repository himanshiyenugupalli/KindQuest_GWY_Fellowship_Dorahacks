import { Check, Sparkle } from "lucide-react";

import { cn } from "@/lib/utils";

export function matchLabel(score: number) {
  if (score >= 90) return "Great match";
  if (score >= 80) return "Strong match";
  if (score >= 70) return "Good match";
  return "Possible match";
}

export function MatchBadge({ score, className }: { score: number; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-accent-foreground",
        className,
      )}
    >
      <Sparkle className="h-3.5 w-3.5" aria-hidden="true" />
      {score}% match · {matchLabel(score)}
    </span>
  );
}

export function MatchReasons({
  reasons,
  title = "Why this matches you",
}: {
  reasons: string[];
  title?: string;
}) {
  return (
    <div className="rounded-xl bg-muted/70 p-4">
      <p className="text-sm font-semibold">{title}</p>
      <ul className="mt-2 space-y-1.5">
        {reasons.map((r) => (
          <li key={r} className="flex items-start gap-2 text-sm text-muted-foreground">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <span>{r}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

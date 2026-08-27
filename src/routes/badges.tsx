import { createFileRoute } from "@tanstack/react-router";
import { Lock, Medal } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { badges } from "@/data/volunteer";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/badges")({
  head: () => ({
    meta: [
      { title: "Badges · KindQuest" },
      {
        name: "description",
        content: "Milestones you have earned and the ones still ahead of you.",
      },
      { property: "og:title", content: "Badges · KindQuest" },
      {
        property: "og:description",
        content: "Honest recognition for showing up and finishing what you start.",
      },
    ],
  }),
  component: BadgesPage,
});

const tones: Record<string, string> = {
  primary: "bg-primary-soft",
  coral: "bg-coral/25",
  sky: "bg-sky/30",
  lilac: "bg-lilac/30",
  sunbeam: "bg-sunbeam/40",
};

function BadgesPage() {
  const earned = badges.filter((b) => b.earned);
  const locked = badges.filter((b) => !b.earned);

  return (
    <AppShell title="Badges" subtitle={`${earned.length} of ${badges.length} earned`}>
      <section>
        <h2 className="text-lg font-semibold">Earned</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {earned.map((b) => (
            <article key={b.id} className="card-surface rounded-2xl p-5">
              <span
                className={cn(
                  "grid h-12 w-12 place-items-center rounded-2xl",
                  tones[b.tone] ?? "bg-accent",
                )}
              >
                <Medal className="h-6 w-6 text-foreground" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-semibold">{b.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{b.description}</p>
              {b.earnedOn ? (
                <Badge variant="secondary" className="mt-3">
                  Earned {b.earnedOn}
                </Badge>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Still ahead</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {locked.map((b) => (
            <article key={b.id} className="card-surface rounded-2xl p-5 opacity-70">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-muted">
                <Lock className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-semibold">{b.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{b.description}</p>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}

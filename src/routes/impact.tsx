import { createFileRoute } from "@tanstack/react-router";
import { Award, TrendingUp } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { demoVolunteer, impactHistory, nextRankFor, rankFor } from "@/data/volunteer";

export const Route = createFileRoute("/impact")({
  head: () => ({
    meta: [
      { title: "Impact history · KindQuest" },
      {
        name: "description",
        content: "Every Impact Point you earned, where it came from and why.",
      },
      { property: "og:title", content: "Impact history · KindQuest" },
      {
        property: "og:description",
        content: "A transparent ledger of your volunteering contribution.",
      },
    ],
  }),
  component: ImpactPage,
});

function ImpactPage() {
  const rank = rankFor(demoVolunteer.impactPoints);
  const next = nextRankFor(demoVolunteer.impactPoints);
  const progress = next
    ? ((demoVolunteer.impactPoints - rank.minPoints) / (next.minPoints - rank.minPoints)) * 100
    : 100;
  const byCause = impactHistory.reduce<Record<string, number>>((acc, t) => {
    acc[t.cause] = (acc[t.cause] ?? 0) + t.points;
    return acc;
  }, {});
  const maxCause = Math.max(...Object.values(byCause), 1);

  return (
    <AppShell title="Impact" subtitle="Where your points came from.">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card-surface rounded-2xl p-5">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <TrendingUp className="h-4 w-4 text-primary" aria-hidden="true" />
            Total Impact Points
          </p>
          <p className="mt-3 text-4xl font-bold">{demoVolunteer.impactPoints.toLocaleString()}</p>
          <Progress value={progress} className="mt-4" aria-label="Progress to next rank" />
          <p className="mt-2 text-sm text-muted-foreground">
            {rank.name}
            {next ? ` · next: ${next.name}` : ""}
          </p>
        </div>
        <div className="card-surface rounded-2xl p-5">
          <p className="text-sm font-semibold">Contributions</p>
          <p className="mt-3 text-4xl font-bold">{demoVolunteer.contributions}</p>
          <p className="mt-2 text-sm text-muted-foreground">Completed and verified opportunities</p>
        </div>
        <div className="card-surface rounded-2xl p-5">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Award className="h-4 w-4 text-primary" aria-hidden="true" />
            Reliability
          </p>
          <p className="mt-3 text-4xl font-bold">{demoVolunteer.reliability.score}</p>
          <p className="mt-2 text-sm text-muted-foreground">From organization feedback only</p>
        </div>
      </div>

      <section className="card-surface mt-6 rounded-2xl p-6">
        <h2 className="text-lg font-semibold">Points by cause</h2>
        <ul className="mt-4 space-y-4">
          {Object.entries(byCause).map(([cause, points]) => (
            <li key={cause}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{cause}</span>
                <span className="text-muted-foreground">{points} pts</span>
              </div>
              <Progress
                value={(points / maxCause) * 100}
                className="mt-2"
                aria-label={`${cause} points`}
              />
            </li>
          ))}
        </ul>
      </section>

      <section className="card-surface mt-6 rounded-2xl p-6">
        <h2 className="text-lg font-semibold">Impact ledger</h2>
        <ul className="mt-4 divide-y divide-border">
          {impactHistory.map((t) => (
            <li
              key={t.id}
              className="grid gap-3 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{t.opportunityTitle}</p>
                <p className="text-sm text-muted-foreground">
                  {t.organizationName} · {t.date}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="secondary">{t.cause}</Badge>
                  <Badge variant="outline">{t.status}</Badge>
                  {t.ratingScore ? <Badge variant="outline">Rated {t.ratingScore}/5</Badge> : null}
                </div>
              </div>
              <span className="shrink-0 text-base font-bold text-primary">+{t.points}</span>
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}

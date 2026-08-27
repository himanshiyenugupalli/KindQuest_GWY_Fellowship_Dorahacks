import { createFileRoute } from "@tanstack/react-router";
import { Award, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/shared/StateBlocks";
import { nextRankFor, rankFor } from "@/data/volunteer";
import { useAuth } from "@/lib/auth";
import { volunteerService } from "@/services";

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
  const { volunteerProfile } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const impactPoints = volunteerProfile?.impact_points ?? 0;
  const contributions = volunteerProfile?.contributions ?? 0;
  const reliabilityScore = volunteerProfile?.reliability?.score ?? 100;

  const rank = rankFor(impactPoints);
  const next = nextRankFor(impactPoints);
  const progress = next
    ? ((impactPoints - rank.minPoints) / (next.minPoints - rank.minPoints)) * 100
    : 100;

  useEffect(() => {
    let isMounted = true;
    async function loadHistory() {
      try {
        const data = await volunteerService.impactHistory();
        if (isMounted) setHistory(data);
      } catch (err) {
        console.error("Error loading impact history:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadHistory();
    return () => {
      isMounted = false;
    };
  }, []);

  const byCause = history.reduce<Record<string, number>>((acc, t) => {
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
          <p className="mt-3 text-4xl font-bold">{impactPoints.toLocaleString()}</p>
          <Progress value={progress} className="mt-4" aria-label="Progress to next rank" />
          <p className="mt-2 text-sm text-muted-foreground">
            {rank.name}
            {next ? ` · next: ${next.name}` : ""}
          </p>
        </div>
        <div className="card-surface rounded-2xl p-5">
          <p className="text-sm font-semibold">Contributions</p>
          <p className="mt-3 text-4xl font-bold">{contributions}</p>
          <p className="mt-2 text-sm text-muted-foreground">Completed and verified opportunities</p>
        </div>
        <div className="card-surface rounded-2xl p-5">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Award className="h-4 w-4 text-primary" aria-hidden="true" />
            Reliability
          </p>
          <p className="mt-3 text-4xl font-bold">{reliabilityScore}</p>
          <p className="mt-2 text-sm text-muted-foreground">From organization feedback only</p>
        </div>
      </div>

      <section className="card-surface mt-6 rounded-2xl p-6">
        <h2 className="text-lg font-semibold">Points by cause</h2>
        {Object.keys(byCause).length > 0 ? (
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
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">No cause breakdown available yet.</p>
        )}
      </section>

      <section className="card-surface mt-6 rounded-2xl p-6">
        <h2 className="text-lg font-semibold">Impact ledger</h2>
        {loading ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Loading impact history...
          </div>
        ) : history.length > 0 ? (
          <ul className="mt-4 divide-y divide-border">
            {history.map((t) => (
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
                  </div>
                </div>
                <span className="shrink-0 text-base font-bold text-primary">+{t.points}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No verified impact actions recorded yet.
          </div>
        )}
      </section>
    </AppShell>
  );
}

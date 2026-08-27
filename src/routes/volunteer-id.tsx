import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, Download, IdCard, Medal, ShieldCheck, Star } from "lucide-react";
import { toast } from "sonner";

import { KindQuestLogo } from "@/components/KindQuestLogo";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  badges,
  demoVolunteer,
  impactHistory,
  nextRankFor,
  ranks,
  rankFor,
  ratings,
} from "@/data/volunteer";

export const Route = createFileRoute("/volunteer-id")({
  head: () => ({
    meta: [
      { title: "Volunteer ID · KindQuest" },
      {
        name: "description",
        content:
          "Your persistent volunteering identity: Impact Points, rank, badges and reliability.",
      },
      { property: "og:title", content: "Volunteer ID · KindQuest" },
      {
        property: "og:description",
        content: "One identity that carries your contribution across every organization.",
      },
    ],
  }),
  component: VolunteerIdPage,
});

function VolunteerIdPage() {
  const rank = rankFor(demoVolunteer.impactPoints);
  const next = nextRankFor(demoVolunteer.impactPoints);
  const progress = next
    ? ((demoVolunteer.impactPoints - rank.minPoints) / (next.minPoints - rank.minPoints)) * 100
    : 100;
  const earned = badges.filter((b) => b.earned);

  return (
    <AppShell title="Volunteer ID" subtitle="Your contribution, kept in one place.">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-6">
          <section className="rounded-3xl border border-border bg-gradient-to-br from-primary-soft to-sky/25 p-6 shadow-[var(--shadow-lift)]">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-accent-foreground">
                  <IdCard className="h-4 w-4" aria-hidden="true" />
                  KindQuest Volunteer ID
                </p>
                <h2 className="mt-2 truncate text-2xl font-bold">{demoVolunteer.name}</h2>
                <p className="text-sm text-muted-foreground">{demoVolunteer.volunteerId}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {demoVolunteer.location} · joined {demoVolunteer.joinedOn}
                </p>
              </div>
              <KindQuestLogo size="md" framed />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat label="Impact Points" value={demoVolunteer.impactPoints.toLocaleString()} />
              <Stat label="Rank" value={rank.name} />
              <Stat label="Contributions" value={String(demoVolunteer.contributions)} />
              <Stat label="Reliability" value={`${demoVolunteer.reliability.score}/100`} />
            </div>

            <div className="mt-6">
              <Progress value={progress} aria-label="Progress to next rank" />
              <p className="mt-2 text-sm text-muted-foreground">
                {next
                  ? `${next.minPoints - demoVolunteer.impactPoints} points to ${next.name}`
                  : "Highest rank reached"}
              </p>
            </div>

            <Button
              variant="outline"
              className="mt-6 bg-card"
              onClick={() => toast.success("Volunteer ID card downloaded")}
            >
              <Download className="mr-2 h-4 w-4" aria-hidden="true" />
              Download ID card
            </Button>
            <Button asChild className="mt-3 sm:ml-3">
              <Link to="/onboarding/game" search={{ mode: "deeper" }}>
                <Compass className="mr-2 h-4 w-4" aria-hidden="true" />
                Explore more ways to help
              </Link>
            </Button>
          </section>

          <section className="card-surface rounded-2xl p-6">
            <h2 className="text-lg font-semibold">About</h2>
            <p className="mt-2 text-sm text-muted-foreground">{demoVolunteer.bio}</p>
            <Separator className="my-5" />
            <div className="grid gap-5 sm:grid-cols-3">
              <Group title="Causes" items={demoVolunteer.causes} />
              <Group title="Skills" items={demoVolunteer.skills} />
              <Group title="Availability" items={demoVolunteer.availability} />
            </div>
          </section>

          <section className="card-surface rounded-2xl p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
              Reliability
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Built only from organization feedback on completed opportunities.
            </p>
            <div className="mt-5 space-y-4">
              <Meter label="Effort" value={demoVolunteer.reliability.effort} />
              <Meter label="Reliability" value={demoVolunteer.reliability.reliability} />
              <Meter label="Conduct" value={demoVolunteer.reliability.conduct} />
            </div>
          </section>

          <section className="card-surface rounded-2xl p-6">
            <h2 className="text-lg font-semibold">Recent impact</h2>
            <ul className="mt-4 divide-y divide-border">
              {impactHistory.slice(0, 5).map((t) => (
                <li key={t.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{t.opportunityTitle}</p>
                    <p className="text-sm text-muted-foreground">
                      {t.organizationName} · {t.date}
                    </p>
                  </div>
                  <span className="shrink-0 self-center text-sm font-bold text-primary">
                    +{t.points}
                  </span>
                </li>
              ))}
            </ul>
            <Button asChild variant="ghost" size="sm" className="mt-3">
              <Link to="/impact">See full impact history</Link>
            </Button>
          </section>
        </div>

        <aside className="space-y-4">
          <div className="card-surface rounded-2xl p-5">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Medal className="h-4 w-4 text-primary" aria-hidden="true" />
              Badges earned
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {earned.map((b) => (
                <Badge key={b.id} variant="secondary">
                  {b.title}
                </Badge>
              ))}
            </div>
            <Button asChild variant="outline" size="sm" className="mt-4 w-full">
              <Link to="/badges">All badges</Link>
            </Button>
          </div>

          <div className="card-surface rounded-2xl p-5">
            <p className="text-sm font-semibold">Rank ladder</p>
            <ul className="mt-3 space-y-2">
              {ranks.map((r) => (
                <li
                  key={r.id}
                  className={
                    r.id === rank.id
                      ? "rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-accent-foreground"
                      : "px-3 py-2 text-sm text-muted-foreground"
                  }
                >
                  {r.name}
                  <span className="ml-2 text-xs">{r.minPoints}+</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card-surface rounded-2xl p-5">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Star className="h-4 w-4 text-primary" aria-hidden="true" />
              Latest feedback
            </p>
            {ratings.slice(0, 2).map((r) => (
              <div key={r.id} className="mt-3 rounded-xl bg-muted/60 p-3">
                <p className="text-sm font-semibold">{r.organizationName}</p>
                <p className="mt-1 text-sm text-muted-foreground">{r.feedback}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-card/80 p-3">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-bold">{value}</p>
    </div>
  );
}

function Group({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {items.map((i) => (
          <Badge key={i} variant="secondary">
            {i}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">{value.toFixed(1)} / 5</span>
      </div>
      <Progress value={(value / 5) * 100} className="mt-2" aria-label={`${label} rating`} />
    </div>
  );
}

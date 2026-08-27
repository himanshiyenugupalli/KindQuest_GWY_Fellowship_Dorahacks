import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Compass, Gamepad2, MapPin, Sparkles, TrendingUp, Wifi } from "lucide-react";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/lib/auth";
import { MatchReasons } from "@/components/shared/MatchBadge";
import {
  OpportunityGrid,
  OpportunityRail,
  SectionHeader,
} from "@/components/shared/OpportunityCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { activeOpportunities } from "@/data/opportunities";
import { nextRankFor, rankFor } from "@/data/volunteer";
import { opportunityService } from "@/services";
import type { Opportunity } from "@/types";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Discover · KindQuest" },
      {
        name: "description",
        content:
          "Personalised volunteering recommendations, nearby tasks and remote work picked for you.",
      },
      { property: "og:title", content: "Discover · KindQuest" },
      {
        property: "og:description",
        content: "Your KindQuest home: recommendations, progress and what to do next.",
      },
    ],
  }),
  component: DiscoverPage,
});

function DiscoverPage() {
  const { profile, volunteerProfile } = useAuth();
  const [oppList, setOppList] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  const name = profile?.full_name || "Volunteer";
  const firstName = name.split(" ")[0];
  const location = profile?.location || "Your Area";
  const impactPoints = volunteerProfile?.impact_points ?? 0;
  const causes = volunteerProfile?.causes || [];

  useEffect(() => {
    let isMounted = true;
    async function loadOpps() {
      try {
        const data = await opportunityService.list();
        if (isMounted && data && data.length > 0) {
          setOppList(data as Opportunity[]);
        } else if (isMounted) {
          setOppList(activeOpportunities);
        }
      } catch (err) {
        console.error("Failed to load opportunities from Supabase, using active fallback:", err);
        if (isMounted) setOppList(activeOpportunities);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadOpps();
    return () => {
      isMounted = false;
    };
  }, []);

  const displayList = oppList.length > 0 ? oppList : activeOpportunities;
  const recommended = [...displayList]
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
    .slice(0, 6);
  const nearby = displayList.filter((o) => !o.remote).slice(0, 6);
  const remote = displayList.filter((o) => o.remote).slice(0, 6);
  const rank = rankFor(impactPoints);
  const next = nextRankFor(impactPoints);
  const progress = next
    ? ((impactPoints - rank.minPoints) / (next.minPoints - rank.minPoints)) * 100
    : 100;
  const top = recommended[0];

  return (
    <AppShell title={`Welcome back, ${firstName}`} subtitle="Here's what fits you right now.">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-10">
          {top ? (
            <section className="rounded-3xl border border-border bg-gradient-to-br from-primary-soft to-sky/25 p-6 shadow-[var(--shadow-lift)]">
              <Badge className="bg-card text-foreground hover:bg-card">
                <Sparkles className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                Top match today
              </Badge>
              <h2 className="mt-3 text-xl font-bold sm:text-2xl">{top.title}</h2>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{top.summary}</p>
              {top.matchReasons && top.matchReasons.length > 0 ? (
                <div className="mt-4 max-w-md">
                  <MatchReasons reasons={top.matchReasons} />
                </div>
              ) : null}
              <Button asChild className="mt-5">
                <Link to="/opportunities/$id" params={{ id: top.id }}>
                  View opportunity
                  <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </section>
          ) : null}

          <section>
            <SectionHeader
              title="Recommended for you"
              description="Ranked by how well they fit your interests, skills and availability."
              action={
                <Button asChild variant="ghost" size="sm">
                  <Link to="/browse">See all</Link>
                </Button>
              }
            />
            <OpportunityGrid items={recommended} />
          </section>

          <section>
            <SectionHeader
              title="Near you"
              description={`In-person opportunities around ${location}.`}
            />
            <OpportunityRail items={nearby} />
          </section>

          <section>
            <SectionHeader title="Remote opportunities" description="Help from wherever you are." />
            <OpportunityRail items={remote} />
          </section>
        </div>

        <aside className="space-y-4">
          <div className="card-surface rounded-2xl p-5">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <TrendingUp className="h-4 w-4 text-primary" aria-hidden="true" />
              Your progress
            </p>
            <p className="mt-4 text-3xl font-bold">{impactPoints.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Impact Points</p>
            <Progress value={progress} className="mt-4" aria-label="Progress to next rank" />
            <p className="mt-2 text-sm text-muted-foreground">
              {rank.name}
              {next ? ` · ${next.minPoints - impactPoints} pts to ${next.name}` : " · top rank"}
            </p>
            <Button asChild variant="outline" size="sm" className="mt-4 w-full">
              <Link to="/volunteer-id">View Volunteer ID</Link>
            </Button>
          </div>

          <div className="card-surface rounded-2xl p-5">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Compass className="h-4 w-4 text-primary" aria-hidden="true" />
              Quick actions
            </p>
            <div className="mt-4 space-y-2">
              <Button asChild variant="outline" size="sm" className="w-full justify-start">
                <Link to="/browse">
                  <MapPin className="mr-2 h-4 w-4" aria-hidden="true" />
                  Browse in person
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="w-full justify-start">
                <Link to="/browse">
                  <Wifi className="mr-2 h-4 w-4" aria-hidden="true" />
                  Browse remote
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="w-full justify-start">
                <Link to="/my-opportunities">
                  <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
                  My opportunities
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="w-full justify-start">
                <Link to="/onboarding/game" search={{ mode: "deeper" }}>
                  <Gamepad2 className="mr-2 h-4 w-4" aria-hidden="true" />
                  Explore more ways to help
                </Link>
              </Button>
            </div>
          </div>

          <div className="card-surface rounded-2xl p-5">
            <p className="text-sm font-semibold">Your causes</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {causes.map((c) => (
                <Badge key={c} variant="secondary">
                  {c}
                </Badge>
              ))}
            </div>
            <Button asChild variant="ghost" size="sm" className="mt-3">
              <Link to="/settings">Update preferences</Link>
            </Button>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

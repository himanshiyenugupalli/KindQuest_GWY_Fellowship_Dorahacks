import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark, CalendarCheck, ListChecks } from "lucide-react";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { OpportunityGrid } from "@/components/shared/OpportunityCard";
import { EmptyState } from "@/components/shared/StateBlocks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { opportunityById } from "@/data/opportunities";
import { organizationName } from "@/data/organizations";
import { opportunityService, volunteerService } from "@/services";
import type { Application, Opportunity } from "@/types";

export const Route = createFileRoute("/my-opportunities")({
  head: () => ({
    meta: [
      { title: "My opportunities · KindQuest" },
      {
        name: "description",
        content: "Track requested, upcoming, in-progress and completed volunteering in one place.",
      },
      { property: "og:title", content: "My opportunities · KindQuest" },
      {
        property: "og:description",
        content: "Every opportunity you've requested, joined or completed on KindQuest.",
      },
    ],
  }),
  component: MyOpportunities,
});

const groups: { key: string; label: string; statuses: Application["status"][] }[] = [
  { key: "requested", label: "Requested", statuses: ["Requested"] },
  { key: "upcoming", label: "Upcoming", statuses: ["Accepted", "Upcoming"] },
  { key: "active", label: "In progress", statuses: ["In Progress"] },
  { key: "completed", label: "Completed", statuses: ["Completed", "Awaiting Rating", "Verified"] },
];

function MyOpportunities() {
  const [userApps, setUserApps] = useState<Application[]>([]);
  const [savedOpps, setSavedOpps] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [apps, saved] = await Promise.all([
          volunteerService.applications(),
          opportunityService.saved(),
        ]);
        if (isMounted) {
          setUserApps(apps as Application[]);
          setSavedOpps(saved as Opportunity[]);
        }
      } catch (err) {
        console.error("Error loading user opportunities:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AppShell title="My opportunities" subtitle="Everything you've requested, joined or finished.">
      <Tabs defaultValue="requested">
        <TabsList className="flex w-full flex-wrap justify-start">
          {groups.map((g) => (
            <TabsTrigger key={g.key} value={g.key}>
              {g.label}
            </TabsTrigger>
          ))}
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>

        {groups.map((g) => {
          const rows = userApps.filter((a) => g.statuses.includes(a.status));
          return (
            <TabsContent key={g.key} value={g.key} className="mt-6">
              {loading ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  Loading your opportunities...
                </div>
              ) : rows.length ? (
                <ul className="space-y-3">
                  {rows.map((a) => (
                    <ApplicationRow key={a.id} application={a} />
                  ))}
                </ul>
              ) : (
                <EmptyState
                  icon={g.key === "completed" ? CalendarCheck : ListChecks}
                  title={`Nothing ${g.label.toLowerCase()} yet`}
                  description="When you request or complete an opportunity, it shows up here."
                  action={
                    <Button asChild>
                      <Link to="/browse">Browse opportunities</Link>
                    </Button>
                  }
                />
              )}
            </TabsContent>
          );
        })}

        <TabsContent value="saved" className="mt-6">
          {loading ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Loading saved opportunities...
            </div>
          ) : savedOpps.length ? (
            <OpportunityGrid items={savedOpps} />
          ) : (
            <EmptyState
              icon={Bookmark}
              title="No saved opportunities"
              description="Tap the bookmark on any opportunity to keep it for later."
              action={
                <Button asChild>
                  <Link to="/browse">Browse opportunities</Link>
                </Button>
              }
            />
          )}
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}

function ApplicationRow({ application }: { application: Application }) {
  const opportunity = opportunityById(application.opportunityId);
  if (!opportunity) return null;

  return (
    <li className="card-surface grid gap-4 rounded-2xl p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{application.status}</Badge>
          <Badge variant="outline">{opportunity.cause}</Badge>
        </div>
        <h3 className="mt-2 truncate text-base font-semibold">{opportunity.title}</h3>
        <p className="text-sm text-muted-foreground">
          {organizationName(opportunity.organizationId)} · applied {application.appliedOn}
          {application.pointsAwarded ? ` · +${application.pointsAwarded} pts` : ""}
        </p>
      </div>
      <Button asChild variant="outline" size="sm" className="shrink-0">
        <Link to="/opportunities/$id" params={{ id: opportunity.id }}>
          View details
        </Link>
      </Button>
    </li>
  );
}

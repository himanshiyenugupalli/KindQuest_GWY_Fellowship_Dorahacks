import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Plus, Star, Users } from "lucide-react";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/lib/auth";
import { opportunityService } from "@/services";
import type { Opportunity } from "@/types";

export const Route = createFileRoute("/organization/")({
  head: () => ({
    meta: [
      { title: "Organization dashboard · KindQuest" },
      {
        name: "description",
        content:
          "Manage opportunities, volunteers, verification, ratings and certificates in one workspace.",
      },
      { property: "og:title", content: "Organization dashboard · KindQuest" },
      {
        property: "og:description",
        content: "The KindQuest workspace for the whole volunteering lifecycle.",
      },
    ],
  }),
  component: OrgDashboard,
});

function OrgDashboard() {
  const { profile, orgProfile } = useAuth();
  const [opps, setOpps] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  const orgName = orgProfile?.name || profile?.full_name || "Organization Workspace";
  const rating = orgProfile?.rating ?? 5.0;

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const list = await opportunityService.list();
        if (isMounted) {
          const mine = (list as Opportunity[]).filter(
            (o) => o.organizationId === orgProfile?.org_id || o.organizationName === orgName,
          );
          setOpps(mine);
        }
      } catch (err) {
        console.error("Failed loading organization opportunities:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [orgProfile, orgName]);

  const active = opps.filter((o) => o.status === "active");
  const filled = opps.reduce((sum, o) => sum + (o.filled || 0), 0);
  const capacity = opps.reduce((sum, o) => sum + (o.capacity || 0), 0) || 1;

  return (
    <AppShell role="organization" title={orgName} subtitle="Your volunteering workspace.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Active opportunities" value={String(active.length)} />
        <Kpi label="Volunteers engaged" value={String(filled)} />
        <Kpi label="Total opportunities" value={String(opps.length)} />
        <Kpi label="Organization rating" value={`${rating.toFixed(1)} / 5`} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-6">
          <section className="card-surface rounded-2xl p-6">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
              <h2 className="truncate text-lg font-semibold">Your opportunities</h2>
              <Button asChild size="sm" className="shrink-0">
                <Link to="/organization/opportunities">
                  <Plus className="mr-1 h-4 w-4" aria-hidden="true" />
                  Manage
                </Link>
              </Button>
            </div>
            {loading ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                Loading opportunities...
              </div>
            ) : opps.length ? (
              <ul className="mt-4 divide-y divide-border">
                {opps.slice(0, 5).map((o) => (
                  <li
                    key={o.id}
                    className="grid gap-3 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{o.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {o.date || "Active"} · {o.filled}/{o.capacity} volunteers
                      </p>
                    </div>
                    <Badge variant="secondary" className="shrink-0 justify-self-start">
                      {o.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">No opportunities posted yet.</p>
            )}
          </section>

          <section className="card-surface rounded-2xl p-6">
            <h2 className="text-lg font-semibold">Capacity filled</h2>
            <Progress
              value={(filled / capacity) * 100}
              className="mt-4"
              aria-label="Capacity filled"
            />
            <p className="mt-2 text-sm text-muted-foreground">
              {filled} of {capacity} volunteer spots filled across all opportunities.
            </p>
          </section>
        </div>

        <aside className="space-y-4">
          <div className="card-surface rounded-2xl p-5">
            <p className="text-sm font-semibold">Next steps</p>
            <div className="mt-4 space-y-2">
              <Button asChild variant="outline" size="sm" className="w-full justify-start">
                <Link to="/organization/volunteers">
                  <Users className="mr-2 h-4 w-4" aria-hidden="true" />
                  Review requests
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="w-full justify-start">
                <Link to="/organization/ratings">
                  <Star className="mr-2 h-4 w-4" aria-hidden="true" />
                  Rate completed work
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="w-full justify-start">
                <Link to="/organization/certificates">
                  <CheckCircle2 className="mr-2 h-4 w-4" aria-hidden="true" />
                  Issue certificates
                </Link>
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-surface rounded-2xl p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}

import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  BadgeCheck,
  CalendarDays,
  Clock,
  MapPin,
  SearchX,
  Share2,
  Users,
  Wifi,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/AppShell";
import { MatchBadge, MatchReasons } from "@/components/shared/MatchBadge";
import { EmptyState } from "@/components/shared/StateBlocks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { opportunityById } from "@/data/opportunities";
import { organizationById } from "@/data/organizations";

export const Route = createFileRoute("/opportunities/$id")({
  loader: ({ params }) => {
    const opportunity = opportunityById(params.id);
    if (!opportunity) throw notFound();
    return { opportunity, organization: organizationById(opportunity.organizationId) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Opportunity not found · KindQuest" }, { name: "robots", content: "noindex" }],
      };
    }
    const { opportunity } = loaderData;
    return {
      meta: [
        { title: `${opportunity.title} · KindQuest` },
        { name: "description", content: opportunity.summary },
        { property: "og:title", content: `${opportunity.title} · KindQuest` },
        { property: "og:description", content: opportunity.summary },
      ],
    };
  },
  notFoundComponent: OpportunityNotFound,
  component: OpportunityDetail,
});

function OpportunityNotFound() {
  return (
    <AppShell title="Opportunity">
      <EmptyState
        icon={SearchX}
        title="This opportunity isn't available"
        description="It may have closed or been filled. Browse what's open right now."
        action={
          <Button asChild>
            <Link to="/browse">Browse opportunities</Link>
          </Button>
        }
      />
    </AppShell>
  );
}

function OpportunityDetail() {
  const { opportunity, organization } = Route.useLoaderData();
  const [applied, setApplied] = useState(false);

  const spots = Math.max(opportunity.capacity - opportunity.filled, 0);

  return (
    <AppShell title={opportunity.title} subtitle={organization?.name}>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-6">
          <div className="card-surface rounded-2xl p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{opportunity.cause}</Badge>
              {opportunity.remote ? (
                <Badge variant="outline">
                  <Wifi className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                  Remote
                </Badge>
              ) : (
                <Badge variant="outline">
                  <MapPin className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                  In person
                </Badge>
              )}
              <MatchBadge score={opportunity.matchScore} />
            </div>

            <h1 className="mt-4 text-2xl font-bold sm:text-3xl">{opportunity.title}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              {organization?.name}
              {organization?.verified ? (
                <BadgeCheck className="h-4 w-4 text-primary" aria-label="Verified organization" />
              ) : null}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{opportunity.summary}</p>

            <Separator className="my-6" />

            <dl className="grid gap-4 sm:grid-cols-2">
              <Detail icon={CalendarDays} label="Date" value={opportunity.date} />
              <Detail icon={Clock} label="Time commitment" value={opportunity.commitment} />
              <Detail icon={MapPin} label="Location" value={opportunity.location} />
              <Detail icon={Users} label="Volunteers" value={`${opportunity.filled} of ${opportunity.capacity} filled`} />
            </dl>
          </div>

          <div className="card-surface rounded-2xl p-6">
            <h2 className="text-lg font-semibold">What you'll do</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {opportunity.responsibilities.map((r) => (
                <li key={r} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                  {r}
                </li>
              ))}
            </ul>

            <h2 className="mt-6 text-lg font-semibold">Schedule</h2>
            <p className="mt-2 text-sm text-muted-foreground">{opportunity.schedule}</p>

            <h2 className="mt-6 text-lg font-semibold">Who this helps</h2>
            <p className="mt-2 text-sm text-muted-foreground">{opportunity.beneficiaries}</p>

            <h2 className="mt-6 text-lg font-semibold">Skills useful here</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {opportunity.skills.map((s) => (
                <Badge key={s} variant="secondary">
                  {s}
                </Badge>
              ))}
            </div>
          </div>

          {organization ? (
            <div className="card-surface rounded-2xl p-6">
              <h2 className="text-lg font-semibold">About {organization.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{organization.description}</p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span>{organization.type}</span>
                <span>{organization.location}</span>
                <span>Rating {organization.rating.toFixed(1)} / 5</span>
              </div>
            </div>
          ) : null}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="card-surface rounded-2xl p-5">
            <p className="text-3xl font-bold">+{opportunity.impactPoints}</p>
            <p className="text-sm text-muted-foreground">Impact Points on completion</p>

            <Progress
              value={(opportunity.filled / opportunity.capacity) * 100}
              className="mt-4"
              aria-label="Spots filled"
            />
            <p className="mt-2 text-sm text-muted-foreground">
              {spots} spot{spots === 1 ? "" : "s"} left
            </p>

            <Button
              className="mt-5 w-full"
              size="lg"
              disabled={applied}
              onClick={() => {
                setApplied(true);
                toast.success("Request sent to the organization");
              }}
            >
              {applied ? "Request sent" : "Request to volunteer"}
            </Button>
            <Button
              variant="outline"
              className="mt-2 w-full"
              onClick={() => toast.success("Link copied to clipboard")}
            >
              <Share2 className="mr-2 h-4 w-4" aria-hidden="true" />
              Share
            </Button>
          </div>

          <MatchReasons reasons={opportunity.matchReasons} />
        </aside>
      </div>
    </AppShell>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent">
        <Icon className="h-4 w-4 text-accent-foreground" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
        <dd className="text-sm font-semibold">{value}</dd>
      </div>
    </div>
  );
}

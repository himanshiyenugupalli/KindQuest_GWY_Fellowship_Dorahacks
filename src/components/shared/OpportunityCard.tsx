import { Link } from "@tanstack/react-router";
import { BadgeCheck, Bookmark, CalendarDays, Clock, MapPin, Sparkles, Wifi } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { MatchBadge } from "@/components/shared/MatchBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { organizationById } from "@/data/organizations";
import { cn } from "@/lib/utils";
import type { Opportunity } from "@/types";

export function OpportunityCard({
  opportunity,
  layout = "grid",
  initiallySaved = false,
  showMatchBadge = true,
}: {
  opportunity: Opportunity;
  layout?: "grid" | "list";
  initiallySaved?: boolean;
  showMatchBadge?: boolean;
}) {
  const [saved, setSaved] = useState(initiallySaved);
  const org = organizationById(opportunity.organizationId);

  const toggleSave = () => {
    setSaved((s) => {
      toast.success(s ? "Removed from saved" : "Opportunity saved");
      return !s;
    });
  };

  return (
    <article
      className={cn(
        "card-surface group flex flex-col rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]",
        layout === "list" && "sm:flex-row sm:items-start sm:gap-6",
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold sm:text-lg">{opportunity.title}</h3>
            <p className="mt-1 flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
              <span className="truncate">{org?.name}</span>
              {org?.verified ? (
                <BadgeCheck className="h-4 w-4 shrink-0 text-primary" aria-label="Verified organization" />
              ) : null}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-sunbeam/40 px-2.5 py-1 text-xs font-semibold text-sunbeam-foreground dark:text-foreground">
            +{opportunity.impactPoints} pts
          </span>
        </div>

        {showMatchBadge ? <MatchBadge score={opportunity.matchScore} className="mt-3" /> : null}

        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{opportunity.summary}</p>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            {opportunity.remote ? (
              <Wifi className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {opportunity.remote ? "Remote" : opportunity.location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            {opportunity.date}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {opportunity.duration}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <Badge variant="secondary" className="bg-accent text-accent-foreground">
            {opportunity.cause}
          </Badge>
          {opportunity.skills.slice(0, 3).map((s) => (
            <Badge key={s} variant="outline" className="font-normal">
              {s}
            </Badge>
          ))}
        </div>
      </div>

      <div
        className={cn(
          "mt-5 flex gap-2",
          layout === "list" && "sm:mt-0 sm:w-44 sm:flex-col sm:shrink-0",
        )}
      >
        <Button asChild className="flex-1">
          <Link to="/opportunities/$id" params={{ id: opportunity.id }}>
            View opportunity
          </Link>
        </Button>
        <Button
          variant="outline"
          onClick={toggleSave}
          aria-pressed={saved}
          aria-label={saved ? "Remove from saved" : "Save opportunity"}
          className={cn(layout === "list" && "sm:w-full")}
        >
          <Bookmark className={cn("h-4 w-4", saved && "fill-current text-primary")} aria-hidden="true" />
          <span className={cn(layout === "grid" && "sr-only sm:not-sr-only sm:hidden", "ml-1 hidden sm:inline")}>
            {saved ? "Saved" : "Save"}
          </span>
        </Button>
      </div>
    </article>
  );
}

export function OpportunityGrid({ items }: { items: Opportunity[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((o) => (
        <OpportunityCard key={o.id} opportunity={o} />
      ))}
    </div>
  );
}

export function OpportunityList({ items }: { items: Opportunity[] }) {
  return (
    <div className="space-y-4">
      {items.map((o) => (
        <OpportunityCard key={o.id} opportunity={o} layout="list" />
      ))}
    </div>
  );
}

export function OpportunityRail({ items }: { items: Opportunity[] }) {
  return (
    <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0">
      {items.map((o) => (
        <div key={o.id} className="w-[min(88vw,20rem)] shrink-0 snap-start lg:w-auto">
          <OpportunityCard opportunity={o} />
        </div>
      ))}
    </div>
  );
}

export function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
      <div className="min-w-0">
        <h2 className="truncate text-lg font-semibold sm:text-xl">{title}</h2>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export { Sparkles as SparklesIcon };

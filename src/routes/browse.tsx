import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LayoutGrid, List, SearchX, SlidersHorizontal, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { OpportunityGrid, OpportunityList } from "@/components/shared/OpportunityCard";
import { EmptyState } from "@/components/shared/StateBlocks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { activeOpportunities, allCauses, allLocations } from "@/data/opportunities";
import { loadAdventureSessionAsync, type AdventureSession } from "@/lib/adventure-progress";

export const Route = createFileRoute("/browse")({
  validateSearch: (search: Record<string, unknown>): { cause?: string; q?: string } => ({
    ...(typeof search["cause"] === "string" ? { cause: search["cause"] } : {}),
    ...(typeof search["q"] === "string" ? { q: search["q"] } : {}),
  }),

  head: () => ({
    meta: [
      { title: "Browse opportunities · KindQuest" },
      {
        name: "description",
        content: "Search and filter volunteering opportunities by cause, location, skills and format.",
      },
      { property: "og:title", content: "Browse opportunities · KindQuest" },
      {
        property: "og:description",
        content: "Every open KindQuest opportunity, filterable by cause, location and availability.",
      },
    ],
  }),
  component: BrowsePage,
});

const ALL = "all";
const RECOMMENDATIONS = "recommendations";

function BrowsePage() {
  const { cause: causeParam, q: qParam } = Route.useSearch();
  const navigate = useNavigate();

  const [query, setQuery] = useState(qParam ?? "");
  const [cause, setCause] = useState(causeParam || ALL);
  const [location, setLocation] = useState(ALL);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [sort, setSort] = useState("match");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [adventureSession, setAdventureSession] = useState<AdventureSession | null>(null);

  useEffect(() => {
    let isMounted = true;
    loadAdventureSessionAsync().then((sess) => {
      if (isMounted) setAdventureSession(sess);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const userCauses = adventureSession?.discoveredInterests ?? [];
    const userSkills = adventureSession?.discoveredSkills ?? [];

    let list = activeOpportunities.filter((o) => {
      if (cause === RECOMMENDATIONS) {
        if (userCauses.length > 0 || userSkills.length > 0) {
          const matchCause = userCauses.includes(o.cause);
          const matchSkill = o.skills.some((s) =>
            userSkills.some((us) => s.toLowerCase().includes(us.toLowerCase()) || us.toLowerCase().includes(s.toLowerCase())),
          );
          if (!matchCause && !matchSkill) return false;
        } else {
          if (o.matchScore < 75) return false;
        }
      } else if (cause !== ALL && o.cause !== cause) {
        return false;
      }
      if (location !== ALL && o.location !== location) return false;
      if (remoteOnly && !o.remote) return false;
      if (!q) return true;
      return (
        o.title.toLowerCase().includes(q) ||
        o.summary.toLowerCase().includes(q) ||
        o.skills.some((s) => s.toLowerCase().includes(q))
      );
    });
    list = [...list].sort((a, b) =>
      sort === "points"
        ? b.impactPoints - a.impactPoints
        : sort === "recent"
          ? b.createdAt.localeCompare(a.createdAt)
          : b.matchScore - a.matchScore,
    );
    return list;
  }, [query, cause, location, remoteOnly, sort, adventureSession]);

  const clearAll = () => {
    setQuery("");
    setCause(ALL);
    setLocation(ALL);
    setRemoteOnly(false);
    void navigate({ to: "/browse", search: {} });
  };

  const activeFilters =
    (cause !== ALL ? 1 : 0) + (location !== ALL ? 1 : 0) + (remoteOnly ? 1 : 0) + (query ? 1 : 0);

  const filters = (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="cause">Cause</Label>
        <Select value={cause} onValueChange={setCause}>
          <SelectTrigger id="cause">
            <SelectValue placeholder="All causes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All causes</SelectItem>
            <SelectItem value={RECOMMENDATIONS}>
              <span className="flex items-center gap-1 font-medium text-primary">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                Your Recommendations
              </span>
            </SelectItem>
            {allCauses.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger id="location">
            <SelectValue placeholder="Anywhere" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Anywhere</SelectItem>
            {allLocations.map((l) => (
              <SelectItem key={l} value={l}>
                {l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between gap-4 rounded-xl bg-muted/60 p-3">
        <Label htmlFor="remote" className="cursor-pointer">
          Remote only
        </Label>
        <Switch id="remote" checked={remoteOnly} onCheckedChange={setRemoteOnly} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sort">Sort by</Label>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger id="sort">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="match">Best match</SelectItem>
            <SelectItem value="points">Most Impact Points</SelectItem>
            <SelectItem value="recent">Recently added</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button variant="outline" className="w-full" onClick={clearAll}>
        Clear filters
      </Button>
    </div>
  );

  return (
    <AppShell title="Browse opportunities" subtitle="Everything open right now.">
      <div className="grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="card-surface sticky top-24 rounded-2xl p-5">
            <p className="mb-4 flex items-center gap-2 font-semibold">
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              Filters
            </p>
            {filters}
          </div>
        </aside>

        <div className="min-w-0">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search opportunities, skills or causes"
              aria-label="Search opportunities"
            />
            <div className="flex shrink-0 items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open filters">
                    <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="max-h-[85dvh] overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="p-4">{filters}</div>
                </SheetContent>
              </Sheet>
              <Button
                variant="outline"
                size="icon"
                aria-label={layout === "grid" ? "Switch to list view" : "Switch to grid view"}
                onClick={() => setLayout((l) => (l === "grid" ? "list" : "grid"))}
              >
                {layout === "grid" ? (
                  <List className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <LayoutGrid className="h-4 w-4" aria-hidden="true" />
                )}
              </Button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <p className="text-sm text-muted-foreground">
              {results.length} opportunit{results.length === 1 ? "y" : "ies"}
            </p>
            {activeFilters ? <Badge variant="secondary">{activeFilters} filter(s) active</Badge> : null}
          </div>

          <div className="mt-6">
            {results.length === 0 ? (
              <EmptyState
                icon={SearchX}
                title="No opportunities match those filters"
                description="Try widening your search — removing the location or remote filter usually helps."
                action={<Button onClick={clearAll}>Clear filters</Button>}
              />
            ) : layout === "grid" ? (
              <OpportunityGrid items={results} />
            ) : (
              <OpportunityList items={results} />
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Compass,
  MapPin,
  RotateCcw,
  Sparkles,
  SkipForward,
  UserRound,
  Wifi,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { AdventureMap } from "@/components/game/AdventureMap";
import { PlaceActivity } from "@/components/game/PlaceActivity";
import {
  allAdventureDestinations,
  deeperDestinations,
  destinations,
  MIN_DESTINATIONS,
  tintClass,
  type Destination,
  type Trait,
} from "@/components/game/adventure-data";
import { KindQuestLogo } from "@/components/KindQuestLogo";
import { MatchReasons } from "@/components/shared/MatchBadge";
import { OpportunityCard } from "@/components/shared/OpportunityCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { activeOpportunities } from "@/data/opportunities";
import {
  clearAdventureSession,
  emptyAdventureSession,
  loadAdventureSession,
  loadAdventureSessionAsync,
  saveAdventureSession,
  saveAdventureSessionAsync,
  uniqueItems,
  type AdventureSession,
  type ExplorationSessionType,
  type VolunteeringMode,
} from "@/lib/adventure-progress";
import { cn } from "@/lib/utils";
import type { Cause, Opportunity } from "@/types";

import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/onboarding/game")({
  validateSearch: (search: Record<string, unknown>): { mode?: "deeper" } =>
    search["mode"] === "deeper" ? { mode: "deeper" } : {},
  head: () => ({
    meta: [
      { title: "KindQuest Adventure · Discover how you like to help" },
      {
        name: "description",
        content:
          "Play a two-minute KindQuest Adventure — explore places, complete tiny acts of impact, and get volunteering matches that fit you.",
      },
      { property: "og:title", content: "KindQuest Adventure" },
      {
        property: "og:description",
        content:
          "Explore a small map of tiny good deeds and discover the volunteering that fits you.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdventureOnboarding,
});

type Stage =
  "intro" | "map" | "destination" | "reward" | "decision" | "results" | "details" | "matches";

const availabilityOptions = ["Weekdays", "Weekends", "Evenings", "Flexible"] as const;

const deeperPaths: [string, string][] = [
  ["start", "local-event"],
  ["start", "remote-desk"],
  ["remote-desk", "lesson-lab"],
  ["local-event", "campaign-studio"],
  ["campaign-studio", "supply-sort"],
  ["lesson-lab", "supply-sort"],
];

function AdventureOnboarding() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/login", search: { redirect: "/onboarding/game" } });
    }
  }, [user, loading, navigate]);

  const { mode } = Route.useSearch();
  const [stage, setStage] = useState<Stage>(mode === "deeper" ? "map" : "intro");
  const [sessionType, setSessionType] = useState<ExplorationSessionType>(
    mode === "deeper" ? "deeper" : "initial",
  );
  const [profile, setProfile] = useState<AdventureSession>(() => emptyAdventureSession());
  const [active, setActive] = useState<Destination | null>(null);
  const [unlockedNote, setUnlockedNote] = useState<string | null>(null);
  const [place, setPlace] = useState<"nearby" | "remote" | "both" | null>(null);
  const [availability, setAvailability] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;
    loadAdventureSessionAsync().then((stored) => {
      if (!isMounted) return;
      setProfile(stored);
      setAvailability(stored.availability);
      const savedMode = stored.volunteeringMode.includes("both")
        ? "both"
        : stored.volunteeringMode.includes("remote") &&
            stored.volunteeringMode.includes("in-person")
          ? "both"
          : stored.volunteeringMode.includes("remote")
            ? "remote"
            : stored.volunteeringMode.includes("in-person")
              ? "nearby"
              : null;
      setPlace(savedMode);
      if (mode === "deeper") {
        setStage("map");
        setSessionType("deeper");
      }
    });
    return () => {
      isMounted = false;
    };
  }, [mode]);

  const currentDestinations = sessionType === "deeper" ? deeperDestinations : destinations;
  const completed = profile.completedInteractions;
  const completedOnCurrentMap = currentDestinations
    .filter(
      (d) => completed.includes(d.interactionId) || profile.visitedDestinations.includes(d.id),
    )
    .map((d) => (completed.includes(d.interactionId) ? d.id : ""))
    .filter(Boolean);
  const visitedOnCurrentMap = currentDestinations
    .filter((d) => profile.visitedDestinations.includes(d.id))
    .map((d) => d.id);
  const energy = profile.adventureProgress;

  const visited = useMemo(
    () =>
      allAdventureDestinations.filter(
        (destination) =>
          profile.visitedDestinations.includes(destination.id) ||
          profile.completedInteractions.includes(destination.interactionId),
      ),
    [profile.completedInteractions, profile.visitedDestinations],
  );

  const causes = profile.discoveredInterests;
  const activityPreferences = profile.activityPreferences;
  const discoveredSkills = profile.discoveredSkills;

  const traits = useMemo(() => {
    const counts = new Map<Trait, number>();
    visited.forEach((d) => d.traits.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t);
  }, [visited]);

  const enter = (destination: Destination) => {
    setProfile((current) => {
      const next = {
        ...current,
        visitedDestinations: uniqueItems([...current.visitedDestinations, destination.id]),
        updatedAt: new Date().toISOString(),
      };
      saveAdventureSession(next);
      return next;
    });
    setActive(destination);
    setStage("destination");
  };

  const finishDestination = () => {
    if (!active) return;
    const alreadyDone = profile.completedInteractions.includes(active.interactionId);
    const nextCompleted = alreadyDone
      ? profile.completedInteractions
      : [...profile.completedInteractions, active.interactionId];
    const nextVisited = uniqueItems([...profile.visitedDestinations, active.id]);
    const nextMode = toStoredModes(place, profile.volunteeringMode, active.volunteeringMode);
    const nextAvailability = uniqueItems([...profile.availability, ...availability]);
    const nextProfile: AdventureSession = {
      ...profile,
      adventureProgress: alreadyDone
        ? profile.adventureProgress
        : profile.adventureProgress + active.reward,
      visitedDestinations: nextVisited,
      completedInteractions: nextCompleted,
      discoveredInterests: uniqueItems([...profile.discoveredInterests, ...active.causes]),
      activityPreferences: uniqueItems([
        ...profile.activityPreferences,
        ...active.activityPreferences,
      ]),
      discoveredSkills: uniqueItems([...profile.discoveredSkills, ...active.skills]),
      volunteeringMode: nextMode,
      availability: nextAvailability,
      explorationHistory: alreadyDone
        ? profile.explorationHistory
        : [
            ...profile.explorationHistory,
            {
              id: `${active.interactionId}-${Date.now()}`,
              destinationId: active.id,
              destinationName: active.name,
              label: active.interactionLabel,
              completedAt: new Date().toISOString(),
              sessionType,
              discoveries: {
                causes: active.causes,
                activityPreferences: active.activityPreferences,
                skills: active.skills,
                volunteeringMode: active.volunteeringMode ?? [],
              },
            },
          ],
      updatedAt: new Date().toISOString(),
    };

    setProfile(nextProfile);
    saveAdventureSession(nextProfile);
    saveAdventureSessionAsync(nextProfile);
    const unlocked = currentDestinations.find(
      (d) =>
        d.unlockAfter === completedOnCurrentMap.length + 1 &&
        !nextCompleted.includes(d.interactionId),
    );
    setUnlockedNote(unlocked ? unlocked.name : null);
    setStage("reward");
  };

  const reset = () => {
    clearAdventureSession();
    setStage("intro");
    setSessionType("initial");
    setProfile(emptyAdventureSession());
    setActive(null);
    setUnlockedNote(null);
    setPlace(null);
    setAvailability([]);
  };

  const startDeeper = () => {
    setSessionType("deeper");
    setActive(null);
    setUnlockedNote(null);
    setStage("map");
  };

  const commitDetails = () => {
    const nextProfile: AdventureSession = {
      ...profile,
      availability: uniqueItems([...profile.availability, ...availability]),
      volunteeringMode: toStoredModes(place, profile.volunteeringMode),
      updatedAt: new Date().toISOString(),
    };
    setProfile(nextProfile);
    saveAdventureSession(nextProfile);
    saveAdventureSessionAsync(nextProfile);
    setStage("matches");
  };

  const rankedMatches = useMemo(
    () => rankMatches(activeOpportunities, profile, place),
    [profile, place],
  );

  const enoughExplored =
    sessionType === "deeper"
      ? completedOnCurrentMap.length >= 2
      : completedOnCurrentMap.length >= MIN_DESTINATIONS;
  const playerAt = visitedOnCurrentMap.at(-1) ?? "start";

  return (
    <div className="min-h-dvh bg-surface">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" aria-label="KindQuest home">
            <KindQuestLogo size="sm" framed />
          </Link>
          <div className="flex items-center gap-2">
            {energy > 0 && stage !== "intro" ? (
              <Badge variant="secondary" className="gap-1">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                {energy} Kindness Energy
              </Badge>
            ) : null}
            <Button asChild variant="ghost" size="sm">
              <Link to="/browse">
                <SkipForward className="mr-1 h-4 w-4" aria-hidden="true" />
                Skip
              </Link>
            </Button>
          </div>
        </div>

        {stage === "intro" ? (
          <section className="mt-10 animate-fade-in">
            <Badge className="bg-accent text-accent-foreground hover:bg-accent">
              Interactive onboarding
            </Badge>
            <h1 className="mt-4 text-3xl font-bold sm:text-5xl">KindQuest Adventure</h1>
            <p className="mt-3 max-w-xl text-lg text-muted-foreground">
              Let's see where your curiosity takes you.
            </p>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Explore a few places on the map and complete tiny acts of impact. We'll learn what
              kind of volunteering fits you — it takes about a minute.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {destinations.slice(0, 6).map((destination) => (
                <span
                  key={destination.id}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-sm font-semibold",
                    tintClass[destination.tint],
                  )}
                >
                  {destination.emoji} {destination.name}
                </span>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              <Button size="lg" onClick={() => setStage("map")}>
                Start Adventure
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/onboarding/ai">Prefer a conversation?</Link>
              </Button>
            </div>
          </section>
        ) : null}

        {stage === "map" ? (
          <section className="mt-8 animate-fade-in">
            <PathTrail completed={completedOnCurrentMap} items={currentDestinations} />
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold sm:text-3xl">
                  {sessionType === "deeper"
                    ? "Explore more ways to help"
                    : "Where would you like to explore?"}
                </h1>
                <p className="mt-2 text-muted-foreground">
                  {enoughExplored
                    ? sessionType === "deeper"
                      ? "You've added more signals — keep exploring, or return to your profile."
                      : "You've explored plenty — choose what to do next."
                    : sessionType === "deeper"
                      ? "Try at least two new paths to refine your profile."
                      : `Visit ${MIN_DESTINATIONS - completedOnCurrentMap.length} more place${
                          MIN_DESTINATIONS - completedOnCurrentMap.length === 1 ? "" : "s"
                        } to shape your profile.`}
                </p>
              </div>
              {profile.explorationHistory.length ? (
                <Badge variant="outline" className="self-start sm:self-auto">
                  {profile.explorationHistory.length} discoveries saved
                </Badge>
              ) : null}
            </div>

            <div className="mt-5">
              <AdventureMap
                completed={completedOnCurrentMap}
                playerAt={playerAt}
                onEnter={enter}
                items={currentDestinations}
                mapPaths={sessionType === "deeper" ? deeperPaths : undefined}
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                size="lg"
                disabled={!enoughExplored}
                onClick={() => setStage(sessionType === "deeper" ? "results" : "decision")}
                variant={enoughExplored ? "default" : "outline"}
              >
                {enoughExplored
                  ? sessionType === "deeper"
                    ? "Update my profile"
                    : "Finish this adventure"
                  : "Explore a few more places"}
              </Button>
              {profile.explorationHistory.length > 0 ? (
                <Button variant="ghost" size="lg" onClick={reset}>
                  <RotateCcw className="mr-1 h-4 w-4" aria-hidden="true" />
                  Start over
                </Button>
              ) : null}
            </div>
          </section>
        ) : null}

        {stage === "destination" && active ? (
          <section className="mt-8 animate-fade-in">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {sessionType === "deeper" ? "Explore more" : "Explore"}
            </p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
              {active.emoji} {active.name}
            </h1>
            <p className="mt-2 text-muted-foreground">{active.intro}</p>
            <PlaceActivity destination={active} onComplete={finishDestination} />
            <Button variant="ghost" size="sm" className="mt-4" onClick={() => setStage("map")}>
              Back to the map
            </Button>
          </section>
        ) : null}

        {stage === "reward" && active ? (
          <section className="mt-12 animate-fade-in">
            <div className="card-surface mx-auto max-w-lg rounded-3xl p-8 text-center leaf-glow">
              <div className="text-5xl animate-scale-in">{active.filledEmoji}</div>
              <h1 className="mt-4 text-2xl font-bold">You made an impact!</h1>
              <p className="mt-2 text-muted-foreground">{active.observation}</p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <Badge className="bg-accent text-accent-foreground hover:bg-accent">
                  +{active.reward} Kindness Energy
                </Badge>
                {active.causes.map((cause) => (
                  <Badge key={cause} variant="secondary">
                    {cause}
                  </Badge>
                ))}
                {active.skills.slice(0, 2).map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
              {unlockedNote ? (
                <p className="mt-5 rounded-2xl bg-primary-soft px-4 py-3 text-sm font-semibold text-accent-foreground">
                  New path unlocked ✨ {unlockedNote}
                </p>
              ) : null}
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button size="lg" onClick={() => setStage("map")}>
                  Keep exploring
                  <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                </Button>
                <Button variant="outline" size="lg" onClick={() => setStage("matches")}>
                  Result
                </Button>
              </div>
            </div>
          </section>
        ) : null}

        {stage === "decision" ? (
          <section className="mt-8 animate-fade-in">
            <PathTrail completed={completedOnCurrentMap} items={destinations} />
            <h1 className="mt-4 text-2xl font-bold sm:text-3xl">
              Your first KindQuest profile is ready.
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Start with tailored opportunities now, or keep exploring to sharpen your activity
              style, skills, and volunteering mode.
            </p>
            <ProfileSnapshot
              causes={causes}
              activityPreferences={activityPreferences}
              discoveredSkills={discoveredSkills}
              mode={profile.volunteeringMode}
              historyCount={profile.explorationHistory.length}
            />
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <div className="card-surface rounded-2xl p-6">
                <MapPin className="h-6 w-6 text-primary" aria-hidden="true" />
                <h2 className="mt-3 text-lg font-semibold">Start volunteering</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Add location and availability, then see the opportunities KindQuest recommends.
                </p>
                <Button className="mt-5" onClick={() => setStage("details")}>
                  Continue
                  <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
              <div className="card-surface rounded-2xl p-6">
                <Compass className="h-6 w-6 text-primary" aria-hidden="true" />
                <h2 className="mt-3 text-lg font-semibold">Explore more</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Play a few deeper mini-adventures without losing the profile you've already built.
                </p>
                <Button className="mt-5" variant="outline" onClick={startDeeper}>
                  Explore more ways to help
                </Button>
              </div>
            </div>
          </section>
        ) : null}

        {stage === "results" ? (
          <section className="mt-8 animate-fade-in">
            <PathTrail completed={completedOnCurrentMap} items={currentDestinations} />
            <h1 className="mt-4 text-2xl font-bold sm:text-3xl">
              Your KindQuest profile is getting richer. 🌱
            </h1>
            <p className="mt-2 text-muted-foreground">
              Built from {profile.explorationHistory.length} saved interaction
              {profile.explorationHistory.length === 1 ? "" : "s"} across your adventure history.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {visited.slice(-8).map((destination, index) => (
                <div
                  key={destination.id}
                  className="card-surface rounded-2xl p-5 animate-fade-in"
                  style={{ animationDelay: `${index * 90}ms` }}
                >
                  <div className="text-3xl">{destination.emoji}</div>
                  <p className="mt-3 font-semibold">{destination.causes[0]}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{destination.observation}</p>
                </div>
              ))}
            </div>

            <ProfileSnapshot
              causes={causes}
              activityPreferences={activityPreferences}
              discoveredSkills={discoveredSkills}
              mode={profile.volunteeringMode}
              historyCount={profile.explorationHistory.length}
            />

            <div className="mt-7 flex flex-wrap gap-3">
              <Button size="lg" onClick={() => setStage("details")}>
                Start volunteering
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Button>
              <Button variant="outline" size="lg" onClick={startDeeper}>
                Explore more
              </Button>
              <Button variant="ghost" size="lg" onClick={() => setStage("map")}>
                Back to the map
              </Button>
            </div>
          </section>
        ) : null}

        {stage === "details" ? (
          <section className="mt-8 animate-fade-in">
            <h1 className="text-2xl font-bold sm:text-3xl">Two things the game can't guess</h1>
            <p className="mt-2 text-muted-foreground">You can change both of these later.</p>

            <div className="mt-7 card-surface rounded-3xl p-6">
              <h2 className="font-semibold">Where would you like to volunteer?</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <ChoiceTile
                  selected={place === "nearby"}
                  onClick={() => setPlace("nearby")}
                  icon={<MapPin className="h-5 w-5" aria-hidden="true" />}
                  label="Near me"
                  helper="In-person opportunities around your city"
                />
                <ChoiceTile
                  selected={place === "remote"}
                  onClick={() => setPlace("remote")}
                  icon={<Wifi className="h-5 w-5" aria-hidden="true" />}
                  label="Remote"
                  helper="Help from anywhere, online"
                />
                <ChoiceTile
                  selected={place === "both"}
                  onClick={() => setPlace("both")}
                  icon={<Compass className="h-5 w-5" aria-hidden="true" />}
                  label="Both"
                  helper="Show me every good fit"
                />
              </div>
            </div>

            <div className="mt-5 card-surface rounded-3xl p-6">
              <h2 className="font-semibold">When are you usually available?</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {availabilityOptions.map((option) => {
                  const selected = availability.includes(option);
                  return (
                    <Button
                      key={option}
                      type="button"
                      aria-pressed={selected}
                      variant={selected ? "default" : "outline"}
                      onClick={() =>
                        setAvailability((previous) =>
                          previous.includes(option)
                            ? previous.filter((item) => item !== option)
                            : [...previous, option],
                        )
                      }
                    >
                      {option}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button size="lg" onClick={commitDetails}>
                Find my opportunities
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Button>
              <Button variant="outline" size="lg" onClick={startDeeper}>
                Explore more first
              </Button>
            </div>
          </section>
        ) : null}

        {stage === "matches" ? (
          <section className="mt-8 animate-fade-in">
            <Badge className="bg-accent text-accent-foreground hover:bg-accent">
              <Sparkles className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
              Adventure complete · {energy} Kindness Energy
            </Badge>
            <h1 className="mt-4 text-2xl font-bold sm:text-3xl">
              Opportunities that fit your adventure
            </h1>
            <p className="mt-2 text-muted-foreground">
              Matched to {causes.join(", ") || "your interests"}
              {place
                ? ` · ${place === "remote" ? "Remote" : place === "nearby" ? "Near you" : "Remote and in person"}`
                : ""}
              {availability.length ? ` · ${availability.join(", ")}` : ""}
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {rankedMatches.slice(0, 6).map((match) => (
                <div key={match.opportunity.id} className="space-y-3">
                  <OpportunityCard
                    opportunity={{ ...match.opportunity, matchScore: match.score }}
                  />
                  <MatchReasons reasons={match.reasons} />
                </div>
              ))}
            </div>

            <ProfileSnapshot
              causes={causes}
              activityPreferences={activityPreferences}
              discoveredSkills={discoveredSkills}
              mode={profile.volunteeringMode}
              historyCount={profile.explorationHistory.length}
            />

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/discover">
                  Go to my dashboard
                  <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" onClick={startDeeper}>
                Explore more
              </Button>
              <Button variant="ghost" size="lg" onClick={reset}>
                <RotateCcw className="mr-1 h-4 w-4" aria-hidden="true" />
                Play again
              </Button>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}

function toStoredModes(
  selected: "nearby" | "remote" | "both" | null,
  current: VolunteeringMode[],
  discovered: VolunteeringMode[] = [],
) {
  const selectedModes: VolunteeringMode[] =
    selected === "nearby"
      ? ["in-person"]
      : selected === "remote"
        ? ["remote"]
        : selected === "both"
          ? ["both"]
          : [];
  return uniqueItems([...current, ...discovered, ...selectedModes]);
}

function rankMatches(
  opportunities: Opportunity[],
  profile: AdventureSession,
  place: "nearby" | "remote" | "both" | null,
) {
  const modeFilter = place ?? (profile.volunteeringMode.includes("remote") ? "remote" : null);
  const pool = opportunities.filter((opportunity) => {
    if (modeFilter === "remote") return opportunity.remote;
    if (modeFilter === "nearby") return !opportunity.remote;
    return true;
  });
  const scored = (pool.length ? pool : opportunities).map((opportunity) => {
    let score = opportunity.matchScore;
    const reasons: string[] = [];

    if (profile.discoveredInterests.includes(opportunity.cause)) {
      score += 9;
      reasons.push(`You explored ${opportunity.cause.toLowerCase()} activities.`);
    }

    const matchedSkills = opportunity.skills.filter((skill) =>
      profile.discoveredSkills.some(
        (profileSkill) =>
          skill.toLowerCase().includes(profileSkill.toLowerCase()) ||
          profileSkill.toLowerCase().includes(skill.toLowerCase()),
      ),
    );
    if (matchedSkills.length) {
      score += Math.min(8, matchedSkills.length * 4);
      reasons.push(`Uses skills you discovered: ${matchedSkills.slice(0, 2).join(", ")}.`);
    }

    if (profile.activityPreferences.includes("Hands-on") && !opportunity.remote) {
      score += 4;
      reasons.push("Fits the hands-on play choices in your adventure.");
    }
    if (profile.activityPreferences.includes("Remote") && opportunity.remote) {
      score += 4;
      reasons.push("Fits your remote-support discoveries.");
    }
    if (
      profile.activityPreferences.includes("Teaching") &&
      opportunity.skills.some((skill) => skill.toLowerCase().includes("teach"))
    ) {
      score += 5;
      reasons.push("Connects to the teaching path you explored.");
    }
    if (
      profile.activityPreferences.includes("Creative") &&
      opportunity.skills.some((skill) => /creativity|painting|editing|storytelling/i.test(skill))
    ) {
      score += 5;
      reasons.push("Connects to the creative tasks you chose.");
    }
    if (
      profile.availability.includes("Weekends") &&
      /sat|sun|weekend/i.test(`${opportunity.date} ${opportunity.schedule}`)
    ) {
      score += 3;
      reasons.push("Lines up with your weekend availability.");
    }
    if (
      profile.availability.includes("Evenings") &&
      /evening|pm|weeknight/i.test(`${opportunity.date} ${opportunity.schedule}`)
    ) {
      score += 3;
      reasons.push("Lines up with your evening availability.");
    }
    if (!reasons.length) reasons.push(...opportunity.matchReasons.slice(0, 2));

    return {
      opportunity,
      score: Math.min(99, score),
      reasons: uniqueItems(reasons).slice(0, 4),
    };
  });

  return scored.sort((a, b) => b.score - a.score);
}

function ProfileSnapshot({
  causes,
  activityPreferences,
  discoveredSkills,
  mode,
  historyCount,
}: {
  causes: Cause[];
  activityPreferences: string[];
  discoveredSkills: string[];
  mode: VolunteeringMode[];
  historyCount: number;
}) {
  return (
    <div className="mt-8 card-surface rounded-3xl p-6">
      <div className="flex items-center gap-2">
        <UserRound className="h-5 w-5 text-primary" aria-hidden="true" />
        <h2 className="text-lg font-semibold">Cumulative KindQuest Profile</h2>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        {historyCount} adventure interaction{historyCount === 1 ? "" : "s"} saved and used for
        matching.
      </p>
      <div className="mt-5 grid gap-5 sm:grid-cols-3">
        <ProfileGroup title="Causes" items={causes} empty="Explore a few places" />
        <ProfileGroup
          title="Activity style"
          items={activityPreferences}
          empty="Still discovering"
        />
        <ProfileGroup title="Skills" items={discoveredSkills} empty="Still discovering" />
      </div>
      {mode.length ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {mode.map((item) => (
            <Badge key={item} variant="outline">
              {item === "in-person" ? "In person" : item === "remote" ? "Remote" : "Open to both"}
            </Badge>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ProfileGroup({
  title,
  items,
  empty,
}: {
  title: string;
  items: readonly string[];
  empty: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {items.length ? (
          items.slice(0, 7).map((item) => (
            <Badge key={item} variant="secondary">
              {item}
            </Badge>
          ))
        ) : (
          <span className="text-sm text-muted-foreground">{empty}</span>
        )}
      </div>
    </div>
  );
}

function ChoiceTile({
  selected,
  onClick,
  icon,
  label,
  helper,
}: {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  helper: string;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "h-auto justify-start rounded-2xl p-5 text-left transition-all duration-200",
        selected
          ? "border-primary bg-primary-soft"
          : "bg-card hover:-translate-y-0.5 hover:border-primary",
      )}
    >
      <span className="flex min-w-0 flex-col whitespace-normal">
        <span className="flex items-center gap-2 font-semibold">
          {icon}
          {label}
        </span>
        <span className="mt-1 text-sm font-normal text-muted-foreground">{helper}</span>
      </span>
    </Button>
  );
}

/** Progress shown as the trail through the world, never as a survey bar. */
function PathTrail({ completed, items }: { completed: string[]; items: Destination[] }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 text-sm">
      <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">
        🌱 Start
      </span>
      {completed.map((id) => {
        const destination = items.find((item) => item.id === id);
        if (!destination) return null;
        return (
          <span key={id} className="flex items-center gap-1.5">
            <span className="text-muted-foreground">→</span>
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-semibold",
                tintClass[destination.tint],
              )}
            >
              {destination.emoji} {destination.name}
            </span>
          </span>
        );
      })}
      <span className="text-muted-foreground">→</span>
      <span className="rounded-full border border-dashed border-border px-2.5 py-1 text-xs font-semibold text-muted-foreground">
        ✨ Finish
      </span>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bot, Gamepad2, SkipForward } from "lucide-react";

import { KindQuestLogo } from "@/components/KindQuestLogo";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/onboarding/")({
  head: () => ({
    meta: [
      { title: "Discover your cause · KindQuest" },
      {
        name: "description",
        content: "Play a short discovery game or talk to KindQuest — or skip and browse opportunities.",
      },
      { property: "og:title", content: "Discover your cause · KindQuest" },
      {
        property: "og:description",
        content: "Play a short discovery game or talk to KindQuest — onboarding is always optional.",
      },
    ],
  }),
  component: OnboardingChoice,
});

function OnboardingChoice() {
  return (
    <div className="min-h-dvh bg-surface">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
        <Link to="/" aria-label="KindQuest home">
          <KindQuestLogo size="sm" framed />
        </Link>

        <h1 className="mt-8 text-3xl font-bold sm:text-4xl">How would you like to start?</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Both paths help KindQuest understand what fits you. You can also skip this entirely.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Card
            icon={Gamepad2}
            kicker="Interactive game"
            title="Discover your causes"
            body="A few playful questions about what you'd enjoy doing."
            to="/onboarding/game"
            cta="Play & discover"
          />
          <Card
            icon={Bot}
            kicker="AI conversation"
            title="Just tell us what matters"
            body="Talk naturally about interests, skills and availability."
            to="/onboarding/ai"
            cta="Talk to KindQuest"
          />
        </div>

        <div className="card-surface mt-6 flex flex-col items-start gap-3 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="font-semibold">Not in the mood for questions?</p>
            <p className="text-sm text-muted-foreground">
              Skip onboarding and browse everything available right now.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/browse">
              <SkipForward className="mr-1 h-4 w-4" aria-hidden="true" />
              Skip for now
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function Card({
  icon: Icon,
  kicker,
  title,
  body,
  to,
  cta,
}: {
  icon: typeof Bot;
  kicker: string;
  title: string;
  body: string;
  to: "/onboarding/game" | "/onboarding/ai";
  cta: string;
}) {
  return (
    <div className="card-surface flex flex-col rounded-3xl p-6">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft">
        <Icon className="h-6 w-6 text-accent-foreground" aria-hidden="true" />
      </span>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{kicker}</p>
      <h2 className="mt-1 text-xl font-semibold">{title}</h2>
      <p className="mt-2 flex-1 text-sm text-muted-foreground">{body}</p>
      <Button asChild className="mt-6 self-start">
        <Link to={to}>
          {cta}
          <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
        </Link>
      </Button>
    </div>
  );
}

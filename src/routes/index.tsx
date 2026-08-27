import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Bot,
  Building2,
  Gamepad2,
  Handshake,
  Heart,
  IdCard,
  Leaf,
  Link2,
  MapPin,
  Medal,
  ShieldCheck,
  Sparkle,
  Stethoscope,
  TrendingUp,
  Users,
  Wifi,
} from "lucide-react";

import { KindQuestLogo } from "@/components/KindQuestLogo";
import { KindnessGlobe3D } from "@/components/landing/KindnessGlobe3D";
import { SiteFooter, SiteHeader, TAGLINE } from "@/components/landing/SiteChrome";
import { OpportunityCard } from "@/components/shared/OpportunityCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { activeOpportunities } from "@/data/opportunities";
import { badges, demoVolunteer } from "@/data/volunteer";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KindQuest — Find your cause. Make an impact." },
      {
        name: "description",
        content:
          "KindQuest matches you with volunteering opportunities based on your interests, skills, location and availability — in person or remote.",
      },
      { property: "og:title", content: "KindQuest — Find your cause. Make an impact." },
      {
        property: "og:description",
        content:
          "An AI-powered volunteering platform with a persistent Volunteer ID, Impact Points, ranks, badges and certificates.",
      },
    ],
  }),
  component: Landing,
});

const steps = [
  {
    n: "01",
    title: "Discover Yourself",
    body: "Tell KindQuest what you care about through a quick interactive experience.",
  },
  {
    n: "02",
    title: "Find Your Match",
    body: "Receive opportunities based on your interests, skills, location and availability.",
  },
  { n: "03", title: "Make an Impact", body: "Volunteer in person or remotely." },
  {
    n: "04",
    title: "Build Your Journey",
    body: "Earn Impact Points, badges, ranks and recognition.",
  },
];

function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const featured = activeOpportunities.slice(0, 3);

  const handleFindOpportunity = () => {
    if (user) {
      navigate({ to: "/onboarding" });
    } else {
      navigate({ to: "/login", search: { redirect: "/onboarding" } });
    }
  };

  const handleBrowseScroll = () => {
    const el = document.getElementById("opportunities");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="leaf-glow border-b border-border">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:py-20">
          <div>
            <h1 className="mt-5 text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl">
              Find your cause.
              <br />
              Find your opportunity.
              <br />
              <span className="text-primary">Make an impact.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              Find volunteering opportunities that fit what you care about, what you're good at,
              where you are, and when you're available.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" onClick={handleFindOpportunity}>
                Find your opportunity
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Button>
              <Button size="lg" variant="outline" onClick={handleBrowseScroll}>
                Browse opportunities
              </Button>
            </div>
            <p className="mt-5 text-sm text-muted-foreground">
              Volunteer in person or remotely. Onboarding is always optional.
            </p>
          </div>

          {/* Interactive 3D Kindness Globe */}
          <div className="flex justify-center lg:justify-end">
            <KindnessGlobe3D />
          </div>
        </div>
      </section>

      {/* How it works */}
      <Section
        id="how-it-works"
        title="How KindQuest works"
        lead="Four steps, and you can skip any of them."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="card-surface rounded-2xl p-5">
              <span className="font-display text-2xl font-bold text-primary">{s.n}</span>
              <h3 className="mt-2 text-base font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Two ways to start */}
      <Section
        title="Two ways to start"
        lead="Play, or just talk. Whichever feels easier today."
        tone="surface"
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <StartCard
            icon={Gamepad2}
            kicker="Interactive game"
            title="Discover your causes"
            body="Answer a few fun questions and let KindQuest understand what kinds of volunteering fit you."
            cta="Play & discover"
            to="/onboarding/game"
          />
          <StartCard
            icon={Bot}
            kicker="AI conversation"
            title="Just tell us what matters"
            body="Talk naturally about your interests, skills and availability."
            cta="Talk to KindQuest"
            to="/onboarding/ai"
          />
        </div>
      </Section>

      {/* Volunteer anywhere */}
      <Section
        title="Volunteer anywhere"
        lead="Where you live shouldn't decide whether you can help."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="card-surface rounded-2xl p-6">
            <MapPin className="h-6 w-6 text-primary" aria-hidden="true" />
            <h3 className="mt-3 text-lg font-semibold">In person</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Make an impact in your local community.
            </p>
          </div>
          <div className="card-surface rounded-2xl p-6">
            <Wifi className="h-6 w-6 text-primary" aria-hidden="true" />
            <h3 className="mt-3 text-lg font-semibold">Remote</h3>
            <p className="mt-2 text-sm text-muted-foreground">Contribute from wherever you are.</p>
          </div>
        </div>
      </Section>

      {/* Opportunities Showcase (Public Predefined Data) */}
      <Section
        id="opportunities"
        tone="surface"
        title="Opportunities picked for a person, not a crowd"
        lead="Explore open opportunities across education, environment, technology, and more."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {featured.map((o) => (
            <OpportunityCard key={o.id} opportunity={o} showMatchBadge={false} />
          ))}
        </div>
        <Button asChild variant="outline" className="mt-6">
          <Link to="/browse">See all opportunities</Link>
        </Button>
      </Section>

      {/* Volunteer ID */}
      <Section
        title="Your volunteering shouldn't disappear once the task is done."
        lead="KindQuest keeps a persistent record of what you contributed."
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div className="rounded-3xl border border-border bg-gradient-to-br from-primary-soft to-sky/25 p-6 shadow-[var(--shadow-lift)]">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-accent-foreground">
                  Volunteer ID
                </p>
                <h3 className="mt-1 truncate text-xl font-bold">Sample Volunteer</h3>
                <p className="text-sm text-muted-foreground">KQ-VOL-84920</p>
              </div>
              <KindQuestLogo size="sm" framed />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <Stat label="Impact Points" value="1,240" />
              <Stat label="Rank" value="Impact Builder" />
              <Stat label="Reliability" value="92 / 100" />
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {badges
                .filter((b) => b.earned)
                .slice(0, 4)
                .map((b) => (
                  <Badge key={b.id} variant="secondary" className="bg-card">
                    <Medal className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                    {b.title}
                  </Badge>
                ))}
            </div>
          </div>
          <ul className="space-y-4">
            {[
              {
                icon: IdCard,
                title: "A Volunteer ID that follows you",
                body: "One identity across every organization you help.",
              },
              {
                icon: TrendingUp,
                title: "Impact Points and ranks",
                body: "Progress that reflects contribution, not competition.",
              },
              {
                icon: Medal,
                title: "Badges and milestones",
                body: "Small, honest recognition for showing up.",
              },
              {
                icon: ShieldCheck,
                title: "Reliability from real feedback",
                body: "Organizations rate completed work.",
              },
            ].map((row) => (
              <li key={row.title} className="flex gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent">
                  <row.icon className="h-5 w-5 text-accent-foreground" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-semibold">{row.title}</p>
                  <p className="text-sm text-muted-foreground">{row.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Real impact / trust */}
      <Section
        tone="surface"
        title="Points are not the whole story"
        lead="Organizations can rate volunteer effort and conduct after a completed task, so recognition reflects genuine contribution."
      >
        <div className="grid gap-3 sm:grid-cols-4">
          {["Contribution", "Organization rating", "Reliability", "Trust"].map((step, i) => (
            <div key={step} className="card-surface flex items-center gap-3 rounded-2xl p-5">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {i + 1}
              </span>
              <p className="font-semibold">{step}</p>
            </div>
          ))}
        </div>
        <div className="card-surface mt-5 rounded-2xl p-5">
          <p className="text-sm text-muted-foreground">
            Reliability is a volunteering indicator built from organization feedback on completed
            opportunities. It is never a judgement of a person's character.
          </p>
          <Progress
            value={92}
            className="mt-4"
            aria-label="Sample reliability score 92 out of 100"
          />
          <p className="mt-2 text-sm font-semibold">Sample reliability · 92 / 100</p>
        </div>
      </Section>

      {/* Certification */}
      <Section
        title="Two kinds of certificates"
        lead="All volunteering earns Impact Points, with or without a certificate."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="card-surface rounded-2xl p-6">
            <Building2 className="h-6 w-6 text-primary" aria-hidden="true" />
            <h3 className="mt-3 text-lg font-semibold">Organization certificate</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Issued by the organization at its own discretion, for work they choose to certify.
            </p>
          </div>
          <div className="card-surface rounded-2xl p-6">
            <Award className="h-6 w-6 text-primary" aria-hidden="true" />
            <h3 className="mt-3 text-lg font-semibold">KindQuest certificate</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Earned automatically after reaching defined Impact Point or level milestones.
            </p>
          </div>
        </div>
      </Section>

      {/* Chain of kindness */}
      <Section
        tone="surface"
        title="One good action can become many."
        lead="Pass an act of impact forward by nominating someone else."
      >
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
          {["You", "Friend", "Volunteer", "Another person", "Community"].map((node, i, arr) => (
            <div key={node} className="flex items-center gap-2 sm:gap-3">
              <span className="card-surface inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold">
                <Link2 className="h-4 w-4 text-primary" aria-hidden="true" />
                {node}
              </span>
              {i < arr.length - 1 ? (
                <ArrowRight
                  className="h-4 w-4 shrink-0 rotate-90 text-muted-foreground sm:rotate-0"
                  aria-hidden="true"
                />
              ) : null}
            </div>
          ))}
        </div>
        <Button asChild className="mt-6">
          <Link to="/chain-of-kindness">See Chain of Kindness</Link>
        </Button>
      </Section>

      {/* For organizations */}
      <Section
        id="for-organizations"
        title="KindQuest is not only for volunteers"
        lead="Organizations get a first-class workspace for the whole volunteering lifecycle."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Sparkle,
              title: "Create opportunities",
              body: "Publish roles with skills, dates and Impact Points.",
            },
            {
              icon: Users,
              title: "Find volunteers",
              body: "See interests, skills and reliability before accepting.",
            },
            {
              icon: BadgeCheck,
              title: "Verify contributions",
              body: "Confirm completion and award Impact Points.",
            },
            {
              icon: Medal,
              title: "Rate and recommend",
              body: "Rate effort, reliability and conduct fairly.",
            },
            {
              icon: Award,
              title: "Issue certificates",
              body: "Certify the work you want to certify.",
            },
            {
              icon: Stethoscope,
              title: "Professional directory",
              body: "Find nearby doctors, plumbers, electricians and more.",
            },
          ].map((f) => (
            <div key={f.title} className="card-surface rounded-2xl p-5">
              <f.icon className="h-5 w-5 text-primary" aria-hidden="true" />
              <h3 className="mt-3 font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
        <Button
          className="mt-6"
          onClick={() => {
            if (user) {
              navigate({ to: "/organization" });
            } else {
              navigate({ to: "/login/organization", search: { redirect: "/organization" } });
            }
          }}
        >
          For organizations
        </Button>
      </Section>

      <section id="about" className="border-t border-border bg-surface">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <Leaf className="mx-auto h-7 w-7 text-primary" aria-hidden="true" />
          <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
            One good action should make the next good action easier to find.
          </h2>
          <p className="mt-3 text-muted-foreground">{TAGLINE}</p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/signup">Get started</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/browse">Browse opportunities</Link>
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Section({
  id,
  title,
  lead,
  children,
  tone = "base",
}: {
  id?: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
  tone?: "base" | "surface";
}) {
  return (
    <section
      id={id}
      className={tone === "surface" ? "border-y border-border bg-surface" : undefined}
    >
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-18">
        <h2 className="max-w-3xl text-2xl font-bold sm:text-3xl">{title}</h2>
        {lead ? <p className="mt-3 max-w-2xl text-muted-foreground">{lead}</p> : null}
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

function StartCard({
  icon: Icon,
  kicker,
  title,
  body,
  cta,
  to,
}: {
  icon: typeof Bot;
  kicker: string;
  title: string;
  body: string;
  cta: string;
  to: "/onboarding/game" | "/onboarding/ai";
}) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStart = () => {
    if (user) {
      navigate({ to });
    } else {
      navigate({ to: "/login", search: { redirect: to } });
    }
  };

  return (
    <div className="card-surface flex flex-col rounded-3xl p-6 sm:p-8">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft">
        <Icon className="h-6 w-6 text-accent-foreground" aria-hidden="true" />
      </span>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {kicker}
      </p>
      <h3 className="mt-1 text-xl font-semibold">{title}</h3>
      <p className="mt-2 flex-1 text-sm text-muted-foreground">{body}</p>
      <Button size="lg" className="mt-6 self-start" onClick={handleStart}>
        {cta}
        <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-card/80 p-3">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold">{value}</p>
    </div>
  );
}

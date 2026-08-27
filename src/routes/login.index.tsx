import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Building2, Heart } from "lucide-react";

import { KindQuestLogo } from "@/components/KindQuestLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/login/")({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => ({
    ...(typeof search["redirect"] === "string" ? { redirect: search["redirect"] } : {}),
  }),
  head: () => ({
    meta: [
      { title: "Log in · KindQuest" },
      {
        name: "description",
        content: "Choose how to continue on KindQuest — volunteer login or organization login.",
      },
      { property: "og:title", content: "Log in · KindQuest" },
      {
        property: "og:description",
        content: "Choose how to continue on KindQuest — volunteer login or organization login.",
      },
    ],
  }),
  component: LoginChoicePage,
});

function LoginChoicePage() {
  const search = Route.useSearch();

  return (
    <div className="leaf-glow flex min-h-dvh flex-col bg-background">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" aria-label="KindQuest home">
          <KindQuestLogo size="sm" framed />
        </Link>
        <ThemeToggle />
      </div>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-bold sm:text-4xl">Welcome back to KindQuest</h1>
        <p className="mt-3 text-muted-foreground">How would you like to continue?</p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <div className="card-surface flex flex-col rounded-3xl p-6 sm:p-8">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft">
              <Heart className="h-6 w-6 text-accent-foreground" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-xl font-semibold">Volunteer</h2>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">
              Find opportunities, track your impact and grow your Volunteer ID.
            </p>
            <Button asChild className="mt-6 self-start" size="lg">
              <Link to="/login/volunteer" search={search}>
                Volunteer Login
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>

          <div className="card-surface flex flex-col rounded-3xl p-6 sm:p-8">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sky/40">
              <Building2 className="h-6 w-6 text-sky-foreground" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-xl font-semibold">Organization</h2>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">
              Create opportunities, manage volunteers and build community impact.
            </p>
            <Button asChild variant="outline" className="mt-6 self-start" size="lg">
              <Link to="/login/organization" search={search}>
                Organization Login
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          New to KindQuest?{" "}
          <Link to="/signup" search={search} className="font-semibold text-primary hover:underline">
            Create an account
          </Link>{" "}
          ·{" "}
          <Link to="/" className="hover:text-foreground">
            Back to landing page
          </Link>
        </p>
      </main>
    </div>
  );
}

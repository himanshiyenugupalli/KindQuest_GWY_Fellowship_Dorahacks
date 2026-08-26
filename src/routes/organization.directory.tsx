import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, Phone, SearchX, Stethoscope } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/shared/StateBlocks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { professionals } from "@/data/volunteer";

export const Route = createFileRoute("/organization/directory")({
  head: () => ({
    meta: [
      { title: "Professional directory · KindQuest" },
      {
        name: "description",
        content: "Find nearby doctors, plumbers, electricians and other professionals willing to help.",
      },
      { property: "og:title", content: "Professional directory · KindQuest" },
      { property: "og:description", content: "Skilled help, close by, when a task needs it." },
    ],
  }),
  component: DirectoryPage,
});

function DirectoryPage() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const results = professionals.filter(
    (p) =>
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.profession.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q),
  );

  return (
    <AppShell role="organization" title="Professional directory" subtitle="Skilled help near you.">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search profession, name or city"
        aria-label="Search professionals"
        className="max-w-md"
      />

      <div className="mt-6">
        {results.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No professionals found"
            description="Try a broader search — a profession or a city name usually works best."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((p) => (
              <article key={p.id} className="card-surface rounded-2xl p-5">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent">
                  <Stethoscope className="h-5 w-5 text-accent-foreground" aria-hidden="true" />
                </span>
                <h2 className="mt-4 flex items-center gap-1.5 font-semibold">
                  <span className="truncate">{p.name}</span>
                  {p.verified ? (
                    <BadgeCheck className="h-4 w-4 shrink-0 text-primary" aria-label="Verified" />
                  ) : null}
                </h2>
                <p className="text-sm text-muted-foreground">{p.profession}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="secondary">{p.location}</Badge>
                  <Badge variant="outline">{p.availability}</Badge>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">Rating {p.rating.toFixed(1)} / 5</p>
                <Button asChild variant="outline" size="sm" className="mt-4 w-full">
                  <a href={`tel:${p.contact}`}>
                    <Phone className="mr-2 h-4 w-4" aria-hidden="true" />
                    Contact
                  </a>
                </Button>
              </article>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

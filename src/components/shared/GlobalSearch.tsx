import { useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { activeOpportunities, allCauses } from "@/data/opportunities";
import { organizations } from "@/data/organizations";
import { professionals } from "@/data/volunteer";

const recentSearches = ["reading mentor", "environment", "remote weekends"];

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return {
      opportunities: activeOpportunities
        .filter((o) => (o.title + o.cause + o.skills.join(" ")).toLowerCase().includes(q))
        .slice(0, 4),
      organizations: organizations.filter((o) => o.name.toLowerCase().includes(q)).slice(0, 3),
      causes: allCauses.filter((c) => c.toLowerCase().includes(q)).slice(0, 3),
      professionals: professionals
        .filter((p) => (p.name + p.profession).toLowerCase().includes(q))
        .slice(0, 2),
    };
  }, [query]);

  const empty =
    results &&
    !results.opportunities.length &&
    !results.organizations.length &&
    !results.causes.length &&
    !results.professionals.length;

  return (
    <div className="relative max-w-xl">
      <label htmlFor="global-search" className="sr-only">
        Search KindQuest
      </label>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        id="global-search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 150)}
        placeholder="Search opportunities, organizations, causes..."
        className="pl-9 pr-9"
      />
      {query ? (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
          aria-label="Clear search"
          onClick={() => setQuery("")}
        >
          <X className="h-4 w-4" />
        </Button>
      ) : null}

      {open ? (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[26rem] overflow-y-auto rounded-2xl border border-border bg-popover p-3 shadow-[var(--shadow-lift)]">
          {!results ? (
            <div>
              <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Recent searches
              </p>
              {recentSearches.map((r) => (
                <button
                  key={r}
                  type="button"
                  className="block w-full rounded-lg px-2 py-2 text-left text-sm hover:bg-muted"
                  onMouseDown={() => setQuery(r)}
                >
                  {r}
                </button>
              ))}
            </div>
          ) : empty ? (
            <p className="px-2 py-4 text-sm text-muted-foreground">
              No results for “{query}”. Try a cause like Education or Environment.
            </p>
          ) : (
            <div className="space-y-3">
              {results.opportunities.length ? (
                <section>
                  <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Opportunities
                  </p>
                  {results.opportunities.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      className="block w-full rounded-lg px-2 py-2 text-left text-sm hover:bg-muted"
                      onMouseDown={() => navigate({ to: "/opportunities/$id", params: { id: o.id } })}
                    >
                      <span className="font-medium">{o.title}</span>
                      <span className="block text-xs text-muted-foreground">
                        {o.cause} · {o.remote ? "Remote" : o.location}
                      </span>
                    </button>
                  ))}
                </section>
              ) : null}
              {results.causes.length ? (
                <section>
                  <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Causes
                  </p>
                  {results.causes.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className="block w-full rounded-lg px-2 py-2 text-left text-sm hover:bg-muted"
                      onMouseDown={() => navigate({ to: "/browse", search: { cause: c } })}
                    >
                      {c}
                    </button>
                  ))}
                </section>
              ) : null}
              {results.organizations.length ? (
                <section>
                  <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Organizations
                  </p>
                  {results.organizations.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      className="block w-full rounded-lg px-2 py-2 text-left text-sm hover:bg-muted"
                      onMouseDown={() => navigate({ to: "/browse", search: { cause: o.causes[0] ?? "" } })}
                    >
                      {o.name}
                      <span className="block text-xs text-muted-foreground">{o.location}</span>
                    </button>
                  ))}
                </section>
              ) : null}
              {results.professionals.length ? (
                <section>
                  <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Professionals (organization tool)
                  </p>
                  {results.professionals.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className="block w-full rounded-lg px-2 py-2 text-left text-sm hover:bg-muted"
                      onMouseDown={() => navigate({ to: "/organization/directory" })}
                    >
                      {p.name}
                      <span className="block text-xs text-muted-foreground">{p.profession}</span>
                    </button>
                  ))}
                </section>
              ) : null}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

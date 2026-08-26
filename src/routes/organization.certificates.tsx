import { createFileRoute } from "@tanstack/react-router";
import { Award, BadgeCheck, FileBadge } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { certificates, recommendations } from "@/data/volunteer";

export const Route = createFileRoute("/organization/certificates")({
  head: () => ({
    meta: [
      { title: "Certificates & recommendations · KindQuest" },
      {
        name: "description",
        content: "Issue certificates and write recommendations for volunteers who completed your work.",
      },
      { property: "og:title", content: "Certificates & recommendations · KindQuest" },
      { property: "og:description", content: "Recognition volunteers can actually use." },
    ],
  }),
  component: OrgCertificates,
});

function OrgCertificates() {
  return (
    <AppShell role="organization" title="Certificates" subtitle="Recognition you've issued.">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Organization certificates are issued at your discretion.
        </p>
        <Button onClick={() => toast.success("Certificate issued")}>
          <FileBadge className="mr-2 h-4 w-4" aria-hidden="true" />
          Issue certificate
        </Button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {certificates
          .filter((c) => c.type === "organization")
          .map((c) => (
            <article key={c.id} className="card-surface rounded-2xl p-5">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent">
                <Award className="h-5 w-5 text-accent-foreground" aria-hidden="true" />
              </span>
              <h2 className="mt-4 font-semibold">{c.title}</h2>
              <p className="text-sm text-muted-foreground">
                {c.recipient} · issued {c.issuedOn}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{c.achievement}</p>
              {c.verified ? (
                <Badge className="mt-3" variant="secondary">
                  <BadgeCheck className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                  Verified
                </Badge>
              ) : null}
            </article>
          ))}
      </div>

      <h2 className="mt-10 text-lg font-semibold">Recommendations written</h2>
      <ul className="mt-4 space-y-4">
        {recommendations.map((r) => (
          <li key={r.id} className="card-surface rounded-2xl p-5">
            <p className="font-semibold">{r.volunteerName}</p>
            <p className="text-sm text-muted-foreground">
              {r.opportunityTitle} · {r.date}
            </p>
            <p className="mt-3 text-sm text-muted-foreground">"{r.text}"</p>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}

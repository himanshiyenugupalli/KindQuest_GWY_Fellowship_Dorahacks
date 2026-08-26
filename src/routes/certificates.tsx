import { createFileRoute } from "@tanstack/react-router";
import { Award, BadgeCheck, Building2, Download } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { certificates } from "@/data/volunteer";

export const Route = createFileRoute("/certificates")({
  head: () => ({
    meta: [
      { title: "Certificates · KindQuest" },
      {
        name: "description",
        content: "Organization-issued and KindQuest milestone certificates for your volunteering.",
      },
      { property: "og:title", content: "Certificates · KindQuest" },
      { property: "og:description", content: "Verifiable recognition for work you have completed." },
    ],
  }),
  component: CertificatesPage,
});

function CertificatesPage() {
  return (
    <AppShell title="Certificates" subtitle="Recognition you can share.">
      <p className="max-w-2xl text-sm text-muted-foreground">
        Organizations certify work at their own discretion. KindQuest certificates are awarded
        automatically at Impact Point milestones. All volunteering earns points either way.
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {certificates.map((c) => (
          <article key={c.id} className="card-surface rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent">
                {c.type === "kindquest" ? (
                  <Award className="h-5 w-5 text-accent-foreground" aria-hidden="true" />
                ) : (
                  <Building2 className="h-5 w-5 text-accent-foreground" aria-hidden="true" />
                )}
              </span>
              <Badge variant={c.type === "kindquest" ? "default" : "secondary"}>
                {c.type === "kindquest" ? "KindQuest" : "Organization"}
              </Badge>
            </div>

            <h2 className="mt-4 text-lg font-semibold">{c.title}</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">{c.achievement}</p>
            <dl className="mt-4 space-y-1 text-sm text-muted-foreground">
              <div className="flex gap-2">
                <dt className="font-medium text-foreground">Issued by</dt>
                <dd>{c.issuer}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-medium text-foreground">Date</dt>
                <dd>{c.issuedOn}</dd>
              </div>
            </dl>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => toast.success("Certificate downloaded")}>
                <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                Download
              </Button>
              {c.verified ? (
                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <BadgeCheck className="h-4 w-4 text-primary" aria-hidden="true" />
                  Verified
                </span>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </AppShell>
  );
}

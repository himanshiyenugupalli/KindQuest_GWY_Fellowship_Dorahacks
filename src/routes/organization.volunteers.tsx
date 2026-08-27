import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, Check, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/AppShell";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { opportunityById } from "@/data/opportunities";
import { applications, demoVolunteer } from "@/data/volunteer";

export const Route = createFileRoute("/organization/volunteers")({
  head: () => ({
    meta: [
      { title: "Volunteers · KindQuest" },
      {
        name: "description",
        content:
          "Review volunteer requests with interests, skills and reliability before accepting.",
      },
      { property: "og:title", content: "Volunteers · KindQuest" },
      { property: "og:description", content: "Decide with context, not guesswork." },
    ],
  }),
  component: OrgVolunteers,
});

function OrgVolunteers() {
  const [decided, setDecided] = useState<Record<string, "accepted" | "declined">>({});

  return (
    <AppShell role="organization" title="Volunteers" subtitle="Requests and active volunteers.">
      <ul className="space-y-4">
        {applications.map((a) => {
          const opportunity = opportunityById(a.opportunityId);
          const decision = decided[a.id];
          return (
            <li key={a.id} className="card-surface rounded-2xl p-5">
              <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                <div className="flex min-w-0 items-start gap-3">
                  <Avatar className="h-11 w-11 shrink-0">
                    <AvatarFallback>{demoVolunteer.avatarInitials}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 font-semibold">
                      <span className="truncate">{demoVolunteer.name}</span>
                      <BadgeCheck
                        className="h-4 w-4 shrink-0 text-primary"
                        aria-label="Verified volunteer"
                      />
                    </p>
                    <p className="truncate text-sm text-muted-foreground">
                      {opportunity?.title} · applied {a.appliedOn}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {demoVolunteer.skills.slice(0, 3).map((s) => (
                        <Badge key={s} variant="secondary">
                          {s}
                        </Badge>
                      ))}
                      <Badge variant="outline">{a.status}</Badge>
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  {decision ? (
                    <Badge variant={decision === "accepted" ? "default" : "secondary"}>
                      {decision === "accepted" ? "Accepted" : "Declined"}
                    </Badge>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          setDecided((d) => ({ ...d, [a.id]: "accepted" }));
                          toast.success("Volunteer accepted");
                        }}
                      >
                        <Check className="mr-1 h-4 w-4" aria-hidden="true" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setDecided((d) => ({ ...d, [a.id]: "declined" }));
                          toast("Request declined");
                        }}
                      >
                        <X className="mr-1 h-4 w-4" aria-hidden="true" />
                        Decline
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 max-w-xs">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Reliability
                </p>
                <Progress
                  value={demoVolunteer.reliability.score}
                  className="mt-2"
                  aria-label="Volunteer reliability"
                />
                <p className="mt-1 text-sm text-muted-foreground">
                  {demoVolunteer.reliability.score} / 100 · {demoVolunteer.contributions}{" "}
                  contributions
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </AppShell>
  );
}

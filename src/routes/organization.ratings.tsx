import { createFileRoute } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { ratings } from "@/data/volunteer";

export const Route = createFileRoute("/organization/ratings")({
  head: () => ({
    meta: [
      { title: "Ratings · KindQuest" },
      {
        name: "description",
        content:
          "Rate effort, reliability and conduct on completed volunteering work, and leave feedback.",
      },
      { property: "og:title", content: "Ratings · KindQuest" },
      { property: "og:description", content: "Feedback on the work, never on the person." },
    ],
  }),
  component: OrgRatings,
});

function OrgRatings() {
  return (
    <AppShell role="organization" title="Ratings" subtitle="Rate completed work fairly.">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-xl text-sm text-muted-foreground">
          Ratings cover effort, reliability and conduct on a specific task. They are visible to the
          volunteer and feed their reliability score.
        </p>
        <RateDialog />
      </div>

      <ul className="mt-6 space-y-4">
        {ratings.map((r) => (
          <li key={r.id} className="card-surface rounded-2xl p-5">
            <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
              <div className="min-w-0">
                <p className="truncate font-semibold">{r.opportunityTitle}</p>
                <p className="text-sm text-muted-foreground">
                  {r.organizationName} · {r.date}
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold">
                <Star className="h-4 w-4 fill-current text-primary" aria-hidden="true" />
                {r.overall.toFixed(1)} / 5
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="secondary">Effort {r.effort}</Badge>
              <Badge variant="secondary">Reliability {r.reliability}</Badge>
              <Badge variant="secondary">Conduct {r.conduct}</Badge>
              {r.recommended ? <Badge>Recommended</Badge> : null}
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{r.feedback}</p>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}

function RateDialog() {
  const [open, setOpen] = useState(false);
  const [scores, setScores] = useState({ effort: 4, reliability: 4, conduct: 5 });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Star className="mr-2 h-4 w-4" aria-hidden="true" />
          Rate a volunteer
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rate completed work</DialogTitle>
          <DialogDescription>Score the task, then add a short note.</DialogDescription>
        </DialogHeader>
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            setOpen(false);
            toast.success("Rating submitted");
          }}
        >
          {(["effort", "reliability", "conduct"] as const).map((key) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={key} className="capitalize">
                {key} — {scores[key]} / 5
              </Label>
              <Slider
                id={key}
                min={1}
                max={5}
                step={1}
                value={[scores[key]]}
                onValueChange={(v) => setScores((s) => ({ ...s, [key]: v[0] ?? s[key] }))}
              />
            </div>
          ))}
          <div className="space-y-2">
            <Label htmlFor="feedback">Feedback</Label>
            <Textarea id="feedback" rows={3} placeholder="What went well?" />
          </div>
          <DialogFooter>
            <Button type="submit">Submit rating</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

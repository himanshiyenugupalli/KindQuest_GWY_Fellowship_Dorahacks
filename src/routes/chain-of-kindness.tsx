import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Link2, UserPlus } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { chains } from "@/data/volunteer";

export const Route = createFileRoute("/chain-of-kindness")({
  head: () => ({
    meta: [
      { title: "Chain of Kindness · KindQuest" },
      {
        name: "description",
        content: "Pass an act of impact forward by nominating someone else, and watch the chain grow.",
      },
      { property: "og:title", content: "Chain of Kindness · KindQuest" },
      { property: "og:description", content: "One good action can become many." },
    ],
  }),
  component: ChainPage,
});

function ChainPage() {
  const [open, setOpen] = useState(false);

  return (
    <AppShell title="Chain of Kindness" subtitle="One good action, passed forward.">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-xl text-sm text-muted-foreground">
          After completing an opportunity you can nominate someone to continue the effort. Each
          accepted nomination extends the chain.
        </p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" aria-hidden="true" />
              Nominate someone
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Pass it forward</DialogTitle>
              <DialogDescription>
                Send a nomination with a short note about the action you'd like continued.
              </DialogDescription>
            </DialogHeader>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setOpen(false);
                toast.success("Nomination sent");
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="nominee">Their name or email</Label>
                <Input id="nominee" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="note">Your note</Label>
                <Textarea id="note" rows={3} placeholder="I think you'd be great at…" />
              </div>
              <DialogFooter>
                <Button type="submit">Send nomination</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-8 space-y-6">
        {chains.map((chain) => (
          <article key={chain.id} className="card-surface rounded-2xl p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{chain.cause}</Badge>
              <Badge variant="outline">{chain.members.length} links</Badge>
            </div>
            <h2 className="mt-3 text-lg font-semibold">{chain.originalAction}</h2>
            <p className="text-sm text-muted-foreground">Started {chain.startedOn}</p>

            <ol className="mt-5 space-y-3">
              {chain.members.map((m, i) => (
                <li key={m.id} className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1 rounded-xl bg-muted/60 p-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">{m.name}</p>
                      <Badge variant="outline">{m.status}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{m.action}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{m.date}</p>
                  </div>
                </li>
              ))}
            </ol>

            <p className="mt-5 inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Link2 className="h-4 w-4 text-primary" aria-hidden="true" />
              This chain is still growing
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </p>
          </article>
        ))}
      </div>
    </AppShell>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { opportunities } from "@/data/opportunities";
import { organizations } from "@/data/organizations";

export const Route = createFileRoute("/organization/opportunities")({
  head: () => ({
    meta: [
      { title: "Manage opportunities · KindQuest" },
      { name: "description", content: "Create, edit and publish volunteering opportunities for your organization." },
      { property: "og:title", content: "Manage opportunities · KindQuest" },
      { property: "og:description", content: "Publish roles with skills, dates, capacity and Impact Points." },
    ],
  }),
  component: OrgOpportunities,
});

function OrgOpportunities() {
  const [open, setOpen] = useState(false);
  const org = organizations[0];
  const mine = opportunities.filter((o) => o.organizationId === org?.id);

  return (
    <AppShell role="organization" title="Opportunities" subtitle="Everything you've published.">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">{mine.length} opportunities</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
              Create opportunity
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create an opportunity</DialogTitle>
              <DialogDescription>Volunteers see this immediately once published.</DialogDescription>
            </DialogHeader>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setOpen(false);
                toast.success("Opportunity published");
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" required />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="points">Impact Points</Label>
                  <Input id="points" type="number" defaultValue={60} min={0} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="summary">Summary</Label>
                <Textarea id="summary" rows={3} required />
              </div>
              <DialogFooter>
                <Button type="submit">Publish</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="card-surface mt-6 overflow-x-auto rounded-2xl p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Cause</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Volunteers</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mine.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-medium">{o.title}</TableCell>
                <TableCell>{o.cause}</TableCell>
                <TableCell>{o.date}</TableCell>
                <TableCell>
                  {o.filled}/{o.capacity}
                </TableCell>
                <TableCell>+{o.impactPoints}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{o.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AppShell>
  );
}

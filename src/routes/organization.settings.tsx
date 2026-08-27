import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/AppShell";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { organizations } from "@/data/organizations";

export const Route = createFileRoute("/organization/settings")({
  head: () => ({
    meta: [
      { title: "Organization settings · KindQuest" },
      {
        name: "description",
        content:
          "Update your organization profile, causes, contact details and notification preferences.",
      },
      { property: "og:title", content: "Organization settings · KindQuest" },
      { property: "og:description", content: "Keep your public profile accurate." },
    ],
  }),
  component: OrgSettings,
});

function OrgSettings() {
  const org = organizations[0];

  return (
    <AppShell role="organization" title="Settings" subtitle="Your organization profile.">
      <div className="max-w-2xl space-y-6">
        <section className="card-surface rounded-2xl p-6">
          <h2 className="text-lg font-semibold">Organization profile</h2>
          <form
            className="mt-4 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Organization profile updated");
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="org-name">Name</Label>
              <Input id="org-name" defaultValue={org?.name ?? ""} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="org-location">Location</Label>
                <Input id="org-location" defaultValue={org?.location ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-website">Website</Label>
                <Input id="org-website" defaultValue={org?.website ?? ""} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="org-contact">Contact person</Label>
              <Input id="org-contact" defaultValue={org?.contactPerson ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="org-desc">Description</Label>
              <Textarea id="org-desc" rows={3} defaultValue={org?.description ?? ""} />
            </div>
            <Button type="submit">Save changes</Button>
          </form>
        </section>

        <section className="card-surface rounded-2xl p-6">
          <h2 className="text-lg font-semibold">Causes</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {org?.causes.map((c) => (
              <Badge key={c} variant="secondary">
                {c}
              </Badge>
            ))}
          </div>
        </section>

        <section className="card-surface rounded-2xl p-6">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <div className="mt-4 space-y-4">
            {[
              { id: "org-requests", label: "New volunteer requests", defaultOn: true },
              { id: "org-completions", label: "Completed work awaiting rating", defaultOn: true },
              { id: "org-digest", label: "Weekly summary email", defaultOn: false },
            ].map((row) => (
              <div key={row.id} className="flex items-center justify-between gap-4">
                <Label htmlFor={row.id} className="cursor-pointer">
                  {row.label}
                </Label>
                <Switch id={row.id} defaultChecked={row.defaultOn} />
              </div>
            ))}
          </div>
        </section>

        <section className="card-surface rounded-2xl p-6">
          <h2 className="text-lg font-semibold">Appearance</h2>
          <div className="mt-4 flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">Light, dark or match your system.</p>
            <ThemeToggle />
          </div>
        </section>
      </div>
    </AppShell>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { allCauses } from "@/data/opportunities";
import { demoVolunteer } from "@/data/volunteer";
import { useTheme } from "@/lib/theme";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings · KindQuest" },
      {
        name: "description",
        content: "Update your profile, causes, availability and notification preferences.",
      },
      { property: "og:title", content: "Settings · KindQuest" },
      { property: "og:description", content: "Control what KindQuest matches you with." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, setTheme } = useTheme();
  return (
    <AppShell title="Settings" subtitle="Tune what KindQuest shows you.">
      <div className="max-w-2xl space-y-6">
        <section className="card-surface rounded-2xl p-6">
          <h2 className="text-lg font-semibold">Profile</h2>
          <form
            className="mt-4 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Profile updated");
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue={demoVolunteer.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" defaultValue={demoVolunteer.location} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Short bio</Label>
              <Textarea id="bio" rows={3} defaultValue={demoVolunteer.bio} />
            </div>
            <Button type="submit">Save changes</Button>
          </form>
        </section>

        <section className="card-surface rounded-2xl p-6">
          <h2 className="text-lg font-semibold">Causes you care about</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {allCauses.map((c) => (
              <Badge key={c} variant={demoVolunteer.causes.includes(c) ? "default" : "outline"}>
                {c}
              </Badge>
            ))}
          </div>
          <Separator className="my-5" />
          <h3 className="font-semibold">Availability</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {demoVolunteer.availability.map((a) => (
              <Badge key={a} variant="secondary">
                {a}
              </Badge>
            ))}
          </div>
        </section>

        <section className="card-surface rounded-2xl p-6">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <div className="mt-4 space-y-4">
            {[
              { id: "matches", label: "New matches for me", defaultOn: true },
              { id: "status", label: "Request status changes", defaultOn: true },
              { id: "impact", label: "Impact Points and ratings", defaultOn: true },
              { id: "chain", label: "Chain of Kindness activity", defaultOn: false },
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
          <p className="mt-1 text-sm text-muted-foreground">Light, dark or match your system.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(["light", "dark", "system"] as const).map((opt) => (
              <Button
                key={opt}
                type="button"
                variant={theme === opt ? "default" : "outline"}
                onClick={() => setTheme(opt)}
                aria-pressed={theme === opt}
                className="capitalize"
              >
                {opt === "light" ? "☀ Light" : opt === "dark" ? "🌙 Dark" : "🖥 System"}
              </Button>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

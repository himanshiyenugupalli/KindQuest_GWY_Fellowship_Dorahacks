import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings · KindQuest" },
      {
        name: "description",
        content: "Update your profile, causes, availability and notification preferences.",
      },
      { property: "og:title", content: "Settings · KindQuest" },
      { property: "og:description", content: "Control what KindQuest shows you." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user, profile, volunteerProfile, refreshProfile } = useAuth();
  const { theme, setTheme } = useTheme();

  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [location, setLocation] = useState(profile?.location || "");
  const [bio, setBio] = useState(volunteerProfile?.bio || "");
  const [saving, setSaving] = useState(false);

  const selectedCauses = volunteerProfile?.causes || [];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const { error: pErr } = await supabase
        .from("profiles")
        .update({ full_name: fullName, location })
        .eq("id", user.id);
      if (pErr) throw pErr;

      if (profile?.role === "volunteer") {
        const { error: vErr } = await supabase
          .from("volunteer_profiles")
          .update({ bio })
          .eq("id", user.id);
        if (vErr) throw vErr;
      }

      await refreshProfile();
      toast.success("Profile saved successfully");
    } catch (err: any) {
      console.error("Error saving settings:", err);
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell title="Settings" subtitle="Tune what KindQuest shows you.">
      <div className="max-w-2xl space-y-6">
        <section className="card-surface rounded-2xl p-6">
          <h2 className="text-lg font-semibold">Profile</h2>
          <form className="mt-4 space-y-4" onSubmit={handleSave}>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            {profile?.role === "volunteer" ? (
              <div className="space-y-2">
                <Label htmlFor="bio">Short bio</Label>
                <Textarea id="bio" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
              </div>
            ) : null}
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </form>
        </section>

        {profile?.role === "volunteer" ? (
          <section className="card-surface rounded-2xl p-6">
            <h2 className="text-lg font-semibold">Causes you care about</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {allCauses.map((c) => (
                <Badge key={c} variant={selectedCauses.includes(c) ? "default" : "outline"}>
                  {c}
                </Badge>
              ))}
            </div>
          </section>
        ) : null}

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

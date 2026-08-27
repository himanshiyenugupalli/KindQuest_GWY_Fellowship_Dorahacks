import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

import { KindQuestLogo } from "@/components/KindQuestLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/signup")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { role?: "volunteer" | "organization" | undefined; redirect?: string } => ({
    role: search["role"] === "organization" ? "organization" : undefined,
    ...(typeof search["redirect"] === "string" ? { redirect: search["redirect"] } : {}),
  }),

  head: () => ({
    meta: [
      { title: "Create your account · KindQuest" },
      {
        name: "description",
        content: "Join KindQuest as a volunteer or register your organization in a couple of minutes.",
      },
      { property: "og:title", content: "Create your account · KindQuest" },
      {
        property: "og:description",
        content: "Join KindQuest as a volunteer or register your organization in a couple of minutes.",
      },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const { role: initialRole, redirect: targetRedirect } = Route.useSearch();
  const [role, setRole] = useState<string>(initialRole ?? "volunteer");

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-surface p-10 lg:flex">
        <Link to="/" aria-label="KindQuest home">
          <KindQuestLogo size="md" framed />
        </Link>
        <div>
          <h2 className="max-w-sm text-3xl font-bold leading-tight">
            Start with what you care about.
          </h2>
          <p className="mt-3 max-w-sm text-muted-foreground">
            You can skip onboarding entirely and browse opportunities right away.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">Demo experience — nothing is stored.</p>
      </div>

      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden">
            <Link to="/" aria-label="KindQuest home">
              <KindQuestLogo size="sm" framed />
            </Link>
          </div>
          <h1 className="mt-6 text-2xl font-bold">Create your account</h1>

          <Tabs value={role} onValueChange={setRole} className="mt-6">
            <TabsList className="w-full">
              <TabsTrigger value="volunteer" className="flex-1">
                Volunteer
              </TabsTrigger>
              <TabsTrigger value="organization" className="flex-1">
                Organization
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <form
            className="mt-6 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const nameInput = (form.querySelector("#name") as HTMLInputElement)?.value;
              const emailInput = (form.querySelector("#email") as HTMLInputElement)?.value;
              const locationInput = (form.querySelector("#location") as HTMLInputElement)?.value;
              const passwordInput = (form.querySelector("#password") as HTMLInputElement)?.value || "kindquest123";
              const aboutInput = (form.querySelector("#about") as HTMLTextAreaElement)?.value || "";

              try {
                const { data, error } = await supabase.auth.signUp({
                  email: emailInput,
                  password: passwordInput,
                  options: {
                    data: {
                      full_name: nameInput,
                      role: role,
                    },
                  },
                });

                if (error) {
                  toast.error(error.message);
                  return;
                }

                const user = data.user;
                if (user) {
                  // Upsert profile
                  await supabase.from("profiles").upsert({
                    id: user.id,
                    role: role as "volunteer" | "organization",
                    full_name: nameInput,
                    email: emailInput,
                    location: locationInput,
                  });

                  if (role === "volunteer") {
                    const volId = "KQ-" + Math.floor(10000 + Math.random() * 90000);
                    await supabase.from("volunteer_profiles").upsert({
                      id: user.id,
                      volunteer_id: volId,
                      bio: "New volunteer ready to make an impact!",
                    });
                  } else {
                    const orgId = "org-" + Math.floor(1000 + Math.random() * 9000);
                    await supabase.from("organization_profiles").upsert({
                      id: user.id,
                      org_id: orgId,
                      name: nameInput,
                      description: aboutInput,
                      location: locationInput,
                    });
                  }
                }

                toast.success("Account created successfully!");

                const destination = targetRedirect
                  ? targetRedirect
                  : role === "organization"
                    ? "/organization"
                    : "/onboarding";

                navigate({ to: destination });
              } catch (err: any) {
                toast.error(err?.message || "Failed to create account");
              }
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="name">{role === "organization" ? "Organization name" : "Full name"}</Label>
              <Input id="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="City, Country" required />
            </div>
            {role === "organization" ? (
              <div className="space-y-2">
                <Label htmlFor="about">What does your organization do?</Label>
                <Textarea id="about" rows={3} />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>
            )}
            <Button type="submit" className="w-full" size="lg">
              {role === "organization" ? "Register organization" : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              search={targetRedirect ? { redirect: targetRedirect } : {}}
              className="font-semibold text-primary hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

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
        content:
          "Join KindQuest as a volunteer or register your organization in a couple of minutes.",
      },
      { property: "og:title", content: "Create your account · KindQuest" },
      {
        property: "og:description",
        content:
          "Join KindQuest as a volunteer or register your organization in a couple of minutes.",
      },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const { role: initialRole, redirect: targetRedirect } = Route.useSearch();
  const [role, setRole] = useState<string>(initialRole ?? "volunteer");
  const [submitting, setSubmitting] = useState(false);
  const [signedUpEmail, setSignedUpEmail] = useState<string | null>(null);

  const handleResendConfirmation = async () => {
    if (!signedUpEmail) return;
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: signedUpEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Verification email resent!");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to resend email");
    }
  };

  if (signedUpEmail) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-12 text-center">
        <div className="w-full max-w-md space-y-6 card-surface p-8 rounded-3xl">
          <Link to="/" aria-label="KindQuest home" className="inline-block">
            <KindQuestLogo size="md" framed />
          </Link>
          <h1 className="text-2xl font-bold">Check your inbox</h1>
          <p className="text-sm text-muted-foreground">
            We've sent a verification link to{" "}
            <span className="font-semibold text-foreground">{signedUpEmail}</span>. Please click the
            link to verify your email before logging in.
          </p>
          <div className="space-y-3 pt-4">
            <Button variant="outline" className="w-full" onClick={handleResendConfirmation}>
              Resend verification email
            </Button>
            <Button asChild className="w-full">
              <Link to="/login" search={targetRedirect ? { redirect: targetRedirect } : {}}>
                Back to Sign In
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
            Connect with opportunities that fit your skills, location, and availability.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          Empowering communities worldwide through kindness.
        </p>
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
              const passwordInput = (form.querySelector("#password") as HTMLInputElement)?.value;
              const aboutInput = (form.querySelector("#about") as HTMLTextAreaElement)?.value || "";

              if (!passwordInput || passwordInput.length < 6) {
                toast.error("Password must be at least 6 characters long.");
                return;
              }

              setSubmitting(true);

              try {
                const { data, error } = await supabase.auth.signUp({
                  email: emailInput,
                  password: passwordInput,
                  options: {
                    emailRedirectTo: `${window.location.origin}/login`,
                    data: {
                      full_name: nameInput,
                      role: role,
                    },
                  },
                });

                if (error) {
                  toast.error(error.message);
                  setSubmitting(false);
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

                setSignedUpEmail(emailInput);
                toast.success("Account created! Please check your email to verify.");
              } catch (err: any) {
                toast.error(err?.message || "Failed to create account");
                setSubmitting(false);
              }
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="name">
                {role === "organization" ? "Organization name" : "Full name"}
              </Label>
              <Input
                id="name"
                required
                placeholder={role === "organization" ? "GreenRoots Collective" : "Jane Doe"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="name@example.com"
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="City, Country" required />
            </div>
            {role === "organization" ? (
              <div className="space-y-2">
                <Label htmlFor="about">What does your organization do?</Label>
                <Textarea id="about" rows={3} placeholder="Brief description of your mission..." />
              </div>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                placeholder="At least 6 characters"
                autoComplete="new-password"
              />
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={submitting}>
              {submitting
                ? "Creating account..."
                : role === "organization"
                  ? "Register organization"
                  : "Create account"}
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

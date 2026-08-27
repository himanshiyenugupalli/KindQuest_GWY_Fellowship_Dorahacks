import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

import { KindQuestLogo } from "@/components/KindQuestLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RoleLoginForm({ role }: { role: "volunteer" | "organization" }) {
  const navigate = useNavigate();
  const search: { redirect?: string } = useSearch({ strict: false });
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const isOrg = role === "organization";

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email address first");
      return;
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Password reset link sent to your email!");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to send reset link");
    }
  };

  return (
    <div className="grid min-h-dvh bg-background lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-surface p-10 lg:flex">
        <Link to="/" aria-label="KindQuest home">
          <KindQuestLogo size="md" framed />
        </Link>
        <div>
          <h2 className="max-w-sm text-3xl font-bold leading-tight">
            {isOrg
              ? "Your community is waiting for the next opportunity."
              : "Welcome back. Your impact is still here."}
          </h2>
          <p className="mt-3 max-w-sm text-muted-foreground">
            {isOrg
              ? "Manage opportunities, volunteers, ratings and certificates in one workspace."
              : "Your Volunteer ID, Impact Points, badges and certificates stay with you."}
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          Empowering communities worldwide through kindness.
        </p>
      </div>

      <div className="flex flex-col px-4 py-8 sm:px-8">
        <div className="flex items-center justify-between">
          <Button asChild variant="ghost" size="sm">
            <Link to="/login" search={search}>
              <ArrowLeft className="mr-1 h-4 w-4" aria-hidden="true" />
              Back
            </Link>
          </Button>
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm py-8">
            <div className="lg:hidden">
              <Link to="/" aria-label="KindQuest home">
                <KindQuestLogo size="sm" framed />
              </Link>
            </div>
            <h1 className="mt-6 text-2xl font-bold">
              {isOrg ? "Welcome back, organization." : "Welcome back, volunteer."}
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {isOrg
                ? "Continue creating opportunities and making an impact."
                : "Your next opportunity is waiting."}
            </p>

            <form
              className="mt-6 space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                setSubmitting(true);

                try {
                  const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                  });

                  if (error) {
                    toast.error(error.message);
                    setSubmitting(false);
                    return;
                  }

                  toast.success(isOrg ? "Logged in as organization" : "Logged in as volunteer");

                  const target = search.redirect
                    ? search.redirect
                    : isOrg
                      ? "/organization"
                      : "/discover";
                  navigate({ to: target });
                } catch (err: any) {
                  toast.error(err?.message || "Failed to log in");
                  setSubmitting(false);
                }
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={show ? "text" : "password"}
                    required
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    aria-label={show ? "Hide password" : "Show password"}
                    className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted-foreground hover:text-foreground"
                  >
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                {submitting ? "Signing in..." : "Log in"}
              </Button>
            </form>

            <div className="mt-6 rounded-2xl border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Quick Test Access (Prototype)
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Fill quick credentials or sign in instantly to test the platform.
              </p>
              <div className="mt-3 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => {
                    setEmail("volunteer@kindquest.org");
                    setPassword("kindquest123");
                    toast.info(
                      "Test volunteer credentials loaded. Click 'Log in' or create this account on Signup!",
                    );
                  }}
                >
                  Load Volunteer
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => {
                    setEmail("org@kindquest.org");
                    setPassword("kindquest123");
                    toast.info(
                      "Test organization credentials loaded. Click 'Log in' or create this account on Signup!",
                    );
                  }}
                >
                  Load Org
                </Button>
              </div>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              New to KindQuest?{" "}
              <Link
                to="/signup"
                search={
                  search.redirect
                    ? { redirect: search.redirect, ...(isOrg ? { role: "organization" } : {}) }
                    : isOrg
                      ? { role: "organization" }
                      : {}
                }
                className="font-semibold text-primary hover:underline"
              >
                {isOrg ? "Register your organization" : "Sign up as a volunteer"}
              </Link>
            </p>
            <p className="mt-4 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-foreground">
                ← Back to landing page
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

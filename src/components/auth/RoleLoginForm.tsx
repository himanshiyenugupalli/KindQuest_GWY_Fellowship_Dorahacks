import { Link, useNavigate } from "@tanstack/react-router";
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
  const [show, setShow] = useState(false);
  const isOrg = role === "organization";

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
        <p className="text-sm text-muted-foreground">Demo experience — no real account needed.</p>
      </div>

      <div className="flex flex-col px-4 py-8 sm:px-8">
        <div className="flex items-center justify-between">
          <Button asChild variant="ghost" size="sm">
            <Link to="/login">
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
                const form = e.currentTarget;
                const emailInput = (form.querySelector("#email") as HTMLInputElement)?.value;
                const passwordInput = (form.querySelector("#password") as HTMLInputElement)?.value;

                try {
                  const { data, error } = await supabase.auth.signInWithPassword({
                    email: emailInput,
                    password: passwordInput,
                  });

                  if (error) {
                    toast.error(error.message);
                    return;
                  }

                  toast.success(
                    isOrg ? "Logged in as organization" : "Logged in as volunteer",
                  );
                  navigate({ to: isOrg ? "/organization" : "/discover" });
                } catch (err: any) {
                  toast.error(err?.message || "Failed to log in");
                }
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  defaultValue={isOrg ? "team@greenroots.org" : "himanshi@example.com"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={show ? "text" : "password"}
                    required
                    defaultValue="kindquest"
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
              <div className="flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Checkbox id="remember" defaultChecked />
                  Remember me
                </label>
                <button
                  type="button"
                  onClick={() => toast.info("Password reset link sent (demo)")}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <Button type="submit" className="w-full" size="lg">
                Log in
              </Button>
            </form>

            <p className="mt-6 text-sm text-muted-foreground">
              New to KindQuest?{" "}
              <Link
                to="/signup"
                search={isOrg ? { role: "organization" } : {}}
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

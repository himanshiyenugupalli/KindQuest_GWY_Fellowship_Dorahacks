import { Link } from "@tanstack/react-router";
import { Building2, ChevronDown, Heart, Menu } from "lucide-react";
import { useState } from "react";

import { KindQuestLogo } from "@/components/KindQuestLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

/** Role-aware login entry points, shared by the header popover and mobile menu. */
export function LoginChoices({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="space-y-2">
      <div className="rounded-2xl border border-border bg-card p-3">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary-soft">
            <Heart className="h-4 w-4 text-accent-foreground" aria-hidden="true" />
          </span>
          <p className="text-sm font-semibold">I&apos;m a Volunteer</p>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Access your Volunteer ID, opportunities and impact journey.
        </p>
        <Button asChild className="mt-3 w-full" size="sm">
          <Link to="/login/volunteer" onClick={onNavigate}>
            Log in as Volunteer
          </Link>
        </Button>
      </div>
      <div className="rounded-2xl border border-border bg-card p-3">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-sky/40">
            <Building2 className="h-4 w-4 text-sky-foreground" aria-hidden="true" />
          </span>
          <p className="text-sm font-semibold">I&apos;m an Organization</p>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Manage opportunities, volunteers, ratings and certificates.
        </p>
        <Button asChild variant="outline" className="mt-3 w-full" size="sm">
          <Link to="/login/organization" onClick={onNavigate}>
            Log in as Organization
          </Link>
        </Button>
      </div>
    </div>
  );
}


export const TAGLINE = "Find your cause. Find your opportunity. Make an impact.";

const publicNav = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Explore Opportunities", href: "#opportunities" },
  { label: "For Organizations", href: "#for-organizations" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="min-w-0" aria-label="KindQuest home">
          <KindQuestLogo size="sm" framed className="sm:h-12" />
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <nav className="mr-2 hidden items-center gap-1 lg:flex" aria-label="Site">
            {publicNav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <ThemeToggle />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="hidden sm:inline-flex">
                Log In
                <ChevronDown className="ml-1 h-4 w-4" aria-hidden="true" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-3">
              <LoginChoices />
            </PopoverContent>
          </Popover>
          <Button asChild className="hidden sm:inline-flex">
            <Link to="/signup">Get started</Link>
          </Button>


          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="sm:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-5">
              <SheetHeader className="p-0 text-left">
                <SheetTitle>KindQuest</SheetTitle>
              </SheetHeader>
              <nav className="mt-4 space-y-1">
                {publicNav.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-3 text-sm font-medium hover:bg-muted"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              <div className="mt-6 space-y-3">
                <Button asChild className="w-full">
                  <Link to="/signup" onClick={() => setOpen(false)}>
                    Get started
                  </Link>
                </Button>
                <p className="pt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Log in
                </p>
                <LoginChoices onNavigate={() => setOpen(false)} />
                <div className="flex items-center justify-between rounded-xl border border-border px-3 py-2">
                  <span className="text-sm text-muted-foreground">Theme</span>
                  <ThemeToggle />
                </div>
              </div>

            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <KindQuestLogo size="md" framed />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">{TAGLINE}</p>
        </div>
        <nav aria-label="Explore">
          <h2 className="text-sm font-semibold">Explore</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <a className="hover:text-foreground" href="#how-it-works">
                How It Works
              </a>
            </li>
            <li>
              <Link className="hover:text-foreground" to="/browse">
                Opportunities
              </Link>
            </li>
            <li>
              <Link className="hover:text-foreground" to="/organization">
                Organizations
              </Link>
            </li>
            <li>
              <a className="hover:text-foreground" href="#about">
                About
              </a>
            </li>
          </ul>
        </nav>
        <nav aria-label="More">
          <h2 className="text-sm font-semibold">More</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link className="hover:text-foreground" to="/help">
                Contact
              </Link>
            </li>
            <li>
              <Link className="hover:text-foreground" to="/help">
                Privacy
              </Link>
            </li>
            <li>
              <Link className="hover:text-foreground" to="/help">
                Terms
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-border px-4 py-5 text-center text-xs text-muted-foreground sm:px-6">
        KindQuest — a prototype built for demonstration. All data shown is sample data.
      </div>
    </footer>
  );
}

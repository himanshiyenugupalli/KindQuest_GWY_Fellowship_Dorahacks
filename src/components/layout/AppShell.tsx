import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  ChevronRight,
  HelpCircle,
  LogOut,
  Menu,
  MoreHorizontal,
  Search,
  UserRound,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@/lib/auth";

import { KindQuestLogo } from "@/components/KindQuestLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  mobileVolunteerNav,
  organizationNav,
  volunteerPrimaryNav,
  volunteerSecondaryNav,
  type NavItem,
} from "@/components/layout/nav-config";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { demoVolunteer, notifications } from "@/data/volunteer";
import { cn } from "@/lib/utils";
import { GlobalSearch } from "@/components/shared/GlobalSearch";

function NavLinks({ items, onNavigate }: { items: NavItem[]; onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <ul className="space-y-1">
      {items.map((item) => {
        const active = pathname === item.to || (item.to !== "/organization" && pathname.startsWith(item.to));
        return (
          <li key={item.to}>
            <Link
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function AppShell({
  children,
  role = "volunteer",
  title,
  subtitle,
}: {
  children: ReactNode;
  role?: "volunteer" | "organization";
  title?: string | undefined;
  subtitle?: string | undefined;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!loading && !user) {
      navigate({
        to: role === "organization" ? "/login/organization" : "/login/volunteer",
        search: { redirect: pathname },
      });
    }
  }, [user, loading, role, navigate, pathname]);

  const primary = role === "volunteer" ? volunteerPrimaryNav : organizationNav;
  const secondary = role === "volunteer" ? volunteerSecondaryNav : [];
  const unread = notifications.filter((n) => !n.read).length;

  if (loading || !user) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="text-center">
          <KindQuestLogo size="md" framed className="mx-auto mb-4 animate-pulse" />
          <p className="text-sm text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto flex w-full max-w-[110rem]">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar px-4 py-5 lg:flex">
          <Link to="/" className="mb-6 block shrink-0" aria-label="KindQuest home">
            <KindQuestLogo size="md" framed />
          </Link>
          <nav className="flex-1 overflow-y-auto" aria-label="Main">
            <NavLinks items={primary} />
            {secondary.length ? (
              <>
                <p className="mt-6 mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Your journey
                </p>
                <NavLinks items={secondary} />
              </>
            ) : null}
          </nav>
          <div className="mt-4 rounded-2xl bg-accent/60 p-4">
            <p className="text-xs font-semibold text-accent-foreground">
              {role === "volunteer" ? "Viewing as volunteer" : "Viewing as organization"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Demo role switching for the prototype.</p>
            <Button asChild variant="outline" size="sm" className="mt-3 w-full">
              <Link to={role === "volunteer" ? "/organization" : "/discover"}>
                Switch to {role === "volunteer" ? "organization" : "volunteer"}
                <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
            <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6">
              <div className="flex items-center gap-2 lg:hidden">
                <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Open menu">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[17rem] overflow-y-auto p-5">
                    <SheetHeader className="p-0">
                      <SheetTitle className="sr-only">Navigation</SheetTitle>
                    </SheetHeader>
                    <KindQuestLogo size="md" framed className="mb-6" />
                    <NavLinks items={primary} onNavigate={() => setMenuOpen(false)} />
                    {secondary.length ? (
                      <>
                        <p className="mt-6 mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Your journey
                        </p>
                        <NavLinks items={secondary} onNavigate={() => setMenuOpen(false)} />
                      </>
                    ) : null}
                    <Button asChild variant="outline" size="sm" className="mt-6 w-full">
                      <Link
                        to={role === "volunteer" ? "/organization" : "/discover"}
                        onClick={() => setMenuOpen(false)}
                      >
                        Switch to {role === "volunteer" ? "organization" : "volunteer"}
                      </Link>
                    </Button>
                  </SheetContent>
                </Sheet>
                <Link to="/" aria-label="KindQuest home">
                  <KindQuestLogo size="xs" framed />
                </Link>
              </div>

              <div className="hidden min-w-0 lg:block">
                <GlobalSearch />
              </div>
              <div className="lg:hidden" />

              <div className="flex items-center gap-1">
                <Button asChild variant="ghost" size="icon" className="lg:hidden" aria-label="Search">
                  <Link to="/browse">
                    <Search className="h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="icon" className="relative" aria-label="Notifications">
                  <Link to="/notifications">
                    <Bell className="h-5 w-5" />
                    {unread > 0 ? (
                      <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-coral px-1 text-[10px] font-bold text-coral-foreground">
                        {unread}
                      </span>
                    ) : null}
                  </Link>
                </Button>
                <ThemeToggle />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Account menu">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary-soft text-xs font-semibold text-accent-foreground">
                          {role === "volunteer" ? demoVolunteer.avatarInitials : "GR"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      {role === "volunteer" ? demoVolunteer.name : "GreenRoots Collective"}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {(role === "volunteer" ? volunteerSecondaryNav : organizationNav).map((i) => (
                      <DropdownMenuItem key={i.to} asChild>
                        <Link to={i.to}>
                          <i.icon className="mr-2 h-4 w-4" aria-hidden="true" />
                          {i.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/help">
                        <HelpCircle className="mr-2 h-4 w-4" aria-hidden="true" />
                        Help
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/login">
                        <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                        Log out
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          <main className="min-w-0 flex-1 px-4 pb-28 pt-6 sm:px-6 lg:pb-12">
            {title ? (
              <div className="mb-6">
                <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
                {subtitle ? <p className="mt-1 text-muted-foreground">{subtitle}</p> : null}
              </div>
            ) : null}
            {children}
          </main>
        </div>
      </div>

      {role === "volunteer" ? <MobileBottomNav /> : null}
    </div>
  );
}

function MobileBottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur lg:hidden"
      aria-label="Primary mobile"
    >
      <ul className="grid grid-cols-5">
        {mobileVolunteerNav.map((item) => {
          const active = pathname.startsWith(item.to);
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className={cn(
                  "flex min-h-[3.5rem] flex-col items-center justify-center gap-1 px-1 py-2 text-[11px] font-medium",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <item.icon className="h-5 w-5" aria-hidden="true" />
                {item.label}
              </Link>
            </li>
          );
        })}
        <li>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="flex min-h-[3.5rem] w-full flex-col items-center justify-center gap-1 px-1 py-2 text-[11px] font-medium text-muted-foreground"
              >
                <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
                More
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-3xl p-5">
              <SheetHeader className="p-0 text-left">
                <SheetTitle>More</SheetTitle>
              </SheetHeader>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {[...volunteerSecondaryNav, { label: "Chain of Kindness", to: "/chain-of-kindness", icon: UserRound }].map(
                  (i) => (
                    <Link
                      key={i.to}
                      to={i.to}
                      onClick={() => setOpen(false)}
                      className="card-surface flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-medium"
                    >
                      <i.icon className="h-4 w-4 text-primary" aria-hidden="true" />
                      <span className="truncate">{i.label}</span>
                    </Link>
                  ),
                )}
              </div>
              <Button asChild variant="outline" className="mt-4 w-full">
                <Link to="/organization" onClick={() => setOpen(false)}>
                  Switch to organization view
                </Link>
              </Button>
            </SheetContent>
          </Sheet>
        </li>
      </ul>
    </nav>
  );
}

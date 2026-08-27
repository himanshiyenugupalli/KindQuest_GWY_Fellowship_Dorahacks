import { createFileRoute } from "@tanstack/react-router";
import { Award, BellOff, Link2, Sparkles, Star, TrendingUp } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/shared/StateBlocks";
import { Button } from "@/components/ui/button";
import { notifications as seed } from "@/data/volunteer";
import { cn } from "@/lib/utils";
import type { Notification } from "@/types";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications · KindQuest" },
      {
        name: "description",
        content: "Updates on your requests, impact, certificates and kindness chains.",
      },
      { property: "og:title", content: "Notifications · KindQuest" },
      { property: "og:description", content: "Everything that changed since your last visit." },
    ],
  }),
  component: NotificationsPage,
});

const icons = {
  application: Sparkles,
  impact: TrendingUp,
  certificate: Award,
  chain: Link2,
  recommendation: Star,
} as const;

function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>(seed);
  const unread = items.filter((n) => !n.read).length;

  return (
    <AppShell title="Notifications" subtitle={unread ? `${unread} unread` : "You're all caught up"}>
      {items.length === 0 ? (
        <EmptyState
          icon={BellOff}
          title="Nothing new"
          description="We'll let you know when something happens."
        />
      ) : (
        <>
          {unread ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setItems((list) => list.map((n) => ({ ...n, read: true })))}
            >
              Mark all as read
            </Button>
          ) : null}

          <ul className="mt-5 space-y-3">
            {items.map((n) => {
              const Icon = icons[n.kind];
              return (
                <li
                  key={n.id}
                  className={cn(
                    "card-surface flex gap-4 rounded-2xl p-5",
                    !n.read && "border-primary/40 bg-primary-soft/40",
                  )}
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent">
                    <Icon className="h-5 w-5 text-accent-foreground" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold">{n.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{n.date}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </AppShell>
  );
}

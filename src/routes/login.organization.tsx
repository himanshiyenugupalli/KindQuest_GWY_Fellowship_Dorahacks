import { createFileRoute } from "@tanstack/react-router";

import { RoleLoginForm } from "@/components/auth/RoleLoginForm";

export const Route = createFileRoute("/login/organization")({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => ({
    ...(typeof search["redirect"] === "string" ? { redirect: search["redirect"] } : {}),
  }),
  head: () => ({
    meta: [
      { title: "Organization login · KindQuest" },
      {
        name: "description",
        content: "Manage opportunities, volunteers, ratings and certificates on KindQuest.",
      },
      { property: "og:title", content: "Organization login · KindQuest" },
      {
        property: "og:description",
        content: "Manage opportunities, volunteers, ratings and certificates on KindQuest.",
      },
    ],
  }),
  component: () => <RoleLoginForm role="organization" />,
});

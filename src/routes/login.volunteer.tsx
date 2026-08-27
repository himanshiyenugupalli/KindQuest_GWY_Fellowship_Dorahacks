import { createFileRoute } from "@tanstack/react-router";

import { RoleLoginForm } from "@/components/auth/RoleLoginForm";

export const Route = createFileRoute("/login/volunteer")({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => ({
    ...(typeof search["redirect"] === "string" ? { redirect: search["redirect"] } : {}),
  }),
  head: () => ({
    meta: [
      { title: "Volunteer login · KindQuest" },
      {
        name: "description",
        content: "Access your Volunteer ID, opportunities and impact journey on KindQuest.",
      },
      { property: "og:title", content: "Volunteer login · KindQuest" },
      {
        property: "og:description",
        content: "Access your Volunteer ID, opportunities and impact journey on KindQuest.",
      },
    ],
  }),
  component: () => <RoleLoginForm role="volunteer" />,
});

import { createFileRoute, Link } from "@tanstack/react-router";
import { LifeBuoy, Mail } from "lucide-react";

import { SiteFooter, SiteHeader } from "@/components/landing/SiteChrome";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help & FAQ · KindQuest" },
      {
        name: "description",
        content:
          "Answers about matching, Impact Points, ratings, certificates and privacy on KindQuest.",
      },
      { property: "og:title", content: "Help & FAQ · KindQuest" },
      { property: "og:description", content: "How KindQuest works, in plain language." },
    ],
  }),
  component: HelpPage,
});

const faqs = [
  {
    q: "Do I have to complete onboarding?",
    a: "No. Onboarding is always optional — you can skip it and browse every open opportunity right away.",
  },
  {
    q: "How does matching work?",
    a: "KindQuest compares your interests, skills, location and availability against each opportunity, then shows a plain-language reason for every recommendation.",
  },
  {
    q: "What are Impact Points?",
    a: "Points are awarded when an organization verifies that you completed an opportunity. They accumulate into ranks and milestone certificates.",
  },
  {
    q: "Who can rate me, and what does reliability mean?",
    a: "Only organizations you volunteered with can rate completed work. Reliability reflects effort, dependability and conduct on those tasks — never a judgement of your character.",
  },
  {
    q: "What's the difference between the two certificate types?",
    a: "Organization certificates are issued at the organization's discretion. KindQuest certificates are awarded automatically when you reach point or level milestones.",
  },
  {
    q: "Can I volunteer remotely?",
    a: "Yes. Many opportunities are fully remote, and you can filter for them when browsing.",
  },
  {
    q: "What is the Chain of Kindness?",
    a: "After completing an opportunity you can nominate someone else to continue the effort. Each accepted nomination extends the chain.",
  },
];

function HelpPage() {
  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <LifeBuoy className="h-7 w-7 text-primary" aria-hidden="true" />
        <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Help & FAQ</h1>
        <p className="mt-3 text-muted-foreground">
          Short answers to the questions we hear most often.
        </p>

        <Accordion type="single" collapsible className="mt-8">
          {faqs.map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="card-surface mt-10 rounded-2xl p-6">
          <h2 className="text-lg font-semibold">Still stuck?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Reach out and a person will get back to you.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild>
              <a href="mailto:hello@kindquest.org">
                <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
                Email support
              </a>
            </Button>
            <Button asChild variant="outline">
              <Link to="/browse">Browse opportunities</Link>
            </Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

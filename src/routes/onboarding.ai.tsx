import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Send, SkipForward } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { KindQuestLogo } from "@/components/KindQuestLogo";
import { OpportunityGrid } from "@/components/shared/OpportunityCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { aiService } from "@/services";
import type { ChatMessage, Opportunity } from "@/types";

export const Route = createFileRoute("/onboarding/ai")({
  head: () => ({
    meta: [
      { title: "Talk to KindQuest · KindQuest" },
      {
        name: "description",
        content:
          "Describe your interests, skills and availability in your own words and get matched.",
      },
      { property: "og:title", content: "Talk to KindQuest · KindQuest" },
      {
        property: "og:description",
        content:
          "A short conversation turns what you care about into real volunteering opportunities.",
      },
    ],
  }),
  component: AiOnboarding,
});

const opening: ChatMessage = {
  id: "m0",
  from: "kindquest",
  text: "Hi! Tell me what you'd enjoy doing, or a problem you'd like to help with. Plain words are perfect.",
};

function AiOnboarding() {
  const [messages, setMessages] = useState<ChatMessage[]>([opening]);
  const [suggestions, setSuggestions] = useState<string[]>([
    "I like teaching kids",
    "I care about the environment",
    "I want something remote",
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [interests, setInterests] = useState<string[]>([]);
  const [matches, setMatches] = useState<Opportunity[]>([]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, thinking, matches.length]);

  const send = async (text: string) => {
    const value = text.trim();
    if (!value || thinking) return;
    const history = messages;
    setMessages((m) => [...m, { id: `u${m.length}`, from: "user", text: value }]);
    setInput("");
    setSuggestions([]);
    setThinking(true);

    const res = await aiService.reply(history, value);
    setMessages((m) => [...m, { id: `k${m.length}`, from: "kindquest", text: res.text }]);
    setSuggestions(res.suggestions);
    setThinking(false);

    if (res.done) {
      const [found, recs] = await Promise.all([
        aiService.extractInterests(messages),
        aiService.recommend([]),
      ]);
      setInterests(found);
      setMatches(recs);
    }
  };

  return (
    <div className="min-h-dvh bg-surface">
      <div className="mx-auto flex min-h-dvh max-w-3xl flex-col px-4 py-6 sm:px-6 sm:py-10">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" aria-label="KindQuest home">
            <KindQuestLogo size="sm" framed />
          </Link>
          <Button asChild variant="ghost" size="sm">
            <Link to="/browse">
              <SkipForward className="mr-1 h-4 w-4" aria-hidden="true" />
              Skip
            </Link>
          </Button>
        </div>

        <h1 className="mt-6 text-2xl font-bold sm:text-3xl">Tell KindQuest what matters to you</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Nothing here is stored. You can leave at any point and still browse everything.
        </p>

        <div className="mt-6 flex-1 space-y-4" aria-live="polite">
          {messages.map((m) =>
            m.from === "user" ? (
              <div key={m.id} className="flex justify-end">
                <p className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                  {m.text}
                </p>
              </div>
            ) : (
              <div key={m.id} className="flex items-start gap-3">
                <KindQuestLogo size="xs" framed />
                <p className="max-w-[85%] pt-1 text-sm leading-relaxed text-foreground">{m.text}</p>
              </div>
            ),
          )}

          {thinking ? (
            <div className="flex items-center gap-3">
              <KindQuestLogo size="xs" framed />
              <p className="animate-pulse text-sm text-muted-foreground">Thinking…</p>
            </div>
          ) : null}

          {interests.length ? (
            <div className="card-surface rounded-2xl p-5">
              <p className="text-sm font-semibold">What I understood</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {interests.map((i) => (
                  <Badge key={i} variant="secondary">
                    {i}
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}

          {matches.length ? (
            <div>
              <h2 className="mt-6 text-lg font-semibold">Opportunities for you</h2>
              <div className="mt-4">
                <OpportunityGrid items={matches} />
              </div>
              <Button asChild size="lg" className="mt-6">
                <Link to="/discover">
                  Go to my dashboard
                  <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          ) : null}

          <div ref={endRef} />
        </div>

        {matches.length === 0 ? (
          <div className="sticky bottom-0 mt-6 bg-surface pb-2 pt-3">
            {suggestions.length ? (
              <div className="mb-3 flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <Button key={s} variant="outline" size="sm" onClick={() => send(s)}>
                    {s}
                  </Button>
                ))}
              </div>
            ) : null}
            <form
              className="flex items-end gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                void send(input);
              }}
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your answer…"
                aria-label="Your message"
              />
              <Button
                type="submit"
                size="icon"
                disabled={thinking || !input.trim()}
                aria-label="Send message"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </Button>
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
}

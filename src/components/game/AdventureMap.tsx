import { Check, Lock } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  destinations,
  nodePosition,
  paths,
  START,
  tintClass,
  type Destination,
} from "./adventure-data";

export function AdventureMap({
  completed,
  playerAt,
  onEnter,
  items = destinations,
  mapPaths = paths,
}: {
  completed: string[];
  playerAt: string;
  onEnter: (d: Destination) => void;
  items?: Destination[] | undefined;
  mapPaths?: [string, string][] | undefined;
}) {
  const isUnlocked = (d: Destination) => completed.length >= d.unlockAfter;
  const position = (id: string) => {
    if (id === START.id) return { x: START.x, y: START.y };
    const destination = items.find((d) => d.id === id);
    return destination ? { x: destination.x, y: destination.y } : nodePosition(id);
  };
  const player = position(playerAt);

  return (
    <div className="card-surface relative overflow-hidden rounded-3xl leaf-glow">
      {/* soft terrain */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70 dark:opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(38% 42% at 20% 30%, color-mix(in oklab, var(--primary) 16%, transparent), transparent), radial-gradient(34% 38% at 78% 70%, color-mix(in oklab, var(--sky) 22%, transparent), transparent), radial-gradient(30% 34% at 62% 18%, color-mix(in oklab, var(--sunbeam) 22%, transparent), transparent)",
        }}
      />

      <div className="relative aspect-[3/4] w-full sm:aspect-[16/9]">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {mapPaths.map(([from, to]) => {
            const a = position(from);
            const b = position(to);
            const target = items.find((d) => d.id === to);
            const open = !target || completed.length >= target.unlockAfter;
            return (
              <line
                key={`${from}-${to}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="currentColor"
                className={cn(
                  "text-foreground transition-opacity duration-700",
                  open ? "opacity-25" : "opacity-[0.08]",
                )}
                strokeWidth={0.7}
                strokeDasharray="2.4 2.4"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>

        {/* start marker */}
        <MapNode x={START.x} y={START.y}>
          <div className="flex flex-col items-center gap-1">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-accent text-base shadow-[var(--shadow-soft)]">
              🌱
            </span>
            <span className="rounded-full bg-card/85 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground backdrop-blur">
              Start
            </span>
          </div>
        </MapNode>

        {items.map((d) => {
          const unlocked = isUnlocked(d);
          const done = completed.includes(d.id);
          return (
            <MapNode key={d.id} x={d.x} y={d.y}>
              <button
                type="button"
                disabled={!unlocked}
                onClick={() => onEnter(d)}
                aria-label={`${d.name}${done ? " (completed)" : unlocked ? "" : " (locked)"}`}
                className={cn(
                  "group flex flex-col items-center gap-1.5 rounded-2xl p-1 transition-all duration-300",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  unlocked ? "hover:-translate-y-1" : "cursor-not-allowed opacity-45",
                )}
              >
                <span
                  className={cn(
                    "relative grid h-14 w-14 place-items-center rounded-2xl text-2xl shadow-[var(--shadow-soft)] transition-all duration-300 sm:h-16 sm:w-16 sm:text-3xl",
                    tintClass[d.tint],
                    unlocked && "group-hover:shadow-[var(--shadow-lift)]",
                    done && "ring-2 ring-primary ring-offset-2 ring-offset-card",
                  )}
                >
                  {unlocked ? d.emoji : <Lock className="h-5 w-5" aria-hidden="true" />}
                  {done ? (
                    <span className="absolute -right-1.5 -top-1.5 grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-soft)]">
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  ) : null}
                </span>
                <span className="max-w-[6.5rem] rounded-full bg-card/85 px-2 py-0.5 text-center text-[11px] font-semibold leading-tight backdrop-blur">
                  {d.name}
                </span>
              </button>
            </MapNode>
          );
        })}

        {/* the player */}
        <div
          className="pointer-events-none absolute z-10 transition-all duration-700 ease-in-out"
          style={{ left: `${player.x}%`, top: `${player.y}%`, transform: "translate(-50%, -140%)" }}
        >
          <div className="flex flex-col items-center gap-1 animate-fade-in">
            <span className="rounded-full bg-foreground px-2 py-0.5 text-[10px] font-semibold text-background">
              You are here
            </span>
            <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-primary bg-card text-lg shadow-[var(--shadow-lift)]">
              🧑
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MapNode({ x, y, children }: { x: number; y: number; children: React.ReactNode }) {
  return (
    <div
      className="absolute"
      style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
    >
      {children}
    </div>
  );
}

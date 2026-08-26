import { useRef, useState, type PointerEvent } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Destination } from "./adventure-data";

/**
 * The shared destination mini-interaction: the player moves pieces
 * (seedlings, books, leashes, files…) into empty spots with a pointer drag.
 * Targets never complete on click; desktop and touch both require drag + release.
 */
export function PlaceActivity({
  destination,
  onComplete,
}: {
  destination: Destination;
  onComplete: () => void;
}) {
  const total = destination.slots;
  const [filled, setFilled] = useState<boolean[]>(() => Array.from({ length: total }, () => false));
  const [justFilled, setJustFilled] = useState<number | null>(null);
  const [activeDrop, setActiveDrop] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [drag, setDrag] = useState<{
    pointerId: number;
    x: number;
    y: number;
    started: boolean;
  } | null>(null);
  const targetRefs = useRef<Array<HTMLDivElement | null>>([]);
  const placed = filled.filter(Boolean).length;
  const done = placed === total;

  const place = (index: number) => {
    if (filled[index]) return;
    setFilled((f) => f.map((v, i) => (i === index ? true : v)));
    setJustFilled(index);
    setFeedback(null);
  };

  const nearestDrop = (clientX: number, clientY: number) => {
    let closestIndex: number | null = null;
    let closestDistance = Number.POSITIVE_INFINITY;

    targetRefs.current.forEach((node, index) => {
      if (!node || filled[index]) return;
      const rect = node.getBoundingClientRect();
      const generous = 34;
      const inside =
        clientX >= rect.left - generous &&
        clientX <= rect.right + generous &&
        clientY >= rect.top - generous &&
        clientY <= rect.bottom + generous;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.hypot(clientX - centerX, clientY - centerY);
      const radius = Math.max(rect.width, rect.height) * 0.8;

      if (inside || distance <= radius) {
        if (distance < closestDistance) {
          closestIndex = index;
          closestDistance = distance;
        }
      }
    });

    return closestIndex;
  };

  const beginDrag = (event: PointerEvent<HTMLSpanElement>) => {
    if (done) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setDrag({ pointerId: event.pointerId, x: event.clientX, y: event.clientY, started: true });
    setActiveDrop(nearestDrop(event.clientX, event.clientY));
    setFeedback(null);
  };

  const moveDrag = (event: PointerEvent<HTMLSpanElement>) => {
    if (!drag || drag.pointerId !== event.pointerId) return;
    event.preventDefault();
    setDrag((current) =>
      current ? { ...current, x: event.clientX, y: event.clientY, started: true } : current,
    );
    setActiveDrop(nearestDrop(event.clientX, event.clientY));
  };

  const endDrag = (event: PointerEvent<HTMLSpanElement>) => {
    if (!drag || drag.pointerId !== event.pointerId) return;
    event.preventDefault();
    const target = nearestDrop(event.clientX, event.clientY);
    setDrag(null);
    setActiveDrop(null);
    if (target === null) {
      setFeedback("Try placing it where it belongs.");
      return;
    }
    place(target);
  };

  return (
    <div className="mt-6">
      <div className="card-surface relative overflow-hidden rounded-3xl p-5 sm:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60 dark:opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(45% 55% at 15% 10%, color-mix(in oklab, var(--primary) 14%, transparent), transparent), radial-gradient(40% 50% at 85% 90%, color-mix(in oklab, var(--sky) 18%, transparent), transparent)",
          }}
        />

        <div className="relative">
          <p className="font-semibold">{destination.prompt}</p>
          <p className="mt-1 text-sm text-muted-foreground">{destination.helper}</p>

          {/* scene backdrop */}
          <div className="mt-6 flex items-end justify-center gap-3 text-2xl sm:text-3xl" aria-hidden="true">
            {destination.scene.map((s, i) => (
              <span
                key={`${s}-${i}`}
                className="opacity-70 transition-transform duration-500"
                style={{ transform: `translateY(${i % 2 === 0 ? -2 : 2}px)` }}
              >
                {s}
              </span>
            ))}
          </div>

          {/* the spots */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {filled.map((isFilled, i) => (
              <div
                key={i}
                ref={(node) => {
                  targetRefs.current[i] = node;
                }}
                role="img"
                aria-label={isFilled ? "Filled spot" : `Place ${destination.pieceLabel.toLowerCase()} here`}
                className={cn(
                  "relative grid aspect-square place-items-center rounded-2xl border-2 border-dashed text-3xl transition-all duration-300 sm:text-4xl",
                  isFilled
                    ? "border-solid border-primary/60 bg-primary-soft"
                    : "border-border bg-muted/60 hover:border-primary hover:bg-accent/50",
                  activeDrop === i && !isFilled && "scale-[1.03] border-primary bg-accent/70 shadow-[var(--shadow-lift)]",
                  justFilled === i && "animate-scale-in",
                )}
              >
                {activeDrop === i && !isFilled ? (
                  <span className="absolute inset-x-2 top-2 flex justify-between text-base" aria-hidden="true">
                    <span>✨</span>
                    <span>✨</span>
                  </span>
                ) : null}
                <span className={cn(!isFilled && "opacity-45")}>
                  {isFilled ? destination.filledEmoji : destination.slotEmoji}
                </span>
              </div>
            ))}
          </div>

          {/* the tray */}
          <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl bg-surface/80 p-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {destination.pieceLabel}s
            </span>
            {Array.from({ length: total - placed }).map((_, i) => (
              <span
                key={i}
                draggable={false}
                onPointerDown={beginDrag}
                onPointerMove={moveDrag}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setFeedback("Drag this into a matching spot to place it.");
                  }
                }}
                aria-label={`Pick up ${destination.pieceLabel.toLowerCase()}`}
                className={cn(
                  "grid h-12 w-12 touch-none select-none place-items-center rounded-xl bg-card text-2xl shadow-[var(--shadow-soft)] transition-all duration-200",
                  "cursor-grab hover:-translate-y-0.5 active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  drag && i === 0 && "scale-95 opacity-45",
                  feedback && !drag && i === 0 && "animate-scale-in ring-2 ring-primary",
                )}
              >
                {destination.pieceEmoji}
              </span>
            ))}
            {placed > 0 && !done ? (
              <span className="text-sm text-muted-foreground">
                {placed} of {total} placed
              </span>
            ) : null}
            {done ? (
              <span className="text-sm font-semibold text-primary">All set ✨</span>
            ) : null}
            {feedback && !done ? <span className="text-sm text-muted-foreground">{feedback}</span> : null}
          </div>
        </div>
      </div>

      {drag ? (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed z-50 grid h-14 w-14 place-items-center rounded-2xl bg-card text-3xl shadow-[var(--shadow-lift)] ring-2 ring-primary/40"
          style={{
            left: drag.x,
            top: drag.y,
            transform: "translate(-50%, -50%) scale(1.12)",
          }}
        >
          {destination.pieceEmoji}
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button size="lg" disabled={!done} onClick={onComplete}>
          {done ? "See what that says about you" : `Place ${total - placed} more`}
        </Button>
      </div>
    </div>
  );
}

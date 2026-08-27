import React, { useEffect, useRef, useState } from "react";

interface NodeItem {
  id: string;
  emoji: string;
  label: string;
  angle: number;
  distance: number;
  color: string;
}

const NODES: NodeItem[] = [
  {
    id: "env",
    emoji: "🌱",
    label: "Environment",
    angle: 0,
    distance: 130,
    color: "oklch(0.7 0.18 145)",
  },
  {
    id: "edu",
    emoji: "📚",
    label: "Education",
    angle: 72,
    distance: 130,
    color: "oklch(0.7 0.18 230)",
  },
  {
    id: "anim",
    emoji: "🐶",
    label: "Animals",
    angle: 144,
    distance: 130,
    color: "oklch(0.75 0.18 45)",
  },
  {
    id: "comm",
    emoji: "🤝",
    label: "Community",
    angle: 216,
    distance: 130,
    color: "oklch(0.8 0.18 85)",
  },
  {
    id: "tech",
    emoji: "💻",
    label: "Remote",
    angle: 288,
    distance: 130,
    color: "oklch(0.75 0.18 300)",
  },
];

export function KindnessGlobe3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const [webGLAvailable, setWebGLAvailable] = useState(true);

  useEffect(() => {
    // Check reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", listener);

    // Check canvas 2D / WebGL support
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) setWebGLAvailable(false);
    } catch {
      setWebGLAvailable(false);
    }

    return () => {
      mediaQuery.removeEventListener("change", listener);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    let animId: number;
    let lastTime = performance.now();

    const animate = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      setRotation((prev) => (prev + delta * 18) % 360);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [reducedMotion]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || reducedMotion) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const normX = (e.clientX - centerX) / (rect.width / 2);
    const normY = (e.clientY - centerY) / (rect.height / 2);
    setMouseOffset({ x: normX * 12, y: normY * 12 });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
    setHoveredNode(null);
  };

  if (!webGLAvailable) {
    return (
      <div className="card-surface flex aspect-square w-full max-w-[420px] mx-auto items-center justify-center rounded-3xl p-8 leaf-glow text-center">
        <div>
          <span className="text-6xl">🌍</span>
          <h3 className="mt-4 text-xl font-bold">One Connected World</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Many ways to help, infinite local & remote impact.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="card-surface relative aspect-square w-full max-w-[440px] mx-auto flex items-center justify-center overflow-hidden rounded-3xl p-6 shadow-[var(--shadow-lift)] leaf-glow select-none"
      style={{
        perspective: "800px",
      }}
    >
      {/* Background radial glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60 dark:opacity-35"
        style={{
          backgroundImage:
            "radial-gradient(50% 50% at 50% 50%, color-mix(in oklab, var(--primary) 22%, transparent), transparent)",
        }}
      />

      {/* 3D Sphere Container */}
      <div
        className="relative flex items-center justify-center transition-transform duration-300 ease-out"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${-mouseOffset.y}deg) rotateY(${mouseOffset.x}deg)`,
        }}
      >
        {/* Core Stylized Globe */}
        <div className="relative grid h-44 w-44 place-items-center rounded-full bg-gradient-to-br from-primary/30 via-sky/20 to-accent/40 shadow-[inset_0_2px_20px_rgba(255,255,255,0.4),0_12px_36px_rgba(0,0,0,0.1)] border border-primary/20 backdrop-blur-sm">
          <span className="text-6xl filter drop-shadow-md animate-pulse">🌍</span>

          {/* Latitude & Longitude Rings */}
          <div className="absolute inset-0 rounded-full border border-primary/25 opacity-60 animate-spin-slow pointer-events-none" />
          <div
            className="absolute inset-1 rounded-full border border-dashed border-sky-400/40 opacity-40 pointer-events-none"
            style={{ transform: "rotateX(65deg)" }}
          />
          <div
            className="absolute inset-2 rounded-full border border-sunbeam-400/40 opacity-40 pointer-events-none"
            style={{ transform: "rotateY(65deg)" }}
          />
        </div>

        {/* Orbiting Cause Nodes */}
        {NODES.map((node) => {
          const currentAngle = (node.angle + rotation) * (Math.PI / 180);
          const x = Math.cos(currentAngle) * node.distance;
          const y = Math.sin(currentAngle) * (node.distance * 0.45);
          const depth = Math.sin(currentAngle);
          const scale = 0.8 + (depth + 1) * 0.22;
          const zIndex = Math.round((depth + 1) * 10);
          const opacity = 0.55 + (depth + 1) * 0.22;

          return (
            <div
              key={node.id}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              className="absolute left-1/2 top-1/2 cursor-pointer transition-all duration-150"
              style={{
                transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${depth * 40}px) scale(${scale})`,
                zIndex,
                opacity,
              }}
            >
              <div
                className={`group flex items-center gap-2 rounded-full px-3 py-1.5 backdrop-blur-md transition-all duration-300 shadow-md ${
                  hoveredNode === node.id
                    ? "scale-110 bg-card border-2 border-primary ring-4 ring-primary/20"
                    : "bg-card/90 border border-border"
                }`}
              >
                <span className="text-xl">{node.emoji}</span>
                <span className="text-xs font-semibold text-foreground">{node.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

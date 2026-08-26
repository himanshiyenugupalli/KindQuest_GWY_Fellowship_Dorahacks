import logo from "@/assets/kindquest-logo.png.asset.json";
import { cn } from "@/lib/utils";

type LogoSize = "xs" | "sm" | "md" | "lg" | "xl";

const sizes: Record<LogoSize, string> = {
  xs: "h-8",
  sm: "h-10",
  md: "h-14",
  lg: "h-24",
  xl: "h-40",
};

/**
 * The official KindQuest logo. The asset is used as provided — never
 * recoloured, recreated or replaced with an icon.
 */
export function KindQuestLogo({
  size = "sm",
  className,
  framed = false,
}: {
  size?: LogoSize;
  className?: string;
  /** Places the logo on a light neutral plate for extra contrast in dark mode. */
  framed?: boolean;
}) {
  const img = (
    <img
      src="/logo.png"
      alt="KindQuest"
      className={cn("w-auto object-contain", sizes[size], className)}
      loading="eager"
      decoding="async"
    />
  );

  if (!framed) return img;

  return (
    <span className="inline-flex items-center justify-center rounded-2xl bg-[oklch(0.99_0.006_95)] p-2 dark:bg-[oklch(0.96_0.008_95)]">
      {img}
    </span>
  );
}

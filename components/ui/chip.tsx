import { cn } from "@/lib/utils";

/** Pill tag, DM Mono, for dates, places and short status labels. */
export function Chip({
  children,
  tone = "soft",
  className,
}: {
  children: React.ReactNode;
  tone?: "soft" | "outline" | "onDark";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "text-label inline-flex items-center rounded-full px-3 py-1 font-mono",
        tone === "soft" && "bg-teal-soft text-ink",
        tone === "outline" && "border-flat text-ink",
        // On the hero gradient. A white border and white text, so the three
        // co-hosts read identically.
        tone === "onDark" && "border border-white/70 text-white",
        className,
      )}
    >
      {children}
    </span>
  );
}

import { cn } from "@/lib/utils";

/** Pill tag, DM Mono, for dates, places and edition names. */
export function Chip({
  children,
  tone = "sky",
  className,
  style,
}: {
  children: React.ReactNode;
  tone?: "sky" | "sage" | "peach" | "outline";
  className?: string;
  /** Only for per-edition accent colours, which come from the database. */
  style?: React.CSSProperties;
}) {
  return (
    <span
      style={style}
      className={cn(
        "text-label inline-flex items-center rounded-full px-3 py-1 font-mono",
        tone === "sky" && "bg-sky/30 text-ink",
        tone === "sage" && "bg-sage/30 text-ink",
        tone === "peach" && "bg-peach/40 text-ink",
        tone === "outline" && "border-flat text-ink",
        className,
      )}
    >
      {children}
    </span>
  );
}

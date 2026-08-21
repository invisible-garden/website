import { cn } from "@/lib/utils";

/** The site's content column: tight margins on mobile, wide on desktop. */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4 md:px-12", className)}>
      {children}
    </div>
  );
}

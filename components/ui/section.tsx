import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

/** A page section with the standard vertical rhythm, 48px up to 80px. */
export function Section({
  className,
  tone = "white",
  id,
  children,
}: {
  className?: string;
  tone?: "white" | "paper" | "ink";
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "py-12 md:py-20",
        tone === "paper" && "bg-paper",
        tone === "ink" && "bg-ink text-white",
        className,
      )}
    >
      <Container>{children}</Container>
    </section>
  );
}

/** `level` is 1 when the heading is the page title, 2 inside a page. Every page
 *  needs exactly one h1, see scripts/audit/html-audit.ts. */
export function SectionHeading({
  label,
  title,
  intro,
  className,
  level = 2,
}: {
  label?: string;
  title: string;
  intro?: string;
  className?: string;
  level?: 1 | 2;
}) {
  const Heading = level === 1 ? "h1" : "h2";
  return (
    <header className={cn("max-w-2xl", className)}>
      {label ? (
        <p className="text-label text-blue-link font-mono uppercase">{label}</p>
      ) : null}
      <Heading className="text-headline-lg mt-3">{title}</Heading>
      {intro ? <p className="text-body-lg mt-4">{intro}</p> : null}
    </header>
  );
}

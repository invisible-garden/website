import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Pill buttons. `primary` is the teal fill for light sections, `invert` is the
 * white fill for the hero gradient, where a teal button would disappear into
 * the background. Renders a plain anchor for external links.
 */
export function ButtonLink({
  href,
  variant = "primary",
  className,
  children,
}: {
  href: string;
  variant?: "primary" | "secondary" | "invert";
  className?: string;
  children: React.ReactNode;
}) {
  const styles = cn(
    "text-body-md inline-flex items-center rounded-full px-6 py-3 font-medium no-underline transition",
    variant === "primary" && "bg-teal-deep text-white hover:bg-teal-dark",
    variant === "secondary" && "border-flat text-ink hover:bg-teal-wash",
    variant === "invert" && "text-teal-deep bg-white hover:bg-teal-wash",
    className,
  );
  if (href.startsWith("http")) {
    return (
      <a className={styles} href={href} rel="noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link className={styles} href={href}>
      {children}
    </Link>
  );
}

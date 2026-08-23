import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Pill buttons: primary deep blue, secondary a peach border, per the visual
 * language. `invert` is the light fill for dark surfaces, where deep blue on
 * ink is 1.4:1 and the button stops reading as a button. Renders a plain
 * anchor for external links.
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
    variant === "primary" && "bg-blue-deep text-white hover:bg-blue-link",
    variant === "secondary" && "border-flat text-ink hover:bg-peach/20",
    variant === "invert" && "text-blue-deep bg-white hover:bg-sun",
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

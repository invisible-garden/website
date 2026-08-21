import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function SiteHeader() {
  return (
    <header className="border-b border-[color:var(--color-border-subtle)]">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4 md:px-12"
      >
        <Link
          href="/"
          className="font-display text-ink text-headline-sm no-underline"
        >
          {siteConfig.name}
        </Link>
        <ul className="flex flex-wrap items-center gap-4 md:gap-8">
          {siteConfig.nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-label text-ink font-mono uppercase no-underline hover:underline"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

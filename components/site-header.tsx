import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function SiteHeader() {
  return (
    <header className="border-b border-[color:var(--color-border-subtle)]">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-4 md:px-12"
      >
        <Link href="/" className="no-underline" aria-label={siteConfig.name}>
          <Image
            src="/images/logo/wordmark.svg"
            alt={siteConfig.name}
            width={577}
            height={209}
            priority
            className="h-8 w-auto"
          />
        </Link>
        <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 md:gap-8">
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

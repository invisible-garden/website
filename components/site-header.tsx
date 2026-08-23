import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

/**
 * A slim bar, not a navigation. The site is one page, and the brief drops the
 * heading block with links that the Invisible Garden homepage carries.
 *
 * The name is set in type. No mark: the Invisible Garden leaf would brand the
 * event as Invisible Garden's, and Invisible Commons has no mark of its own
 * yet, see the open item in mb/site-split-instructions.md section 5.
 */
export function SiteHeader() {
  return (
    <header className="border-b border-[color:var(--color-border-subtle)]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-4 md:px-12">
        <Link href="/" className="text-ink no-underline">
          <span className="font-display text-headline-sm">
            {siteConfig.name}
          </span>
        </Link>
        <a
          href={siteConfig.telegram}
          className="text-label font-mono uppercase"
          rel="noreferrer"
        >
          Telegram
        </a>
      </div>
    </header>
  );
}

import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

const social = [
  { href: siteConfig.social.x, label: "X" },
  { href: siteConfig.social.telegram, label: "Telegram" },
  { href: siteConfig.social.discord, label: "Discord" },
  { href: siteConfig.social.youtube, label: "YouTube" },
].filter((link) => link.href);

export function SiteFooter() {
  return (
    <footer className="bg-paper mt-20 border-t border-[color:var(--color-border-subtle)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 md:flex-row md:items-start md:justify-between md:px-12">
        <div>
          <p className="font-display text-headline-sm">{siteConfig.name}</p>
          <p className="text-body-sm mt-2">{siteConfig.description}</p>
        </div>
        <ul className="flex flex-wrap gap-4">
          {social.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-label font-mono uppercase"
                rel="me noreferrer"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <Link href="/editions" className="text-label font-mono uppercase">
              Editions
            </Link>
          </li>
        </ul>
      </div>
      <p className="text-body-sm px-4 pb-8 md:px-12">
        &copy; {new Date().getFullYear()} {siteConfig.name}
      </p>
    </footer>
  );
}

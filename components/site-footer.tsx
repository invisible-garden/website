import { formatDateRange } from "@/lib/dates";
import { eventConfig, siteConfig } from "@/lib/site-config";

/**
 * Neutral by decision (invisiblecommons-brief, "Identity and design"): the
 * event name, where and when, and the one channel that exists. No legal
 * entity, no contact address, and no co-host's own identity.
 */
export function SiteFooter() {
  return (
    <footer className="bg-paper mt-20 border-t border-[color:var(--color-border-subtle)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 md:flex-row md:items-end md:justify-between md:px-12">
        <div>
          <p className="font-display text-headline-sm">{siteConfig.name}</p>
          <p className="text-body-sm mt-2 font-mono">
            {eventConfig.city}, {eventConfig.country} &middot;{" "}
            {formatDateRange(eventConfig.startsOn, eventConfig.endsOn)}
          </p>
        </div>
        <a
          href={siteConfig.telegram}
          className="text-label font-mono uppercase"
          rel="noreferrer"
        >
          Telegram
        </a>
      </div>
    </footer>
  );
}

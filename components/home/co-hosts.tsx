import { Section, SectionHeading } from "@/components/ui/section";
import { eventConfig } from "@/lib/site-config";

/**
 * The three co-hosts, section 3 of the one-pager. Identical billing: same
 * heading level, same column width, same length of blurb, in one grid.
 *
 * DEFERRED: no co-host has sent a line of their own. All three descriptions
 * are drafted from their own public sites and still want their sign-off.
 */
export function CoHosts() {
  return (
    <Section tone="paper">
      <SectionHeading
        label="Who is behind it"
        title="Three co-hosts, equal weight"
        intro="Invisible Commons is run jointly. None of the three is the host and the others the guests."
      />

      <ul className="mt-10 grid gap-8 md:grid-cols-3">
        {eventConfig.organisers.map((organiser) => (
          <li
            key={organiser.name}
            className="rounded-[--radius-card] bg-white p-8 shadow-[var(--shadow-soft)]"
          >
            <h3 className="text-headline-sm">
              <a href={organiser.url} rel="noreferrer">
                {organiser.name}
              </a>
            </h3>
            <p className="text-body-md mt-3">{organiser.description}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

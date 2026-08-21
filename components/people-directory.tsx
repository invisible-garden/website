"use client";

import { useMemo, useState } from "react";
import { PersonCard } from "@/components/person-card";
import type { PersonWithEditions } from "@/lib/queries";
import type { EditionRow } from "@/types/db";
import { cn } from "@/lib/utils";

/**
 * The one genuinely dynamic surface. The server ships the whole payload once
 * and filtering happens here, so there is no database round trip per keystroke
 * and no database key in the browser. See tech-design 6.2.
 */
export function PeopleDirectory({
  people,
  editions,
}: {
  people: PersonWithEditions[];
  editions: Pick<EditionRow, "slug" | "name">[];
}) {
  const [edition, setEdition] = useState<string>("all");
  const [query, setQuery] = useState("");

  // The server ships the list already ranked by prominence, so filtering keeps
  // that order rather than imposing its own.
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return people.filter((person) => {
      const inEdition =
        edition === "all" || person.editions.some((e) => e.slug === edition);
      if (!inEdition) return false;
      if (!needle) return true;
      return (
        person.full_name.toLowerCase().includes(needle) ||
        (person.headline ?? "").toLowerCase().includes(needle)
      );
    });
  }, [people, edition, query]);

  const filters = [{ slug: "all", name: "All editions" }, ...editions];

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter by edition"
        >
          {filters.map((option) => {
            const active = option.slug === edition;
            return (
              <button
                key={option.slug}
                type="button"
                onClick={() => setEdition(option.slug)}
                aria-pressed={active}
                className={cn(
                  "text-label rounded-full px-4 py-2 font-mono transition",
                  active
                    ? "bg-ink text-white"
                    : "border-flat text-ink hover:bg-peach/20",
                )}
              >
                {option.name}
              </button>
            );
          })}
        </div>

        <label className="text-body-sm flex items-center gap-2">
          <span className="sr-only">Search by name or headline</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
            className="bg-paper text-body-md focus:border-ink w-full rounded-[--radius-sm] border border-[color:var(--color-border-subtle)] px-4 py-2 md:w-64"
          />
        </label>
      </div>

      <p className="text-body-sm mt-6" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "person" : "people"}
      </p>

      <ul className="mt-4 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((person, index) => (
          <li key={person.slug}>
            <PersonCard person={person} priority={index < 4} />
          </li>
        ))}
      </ul>

      {filtered.length === 0 ? (
        <p className="text-body-lg mt-8">Nobody matches that filter.</p>
      ) : null}
    </div>
  );
}

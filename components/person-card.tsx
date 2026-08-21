import Image from "next/image";
import Link from "next/link";
import { personPhotoUrl } from "@/lib/media";
import type { PersonRow } from "@/types/db";

/**
 * One profile in a grid. Renders `headline` verbatim, never the parsed
 * `job_title` or `org`, see CLAUDE.md.
 */
export function PersonCard({
  person,
  priority = false,
}: {
  person: Pick<
    PersonRow,
    "slug" | "full_name" | "headline" | "photo_path" | "photo_alt"
  >;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/people/${person.slug}`}
      className="group text-ink block no-underline"
    >
      <div className="bg-paper relative aspect-square w-full overflow-hidden rounded-[--radius-card]">
        <Image
          src={personPhotoUrl(person.photo_path, 400)}
          alt={person.photo_alt ?? person.full_name}
          fill
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 220px"
          className="object-cover transition duration-300 group-hover:scale-[1.02]"
          priority={priority}
        />
      </div>
      <p className="font-display text-body-lg mt-3 font-semibold group-hover:underline">
        {person.full_name}
      </p>
      {person.headline ? (
        <p className="text-body-sm mt-1 text-[color:color-mix(in_srgb,var(--color-ink)_70%,white)]">
          {person.headline}
        </p>
      ) : null}
    </Link>
  );
}

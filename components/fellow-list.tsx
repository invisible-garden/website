import Image from "next/image";
import { personPhotoUrl } from "@/lib/media";
import type { FellowRow } from "@/types/db";

/** Fellows belong to their edition's recap, see content-brief 3.5. */
export function FellowList({ fellows }: { fellows: FellowRow[] }) {
  if (fellows.length === 0) return null;
  return (
    <ul className="grid gap-8 md:grid-cols-2">
      {fellows.map((fellow) => (
        <li key={fellow.slug} className="flex gap-4">
          <div className="bg-paper relative h-20 w-20 shrink-0 overflow-hidden rounded-full">
            <Image
              src={personPhotoUrl(fellow.photo_path, 400)}
              alt={fellow.name}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
          <div>
            <p className="font-display text-body-lg font-semibold">
              {fellow.name}
            </p>
            {fellow.category ? (
              <p className="text-label font-mono uppercase">
                {fellow.category} fellow
              </p>
            ) : null}
            {fellow.bio ? (
              <p className="text-body-sm mt-2" data-verbatim>
                {fellow.bio}
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

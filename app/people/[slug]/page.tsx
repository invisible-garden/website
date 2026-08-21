import type { Metadata } from "next";

export const metadata: Metadata = { title: "Profile" };

/** Phase 4: person detail, plus every edition they appeared in. */
export default async function PersonPage({
  params,
}: PageProps<"/people/[slug]">) {
  const { slug } = await params;
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 md:px-12">
      <h1 className="text-headline-lg">{slug}</h1>
      <p className="text-body-lg mt-6">Built in phase 4 from the database.</p>
    </div>
  );
}

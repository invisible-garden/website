import type { Metadata } from "next";

export const metadata: Metadata = { title: "Edition" };

/**
 * Phase 4: recap page. Hero photo, recap video, headline numbers, what
 * happened, featured projects, mentors of that edition, sponsors, photo strip.
 * See content-brief section 3.2.
 */
export default async function EditionPage({
  params,
}: PageProps<"/editions/[slug]">) {
  const { slug } = await params;
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 md:px-12">
      <h1 className="text-headline-lg">{slug}</h1>
      <p className="text-body-lg mt-6">Built in phase 4 from the database.</p>
    </div>
  );
}

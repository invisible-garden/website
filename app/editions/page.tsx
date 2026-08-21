import type { Metadata } from "next";

export const metadata: Metadata = { title: "Editions" };

/** Phase 4: list every edition from Supabase, Goa marked upcoming. */
export default function EditionsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 md:px-12">
      <h1 className="text-headline-lg">Editions</h1>
      <p className="text-body-lg mt-6">Built in phase 4 from the database.</p>
    </div>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Invisible Garden is a traveling academy for Ethereum developers, run as pop-up dev cities since 2024.",
};

/** Copy comes from content/about.mdx, see content-brief section 3.3. */
export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-20 md:px-12">
      <h1 className="text-headline-lg">About</h1>
      <p className="text-body-lg mt-6">Copy pending, see content-brief 3.3.</p>
    </article>
  );
}

import type { Metadata } from "next";
import { EventSchema } from "@/components/event-schema";
import { CoHosts } from "@/components/home/co-hosts";
import { FormatExplainer } from "@/components/home/format-explainer";
import { Hero } from "@/components/home/hero";
import { Practical } from "@/components/home/practical";
import { Subjects } from "@/components/home/subjects";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * The site is one page. Section order is Leo's, 2026-08-23: hero, the format,
 * who is behind it, subjects, practical.
 *
 * Everything on it is static. There is no database behind this site, by
 * design, see mb/site-split-instructions.md section 2.
 */
export default function HomePage() {
  return (
    <>
      <EventSchema />
      <Hero />
      <FormatExplainer />
      <CoHosts />
      <Subjects />
      <Practical />
    </>
  );
}

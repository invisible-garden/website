import type { Metadata } from "next";
import About from "@/content/about.mdx";
import { Section } from "@/components/ui/section";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About",
  description: siteConfig.description,
  alternates: { canonical: "/about" },
};

/** Organisation data for search engines, kept on the page that describes the
 *  organisation rather than sprinkled sitewide. */
const organisationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  sameAs: [
    siteConfig.social.x,
    siteConfig.social.telegram,
    siteConfig.social.discord,
    siteConfig.social.youtube,
  ].filter(Boolean),
};

export default function AboutPage() {
  return (
    <Section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organisationSchema) }}
      />
      <div className="max-w-3xl">
        <h1 className="text-headline-lg">About Invisible Garden</h1>
        <div className="text-body-lg [&_h2]:text-headline-md mt-8 space-y-6 [&_h2]:mt-12">
          <About />
        </div>
      </div>
    </Section>
  );
}

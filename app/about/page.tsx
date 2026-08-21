import type { Metadata } from "next";
import About from "@/content/about.mdx";
import { Section } from "@/components/ui/section";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About",
  description: siteConfig.description,
};

export default function AboutPage() {
  return (
    <Section>
      <div className="max-w-3xl">
        <h1 className="text-headline-lg">About Invisible Garden</h1>
        <div className="text-body-lg [&_h2]:text-headline-md mt-8 space-y-6 [&_h2]:mt-12">
          <About />
        </div>
      </div>
    </Section>
  );
}

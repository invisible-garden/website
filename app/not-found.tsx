import Link from "next/link";
import { Section } from "@/components/ui/section";

export default function NotFound() {
  return (
    <Section>
      <div className="max-w-2xl">
        <h1 className="text-headline-lg">Page not found</h1>
        <p className="text-body-lg mt-4">
          That page does not exist. This site is a single page.
        </p>
        <p className="mt-8">
          <Link href="/" className="text-label font-mono uppercase">
            Home
          </Link>
        </p>
      </div>
    </Section>
  );
}

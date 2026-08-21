import Link from "next/link";
import { Section } from "@/components/ui/section";

export default function NotFound() {
  return (
    <Section>
      <div className="max-w-2xl">
        <h1 className="text-headline-lg">Page not found</h1>
        <p className="text-body-lg mt-4">
          That page does not exist, or it moved when the site was rebuilt.
        </p>
        <ul className="mt-8 flex flex-wrap gap-6">
          <li>
            <Link href="/" className="text-label font-mono uppercase">
              Home
            </Link>
          </li>
          <li>
            <Link href="/editions" className="text-label font-mono uppercase">
              Editions
            </Link>
          </li>
          <li>
            <Link href="/people" className="text-label font-mono uppercase">
              Mentors and speakers
            </Link>
          </li>
        </ul>
      </div>
    </Section>
  );
}

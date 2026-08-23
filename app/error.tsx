"use client";

import { Section } from "@/components/ui/section";

/** Runtime failures. Says what happened without leaking the error. */
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <Section>
      <div className="max-w-2xl">
        <h1 className="text-headline-lg">Something went wrong</h1>
        <p className="text-body-lg mt-4">
          This page could not load. It is usually temporary.
        </p>
        <button
          type="button"
          onClick={reset}
          className="text-body-md bg-teal-deep mt-8 rounded-full px-6 py-3 text-white"
        >
          Try again
        </button>
      </div>
    </Section>
  );
}

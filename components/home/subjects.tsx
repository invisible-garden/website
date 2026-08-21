import { Section, SectionHeading } from "@/components/ui/section";

/**
 * Subjects, two tiers. AI and robotics lead, they are Common Compute's domain
 * and mark the event as a joint project, content-brief section 1.
 *
 * DEFERRED: the mock-up puts photography on the two lead cards. No photo
 * selects have arrived, so these are type-led for now.
 */
const LEAD = [
  {
    title: "AI",
    body: "Models, agents, inference, and the infrastructure underneath them.",
  },
  {
    title: "Robotics",
    body: "Machines that act in the world, and the software that decides what they do.",
  },
];

const REST = [
  { title: "Zero knowledge proofs", body: "Proof systems, circuits, tooling." },
  {
    title: "Post-quantum cryptography",
    body: "What survives once the assumptions change.",
  },
  {
    title: "Formal verification",
    body: "Proving that the code does what it claims.",
  },
];

export function Subjects() {
  return (
    <Section tone="paper">
      <SectionHeading
        label="Subjects"
        title="What people come here to work on"
        intro="Builders and researchers, working in the open. Ethereum is the common ground underneath all of it."
      />

      <ul className="mt-10 grid gap-6 md:grid-cols-2">
        {LEAD.map((subject) => (
          <li
            key={subject.title}
            className="rounded-[--radius-card] bg-white p-8 shadow-[var(--shadow-soft)]"
          >
            <h3 className="text-headline-md">{subject.title}</h3>
            <p className="text-body-lg mt-3">{subject.body}</p>
          </li>
        ))}
      </ul>

      <ul className="mt-6 grid gap-6 md:grid-cols-3">
        {REST.map((subject) => (
          <li
            key={subject.title}
            className="border-flat rounded-[--radius-card] p-6"
          >
            <h3 className="text-headline-sm">{subject.title}</h3>
            <p className="text-body-md mt-2">{subject.body}</p>
          </li>
        ))}
      </ul>

      <p className="text-body-lg mt-10 max-w-2xl">
        People come here to give talks, write code, and do research. The social
        side exists to support the work, and the outcome is what you leave with.
      </p>
    </Section>
  );
}

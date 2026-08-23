/**
 * Checks the rendered copy against the voice rules in mb/content-brief.md
 * section 4 and the naming bans in section 3, plus the rules that are specific
 * to this site. These are the mistakes that would embarrass the project, and
 * they are easy to reintroduce by accident.
 *
 *   pnpm tsx scripts/audit/copy-rules.ts https://invisiblecommons.org
 *
 * Runs on visible text only, so metadata and code are ignored.
 */
const ROUTES = ["/"];

interface Rule {
  pattern: RegExp;
  why: string;
}

const RULES: Rule[] = [
  // Corporate vocabulary, content-brief section 4.
  ...[
    "leverage",
    "seamless",
    "robust",
    "cutting-edge",
    "innovative",
    "journey",
    "unlock",
  ].map((word) => ({
    pattern: new RegExp(`\\b${word}\\w*\\b`, "i"),
    why: "banned corporate word",
  })),
  // Vacation vocabulary, section 1.
  ...["retreat", "paradise", "escape", "relaxing", "beach life"].map(
    (word) => ({
      pattern: new RegExp(`\\b${word}\\b`, "i"),
      why: "vacation vocabulary, this is a place to work",
    }),
  ),
  // Things that must never appear, sections 3.2 and 3.3.
  { pattern: /\bEdge City\b/i, why: "never name another pop-up village" },
  { pattern: /\bCosta Rica\b/i, why: "cancelled edition, no mentions" },
  { pattern: /\bBerlin\b/i, why: "cancelled edition, no mentions" },
  { pattern: /Mentors Collective/i, why: "no longer exists" },
  {
    pattern:
      /Singapore[- ]registered|registered NGO|Invisible Garden Foundation/i,
    why: "stale legal claim",
  },
  {
    pattern: /\bour program\b|\bprogramme?\b/i,
    why: "there is no program this edition",
  },
  { pattern: /Work over Holiday/i, why: "internal positioning language" },
  { pattern: /Professional Punk Excellence/i, why: "internal style language" },
  // Framing that would imply a confirmed Goa lineup, section 3.1 item 5.
  {
    pattern: /our speakers|meet the mentors|who you will meet/i,
    why: "implies a confirmed lineup",
  },
  // Punctuation, section 4.
  { pattern: /\w\s*—\s*\w/, why: "em-dash used for a subphrase, use commas" },

  // Rules specific to invisiblecommons.org. Invisible Garden is one co-host
  // name here, nothing more. Its history, its identity and its community
  // belong to invisible.garden.
  {
    pattern:
      /\bour (previous|past|last) (edition|editions|gathering|gatherings|cohort|cohorts)\b/i,
    why: "this event has no history of its own, and no co-host's history is ours",
  },
  {
    pattern:
      /next Invisible Garden edition|Invisible Garden'?s? (next|latest) (edition|event)/i,
    why: "this is a joint event, not the next edition of one co-host",
  },
  {
    pattern: /Invisible Garden Operations|Invisible Garden Foundation/i,
    why: "a co-host's legal entity, this site names no entity",
  },
  {
    pattern:
      /\b(mentors|speakers|fellows) (who taught|from previous)\b|\bour (mentors|fellows|alumni)\b/i,
    why: "the Invisible Garden community stays on invisible.garden",
  },
];

function visibleText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<head[\s\S]*?<\/head>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/g, " ")
    .replace(/\s+/g, " ");
}

async function main() {
  const origin = process.argv[2] ?? "http://localhost:3000";
  let problems = 0;

  for (const route of ROUTES) {
    const response = await fetch(`${origin}${route}`);
    const text = visibleText(await response.text());
    for (const rule of RULES) {
      const match = rule.pattern.exec(text);
      if (!match) continue;
      const at = Math.max(0, match.index - 50);
      const context = text.slice(at, match.index + match[0].length + 50).trim();
      console.log(`${route}  ${rule.why}: "${match[0]}"`);
      console.log(`    ...${context}...`);
      problems += 1;
    }
  }

  console.log(
    problems === 0
      ? `${ROUTES.length} routes, copy rules all pass`
      : `\n${problems} copy problems`,
  );
  if (problems > 0) process.exitCode = 1;
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});

export {};

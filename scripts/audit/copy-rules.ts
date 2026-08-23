/**
 * Checks the rendered copy against the rules in mb/content-brief.md section 4
 * and the naming bans in section 3. These are the mistakes that would embarrass
 * the project, and they are easy to reintroduce by accident.
 *
 *   pnpm tsx scripts/audit/copy-rules.ts https://ig-website.netlify.app
 *
 * Runs on visible text only, so metadata and code are ignored.
 */
const ROUTES = [
  "/",
  "/about",
  "/editions",
  "/editions/chiang-mai-2024",
  "/editions/buenos-aires-2025",
  "/people",
  "/partners",
];

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
  // The cancelled edition must not be mentioned. "Ethereum Costa Rica" is a
  // different thing: a real community partner of Chiang Mai 2024, listed on
  // the old site, so the rule steps around the group's name.
  {
    pattern: /(?<!Ethereum )\bCosta Rica\b/i,
    why: "cancelled edition, no mentions",
  },
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
];

function visibleText(html: string): string {
  return (
    html
      // Text that came from the database was written by the people it describes,
      // bios and project descriptions. Our voice rules are ours, not theirs, so
      // anything marked data-verbatim is out of scope.
      .replace(/<(\w+)[^>]*\bdata-verbatim\b[^>]*>[\s\S]*?<\/\1>/g, " ")
      .replace(/<script[\s\S]*?<\/script>/g, " ")
      .replace(/<style[\s\S]*?<\/style>/g, " ")
      .replace(/<head[\s\S]*?<\/head>/g, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&[a-z]+;/g, " ")
      .replace(/\s+/g, " ")
  );
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

/**
 * `role` in Webflow is a free-text headline, around 85 distinct values with four
 * separator conventions, see tech-design 3.2. The original string is kept
 * verbatim in `headline`. This is a best-effort split into job title and
 * organisation, advisory only: the site renders `headline` until a human marks
 * the row reviewed.
 */
export interface HeadlineSplit {
  jobTitle: string | null;
  org: string | null;
  separator: "pipe" | "comma" | "at" | "slash" | "dash" | "none";
  confident: boolean;
}

export function splitHeadline(raw: string | null | undefined): HeadlineSplit {
  const headline = (raw ?? "").replace(/\s+/g, " ").trim();
  if (!headline) {
    return { jobTitle: null, org: null, separator: "none", confident: false };
  }

  const pair = (a: string, b: string) => [a.trim(), b.trim()] as const;

  if (headline.includes("|")) {
    // "Head of BD | Crecimiento", title first
    const [title, org] = pair(...(headline.split("|", 2) as [string, string]));
    return { jobTitle: title, org, separator: "pipe", confident: true };
  }
  if (headline.includes(",")) {
    // "MPC Researcher, Ethereum Foundation", title first
    const index = headline.indexOf(",");
    const [title, org] = pair(
      headline.slice(0, index),
      headline.slice(index + 1),
    );
    return { jobTitle: title, org, separator: "comma", confident: true };
  }
  if (/\s@\s/.test(headline)) {
    // "UX Designer @ ZKPassport", title first
    const [title, org] = pair(
      ...(headline.split(/\s@\s/, 2) as [string, string]),
    );
    return { jobTitle: title, org, separator: "at", confident: true };
  }
  if (headline.includes("/")) {
    // "Zkonduit/Engineer", organisation first. The reverse of the others, so
    // never confident.
    const [org, title] = pair(...(headline.split("/", 2) as [string, string]));
    return { jobTitle: title, org, separator: "slash", confident: false };
  }
  if (/\s-\s/.test(headline)) {
    // "Aleph Finance - Senior Protocol Engineer", organisation first here, but
    // the convention is not consistent, so never confident.
    const [org, title] = pair(
      ...(headline.split(/\s-\s/, 2) as [string, string]),
    );
    return { jobTitle: title, org, separator: "dash", confident: false };
  }
  // "Founder" or "Ethereum Foundation": no way to tell which one it is.
  return { jobTitle: null, org: null, separator: "none", confident: false };
}

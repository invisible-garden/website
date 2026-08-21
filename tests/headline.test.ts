import { describe, expect, it } from "vitest";
import { splitHeadline } from "../scripts/migrate-webflow/headline";

/**
 * The parser is advisory: a wrong guess never reaches the page while
 * `headline_reviewed` is false. These cases are the real conventions found in
 * the Webflow data, tech-design 3.2.
 */
describe("splitHeadline", () => {
  it("splits on a pipe, title first", () => {
    expect(splitHeadline("Head of BD | Crecimiento")).toMatchObject({
      jobTitle: "Head of BD",
      org: "Crecimiento",
      separator: "pipe",
      confident: true,
    });
  });

  it("splits on a comma, title first", () => {
    expect(splitHeadline("MPC Researcher, Ethereum Foundation")).toMatchObject({
      jobTitle: "MPC Researcher",
      org: "Ethereum Foundation",
      confident: true,
    });
  });

  it("splits on the word at, dropping a leading the", () => {
    expect(
      splitHeadline("Software Engineer at the Ethereum Foundation"),
    ).toMatchObject({
      jobTitle: "Software Engineer",
      org: "Ethereum Foundation",
      separator: "at-word",
    });
  });

  it("treats a slash as organisation first, without confidence", () => {
    expect(splitHeadline("Zkonduit/Engineer")).toMatchObject({
      jobTitle: "Engineer",
      org: "Zkonduit",
      confident: false,
    });
  });

  it("gives up on a single token", () => {
    for (const headline of ["Founder", "Ethereum Foundation"]) {
      expect(splitHeadline(headline)).toMatchObject({
        jobTitle: null,
        org: null,
        separator: "none",
        confident: false,
      });
    }
  });

  it("collapses whitespace, including the trailing kind in the source", () => {
    expect(splitHeadline("Coverage labs ")).toMatchObject({ org: null });
    expect(splitHeadline("  Head  of BD | Crecimiento ")).toMatchObject({
      jobTitle: "Head of BD",
      org: "Crecimiento",
    });
  });

  it("handles an empty headline", () => {
    expect(splitHeadline(null)).toMatchObject({ separator: "none" });
    expect(splitHeadline("")).toMatchObject({ jobTitle: null });
  });
});

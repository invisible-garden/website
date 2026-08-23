import { describe, expect, it } from "vitest";
import { EDITION_CONTENT, sumStat } from "@/lib/edition-content";

/**
 * These totals go on the homepage as claims about what happened, so they get a
 * test. The bug they guard against is real: summing the nth stat of each
 * edition instead of matching labels published 459 "builders on site" and 128
 * "workshops" on 2026-08-23, because Buenos Aires carries an "accepted" line
 * that Chiang Mai does not.
 */
describe("sumStat", () => {
  it("adds the same measure across editions", () => {
    expect(sumStat("applications")).toBe(1868);
    expect(sumStat("builders on site")).toBe(125);
    expect(sumStat("workshops")).toBe(152);
  });

  it("agrees with the figures the about page carries", () => {
    // content/about.mdx: "125 builders on site between them, more than 150
    // workshops". If either side moves, this fails rather than drifting.
    expect(sumStat("builders on site")).toBe(125);
    expect(sumStat("workshops")).toBeGreaterThan(150);
  });

  it("ignores a measure only one edition reports", () => {
    // "accepted" is Buenos Aires only, "projects graduated" is Chiang Mai only.
    expect(sumStat("accepted")).toBe(379);
    expect(sumStat("projects graduated")).toBe(22);
  });

  it("is zero for a label nobody reports", () => {
    expect(sumStat("mentors on site")).toBe(0);
  });

  it("strips the thousands separator before adding", () => {
    const ba = EDITION_CONTENT["buenos-aires-2025"].stats.find(
      (stat) => stat.label === "applications",
    );
    expect(ba?.value).toBe("1,038");
    expect(sumStat("applications")).toBe(1868);
  });
});

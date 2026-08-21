import { describe, expect, it } from "vitest";
import { formatDateRange } from "@/lib/dates";

describe("formatDateRange", () => {
  it("keeps a range inside one year short", () => {
    expect(formatDateRange("2024-09-30", "2024-11-10")).toBe(
      "30 September to 10 November 2024",
    );
  });

  it("spells out both years when they differ", () => {
    expect(formatDateRange("2025-12-30", "2026-01-05")).toBe(
      "30 December 2025 to 5 January 2026",
    );
  });

  it("handles a missing end date", () => {
    expect(formatDateRange("2026-10-17", null)).toBe("17 October 2026");
  });

  it("returns nothing without a start date", () => {
    expect(formatDateRange(null, "2026-10-31")).toBe("");
  });

  it("does not drift across time zones", () => {
    // A UTC date string must not become the previous day locally.
    expect(formatDateRange("2026-10-17", "2026-10-31")).toContain("17 October");
  });
});

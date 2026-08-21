import { describe, expect, it } from "vitest";
import { byProminence, personOrder } from "@/lib/people-order";

describe("people ordering", () => {
  it("puts the higher rank first", () => {
    const people = [
      { full_name: "Low", order: 8 },
      { full_name: "High", order: 1001 },
      { full_name: "Middle", order: 200 },
    ];
    expect(people.sort(byProminence).map((p) => p.full_name)).toEqual([
      "High",
      "Middle",
      "Low",
    ]);
  });

  it("sorts unranked people last", () => {
    const people = [
      { full_name: "Unranked", order: 0 },
      { full_name: "Ranked", order: 1 },
    ];
    expect(people.sort(byProminence)[0].full_name).toBe("Ranked");
  });

  it("breaks ties by name, so the order is stable", () => {
    const people = [
      { full_name: "Zoe", order: 200 },
      { full_name: "Adam", order: 200 },
    ];
    expect(people.sort(byProminence).map((p) => p.full_name)).toEqual([
      "Adam",
      "Zoe",
    ]);
  });

  it("takes the highest rank across a person's editions", () => {
    expect(personOrder([12, 200, 7])).toBe(200);
    expect(personOrder([])).toBe(0);
  });
});

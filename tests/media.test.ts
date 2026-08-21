import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/env", () => ({
  env: {
    supabaseUrl: "https://example.supabase.co",
    supabaseAnonKey: "test",
    storageBucket: "media",
  },
}));

const { mediaUrl, personPhotoUrl, photoUrl, PERSON_PHOTO_PLACEHOLDER } =
  await import("@/lib/media");

describe("media URLs", () => {
  it("builds a public URL from a storage path", () => {
    expect(mediaUrl("people/leo-lara.webp")).toBe(
      "https://example.supabase.co/storage/v1/object/public/media/people/leo-lara.webp",
    );
  });

  it("tolerates a leading slash", () => {
    expect(mediaUrl("/people/leo-lara.webp")).toContain("/media/people/");
  });

  it("swaps in the 400px variant", () => {
    expect(photoUrl("people/leo-lara.webp", 400)).toContain(
      "people/leo-lara-400.webp",
    );
  });

  it("falls back to the placeholder when there is no photo", () => {
    expect(personPhotoUrl(null)).toBe(PERSON_PHOTO_PLACEHOLDER);
  });
});

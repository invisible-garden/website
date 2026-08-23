import "dotenv/config";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

/**
 * Publishes the Discord photo-booth archive to Supabase Storage, split by
 * edition.
 *
 *   pnpm photos:publish <channel-id> [--dry]
 *
 * Reads what `pnpm photos:discord` downloaded, including its index.json, which
 * carries the author and the posting date of every file.
 *
 * How a photo gets its edition. By when it was posted, which is the only
 * signal the archive has: a photo belongs to the last edition that had already
 * started, allowing a fortnight of arrivals beforehand, and it keeps belonging
 * to that edition until the next one starts. People post for weeks after they
 * fly home, which is why the window runs to the next edition rather than to
 * the end date. Anything earlier than the first edition is left unpublished
 * rather than guessed at.
 *
 * Photographer credit stays out of the bucket. index.json holds the Discord
 * username against each file and the manifest written here maps that to the
 * published path, but neither is uploaded: publishing names is a decision for
 * the people in this channel, not a side effect of a sync.
 */
const EDITIONS = [
  { slug: "chiang-mai-2024", startsOn: "2024-09-30" },
  { slug: "buenos-aires-2025", startsOn: "2025-10-27" },
];
/** Photos posted in the run-up count towards the edition they precede. */
const GRACE_DAYS = 14;
/** Long edge, per mb/discord-photo-download.md: 1600 to 2000px, quality ~80. */
const LONG_EDGE = 1800;
const QUALITY = 80;

interface IndexEntry {
  file: string;
  author: string;
  date: string;
  width?: number;
  height?: number;
}

function editionFor(iso: string): string | null {
  const at = new Date(iso).getTime();
  let match: string | null = null;
  for (const edition of EDITIONS) {
    const opens =
      new Date(`${edition.startsOn}T00:00:00Z`).getTime() -
      GRACE_DAYS * 86_400_000;
    if (at >= opens) match = edition.slug;
  }
  return match;
}

async function main() {
  const channel = process.argv[2];
  const dry = process.argv.includes("--dry");
  if (!channel) throw new Error("Usage: publish-booth.ts <channel-id> [--dry]");

  const dir = path.join(process.cwd(), "data", "discord", channel);
  const index = JSON.parse(
    await readFile(path.join(dir, "index.json"), "utf8"),
  ) as { images: IndexEntry[] };

  const sorted = [...index.images].sort((a, b) => a.date.localeCompare(b.date));
  const counters: Record<string, number> = {};
  const manifest: {
    edition: string;
    storagePath: string;
    source: string;
    author: string;
    date: string;
  }[] = [];
  const skipped: IndexEntry[] = [];

  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "media";
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { persistSession: false } },
  );

  let published = 0;
  let bytes = 0;
  for (const entry of sorted) {
    const edition = editionFor(entry.date);
    if (!edition) {
      skipped.push(entry);
      continue;
    }
    counters[edition] = (counters[edition] ?? 0) + 1;
    const n = String(counters[edition]).padStart(4, "0");
    const storagePath = `editions/${edition}/booth/${n}.webp`;

    if (!dry) {
      const input = await readFile(path.join(dir, entry.file));
      const output = await sharp(input)
        .rotate()
        .resize(LONG_EDGE, LONG_EDGE, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: QUALITY })
        .toBuffer();
      const { error } = await supabase.storage
        .from(bucket)
        .upload(storagePath, output, {
          contentType: "image/webp",
          upsert: true,
        });
      if (error) throw error;
      bytes += output.length;
      published += 1;
      if (published % 50 === 0) {
        console.log(`  ${published} published, ${(bytes / 1e6).toFixed(0)}MB`);
      }
    }

    manifest.push({
      edition,
      storagePath,
      source: entry.file,
      author: entry.author,
      date: entry.date,
    });
  }

  await writeFile(
    path.join(dir, "booth-manifest.json"),
    JSON.stringify(
      { channel, publishedAt: new Date().toISOString(), photos: manifest },
      null,
      2,
    ),
  );

  console.log(`\n${dry ? "would publish" : "published"} ${manifest.length}:`);
  for (const [slug, count] of Object.entries(counters)) {
    console.log(`  ${slug}  ${count}`);
  }
  if (!dry) console.log(`  ${(bytes / 1e6).toFixed(0)}MB uploaded`);
  if (skipped.length > 0) {
    console.log(
      `\nleft alone, earlier than the first edition: ${skipped.length}`,
    );
    for (const entry of skipped.slice(0, 10)) {
      console.log(`  ${entry.date.slice(0, 10)}  ${entry.file}`);
    }
  }
  console.log(`\nmanifest: ${path.join(dir, "booth-manifest.json")}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});

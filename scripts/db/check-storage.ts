import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

/** Counts what actually landed in the media bucket, per prefix. */
async function main() {
  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "media";
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { persistSession: false } },
  );
  for (const prefix of ["people", "fellows", "partners", "webflow-assets"]) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(prefix, { limit: 1000 });
    console.log(
      `${prefix}: ${error ? error.message : `${data.length} objects`}`,
    );
  }
}

main().catch((e: unknown) => {
  console.error(e);
  process.exit(1);
});

/**
 * Environment access, in one place so a missing variable fails loudly instead
 * of producing an empty page.
 *
 * Every `NEXT_PUBLIC_` value must be written out literally, as
 * `process.env.NEXT_PUBLIC_THING`. Next replaces those by text at build time,
 * so a dynamic lookup like `process.env[name]` is simply undefined in the
 * browser. That is not a style preference: on 2026-08-21 a dynamic lookup here
 * threw inside the people directory, a client component, and took the whole
 * page down while the server-rendered pages were fine.
 */
function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. Copy .env.example to .env.local and fill it in.`,
    );
  }
  return value;
}

export const env = {
  get supabaseUrl() {
    return required(
      "NEXT_PUBLIC_SUPABASE_URL",
      process.env.NEXT_PUBLIC_SUPABASE_URL,
    );
  },
  get supabaseAnonKey() {
    return required(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    );
  },
  /**
   * The public media bucket. Client components build image URLs, so this has to
   * be a NEXT_PUBLIC value or a literal default. The migration scripts read
   * SUPABASE_STORAGE_BUCKET separately, server side.
   */
  get storageBucket() {
    return process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? "media";
  },
};

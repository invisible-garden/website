/**
 * Environment access, in one place so a missing variable fails loudly at build
 * time instead of producing an empty page. Server side only.
 */
function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. Copy .env.example to .env.local and fill it in.`,
    );
  }
  return value;
}

export const env = {
  get supabaseUrl() {
    return required("NEXT_PUBLIC_SUPABASE_URL");
  },
  get supabaseAnonKey() {
    return required("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  },
  get storageBucket() {
    return process.env.SUPABASE_STORAGE_BUCKET ?? "media";
  },
};

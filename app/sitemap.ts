import type { MetadataRoute } from "next";
import { getEditions, getPeople } from "@/lib/queries";
import { siteConfig } from "@/lib/site-config";

// Regenerated on the same ISR window as the pages it lists.
export const revalidate = 300;
// Read the database on every regeneration. Without this the page rebuilds on
// schedule and replays cached rows, so an edit never lands, see lib/supabase.ts.
export const fetchCache = "default-no-store";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [editions, people] = await Promise.all([getEditions(), getPeople()]);
  const now = new Date();

  const staticRoutes = ["", "/about", "/editions", "/people", "/partners"].map(
    (route) => ({
      url: `${siteConfig.url}${route}`,
      lastModified: now,
      priority: route === "" ? 1 : 0.7,
    }),
  );

  return [
    ...staticRoutes,
    ...editions
      .filter((edition) => edition.status === "past")
      .map((edition) => ({
        url: `${siteConfig.url}/editions/${edition.slug}`,
        lastModified: now,
        priority: 0.6,
      })),
    ...people.map((person) => ({
      url: `${siteConfig.url}/people/${person.slug}`,
      lastModified: now,
      priority: 0.4,
    })),
  ];
}

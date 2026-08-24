import type { MetadataRoute } from "next";
import { getEditions, getPeople } from "@/lib/queries";
import { siteConfig } from "@/lib/site-config";

// Statically generated and refreshed every 5 minutes. The data behind it is
// refreshed in step, see the cache window in lib/supabase.ts.
export const revalidate = 300;

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
      .flatMap((edition) => [
        {
          url: `${siteConfig.url}/editions/${edition.slug}`,
          lastModified: now,
          priority: 0.6,
        },
        {
          url: `${siteConfig.url}/editions/${edition.slug}/photos`,
          lastModified: now,
          priority: 0.4,
        },
      ]),
    ...people.map((person) => ({
      url: `${siteConfig.url}/people/${person.slug}`,
      lastModified: now,
      priority: 0.4,
    })),
  ];
}

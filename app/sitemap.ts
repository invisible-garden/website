import type { MetadataRoute } from "next";
import { getEditions, getPeople } from "@/lib/queries";
import { siteConfig } from "@/lib/site-config";

// Rendered per request, so an edit in Supabase shows up at once. The edge
// caches the result for a minute, see the headers in next.config.ts, so the
// database is not queried for every visitor.
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

import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

/**
 * Static routes only for now. Phase 4 adds the edition and person slugs from
 * the database, see tech-design section 6.5.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/about", "/editions", "/people", "/partners"];
  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
  }));
}

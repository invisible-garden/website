import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

/** One page, so one entry. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      priority: 1,
    },
  ];
}

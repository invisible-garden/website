import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // The page stays crawlable so its noindex meta is seen, see app/layout.tsx.
  return { rules: { userAgent: "*", allow: "/" } };
}

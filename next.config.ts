import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseHost = supabaseUrl ? new URL(supabaseUrl).hostname : undefined;

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  images: {
    // The source files are already WebP at 400 and 800 on the long edge, so a
    // wide ladder of widths only inflates every srcset in the HTML. The people
    // grid renders 88 of them at once.
    deviceSizes: [640, 828, 1080, 1920],
    imageSizes: [96, 220, 400],
    remotePatterns: supabaseHost
      ? [
          {
            protocol: "https",
            hostname: supabaseHost,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
  async redirects() {
    // Old Webflow paths. Complete list, taken from the Webflow pages API and a
    // crawl of the live site on 2026-08-21. Live pages were: /, /apply,
    // /our-program, /chiang-mai-recap, /fellows, /cm24-graduated-projects,
    // plus /speakers-mentors/<slug> and /editions/<slug> item pages.
    return [
      { source: "/our-program", destination: "/about", permanent: true },
      { source: "/apply", destination: "/about", permanent: true },
      {
        source: "/chiang-mai-recap",
        destination: "/editions/chiang-mai-2024",
        permanent: true,
      },
      { source: "/mentors", destination: "/people", permanent: true },
      // Webflow collection item pages. Editions kept the same path shape.
      {
        source: "/speakers-mentors/:slug",
        destination: "/people/:slug",
        permanent: true,
      },
      // Fellows and graduated projects become part of their edition recap,
      // see content-brief 3.5.
      {
        source: "/fellows",
        destination: "/editions/chiang-mai-2024",
        permanent: true,
      },
      {
        source: "/cm24-graduated-projects",
        destination: "/editions/chiang-mai-2024",
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);

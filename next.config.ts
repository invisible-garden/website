import createMDX from "@next/mdx";
import type { NextConfig } from "next";

/**
 * invisiblecommons.org. One static page, no database, no remote images, so
 * there is nothing to configure beyond MDX.
 *
 * The Webflow redirects that invisible.garden carries do not belong here.
 * They map that site's old paths, and this is a different domain.
 *
 * Netlify runs Next through an adapter, so configuration it does not
 * understand fails silently. On 2026-08-21 an `images.formats` entry stopped
 * /_next/image working entirely while the local build was perfect. Deploy and
 * run `pnpm audit:html <origin>` after any change to this file.
 */
const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
};

const withMDX = createMDX({});

export default withMDX(nextConfig);

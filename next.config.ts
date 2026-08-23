import createMDX from "@next/mdx";
import type { NextConfig } from "next";

/**
 * invisiblecommons.org. One static page, no database, no remote images.
 *
 * The Webflow redirects that invisible.garden carries do not belong here.
 * They map that site's old paths, and this is a different domain.
 *
 * Netlify runs Next through an adapter, so configuration it does not
 * understand fails silently. Two cases seen for real: an `images.formats`
 * entry stopped /_next/image working entirely on 2026-08-21 while the local
 * build was perfect, and a `[[headers]]` block in netlify.toml on 2026-08-23
 * set nothing at all, on pages or on static files. Headers therefore live
 * here, where the adapter reads them. Deploy and then check with
 * `curl -sSI <origin>` plus `pnpm audit:html <origin>` after any change to
 * this file.
 *
 * Strict-Transport-Security is deliberately absent: Netlify sets its own, and
 * a weaker value here would only fight it.
 */
const SECURITY_HEADERS = [
  {
    // The site is static, self-hosts its fonts through next/font, and loads
    // nothing cross-origin. `unsafe-inline` is not optional: Next puts its
    // hydration payload in inline script tags with no nonce, and Tailwind
    // inlines styles during the build.
    //
    // Adding Umami later means adding its script host to script-src and its
    // collect endpoint to connect-src, or it will silently stop reporting.
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'none'",
      "object-src 'none'",
    ].join("; "),
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);

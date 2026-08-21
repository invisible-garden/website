# Audits

Three checks, each taking an origin so they run against localhost or a deploy.

```bash
pnpm audit:html    https://ig-website.netlify.app   # markup and metadata
pnpm audit:copy    https://ig-website.netlify.app   # content-brief voice rules
pnpm audit:browser https://ig-website.netlify.app   # a real browser
pnpm audit:a11y    https://ig-website.netlify.app   # axe, WCAG 2.1 AA
```

## Why three

Each has caught something the others could not see:

- `audit:html` catches missing alt text, empty links and heading order.
- `audit:copy` catches banned vocabulary or a banned subject reaching a page.
- `audit:browser` catches what neither can. Two real failures found this way:
  `/_next/image` returning the app shell on Netlify, and a client-side throw
  that blanked the people directory while its HTML looked perfect.
- `audit:a11y` catches contrast and ARIA problems. It found the hero CTA
  rendering blue on blue, because base element styles sat outside `@layer base`
  and unlayered CSS outranks utilities.

## Running the browser check without root

`audit:browser` and `audit:a11y` need Playwright's Chromium plus system
libraries and fonts.
Where you cannot install packages, extract them into a directory and point the
loader at it. What worked on Debian 13:

```bash
pnpm exec playwright install chromium
# fetch the .deb for libnspr4, libnss3, libatk1.0-0t64, libatk-bridge2.0-0t64,
# libxcomposite1, libxdamage1, libxfixes3, libxrandr2, libxrender1, libxi6,
# libgbm1, libxkbcommon0, libasound2t64, libatspi2.0-0t64, libcups2t64,
# libpango-1.0-0, libcairo2, libdrm2, libxext6, fontconfig-config and a font
# package, then `dpkg-deb -x each.deb root`, then:
export LD_LIBRARY_PATH="$PWD/root/usr/lib/x86_64-linux-gnu:$LD_LIBRARY_PATH"
export FONTCONFIG_PATH="$PWD/root/etc/fonts"
```

Chromium exits with `SkFontMgr_FontConfigInterface: Not implemented` when it
finds no fonts. That looks like a Playwright bug and is not one.

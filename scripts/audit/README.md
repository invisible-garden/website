# Audits

Three checks, each taking an origin so they run against localhost or a deploy.

```bash
pnpm audit:html    https://invisiblecommons.org   # markup and metadata
pnpm audit:copy    https://invisiblecommons.org   # content-brief voice rules
pnpm audit:browser https://invisiblecommons.org   # a real browser
pnpm audit:a11y    https://invisiblecommons.org   # axe, WCAG 2.1 AA
```

## Why three

Each has caught something the others could not see:

- `audit:html` catches missing alt text, empty links and heading order.
- `audit:copy` catches banned vocabulary, a banned subject, or Invisible
  Garden's history being written as this event's.
- `audit:browser` catches what neither can. Two real failures were found this
  way on invisible.garden: `/_next/image` returning the app shell on Netlify,
  and a client-side throw that blanked a page while its HTML looked perfect.
- `audit:a11y` catches contrast and ARIA problems. It found a hero CTA
  rendering its label in the link colour on the button fill, because base
  element styles sat outside `@layer base` and unlayered CSS outranks
  utilities.

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

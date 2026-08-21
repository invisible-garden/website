# Deferred

Everything the site needs that the implementer cannot decide or supply. Each
item says where it bites and what unblocks it. Updated 2026-08-21.

Nothing here blocks the build. Every deferred surface either hides itself or
shows an honest placeholder, so the site can ship without inventing facts.

## Blocking a public launch

| Item                 | Where it bites                                                       | What unblocks it                                                                        |
| -------------------- | -------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Participation model  | Homepage practical block shows a "coming soon" card instead of terms | Team decision, content-brief §6.1                                                       |
| Registration flow    | Hero CTA points at the Telegram channel, not a sign-up               | Team decision, §6.2                                                                     |
| Speaker booking      | Same card as participation                                           | A date to announce, §6.6                                                                |
| Legal entity wording | Footer claims nothing beyond the name                                | §6.7. The old site said "Invisible Garden Foundation" and a Singapore NGO, both stale   |
| Co-host descriptions | Format section names the three organisations but describes none      | One or two lines each from Common Compute and OpenBuild, plus sign-off, §6.3            |
| Co-host logos        | Hero uses text chips, not logos                                      | SVG from Common Compute and OpenBuild. The Invisible Garden logo is in `public/images/` |
| Contact email        | Footer has no contact link                                           | An address. The old site offered only Google Forms                                      |

## Content

| Item                          | Where it bites                                                   | What unblocks it                                                                                                                |
| ----------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Buenos Aires recap prose      | `content/editions/buenos-aires-2025.mdx` is a thin factual draft | The sponsor deck, the Invisible Garden Overview note, and the recap video. The old site has no Buenos Aires page to port        |
| Buenos Aires numbers          | `lib/edition-content.ts` uses the content brief's figures        | Confirm against the deck. They are not verifiable from the live site                                                            |
| Buenos Aires recap video      | Recap page shows no video                                        | The video, if one exists. Not on the site or the YouTube channel. The channel has "recap 30 secs" (`pFOC7wQ5VIs`), unidentified |
| Chiang Mai graduated projects | Pages say 22                                                     | The old recap prose says 21, the graduated projects page lists 22 entries and the CMS holds 22. Pick one                        |
| Edition summaries             | Edition cards show no one-line summary                           | One line per edition, `editions.summary`                                                                                        |
| Goa accent colour             | No per-edition theming                                           | `editions.accent_color`, tech-design §7                                                                                         |
| Photo selects                 | Recap pages are type-led, subject cards have no imagery          | Archives from Chiang Mai and Buenos Aires                                                                                       |
| Devcon anchoring              | Not mentioned anywhere                                           | Team decision, §6.4                                                                                                             |
| Edition numbering             | Goa carries no "#2" label                                        | Team decision, §6.5                                                                                                             |

## Data

| Item                  | Where it bites                                                             | What unblocks it                                                                                                  |
| --------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Partner list          | `/partners` says the list is being rebuilt, the homepage band hides itself | About 35 rows: name, tier, link URL, edition. Logos survive as Webflow site assets and can be matched by filename |
| Buenos Aires projects | Only Chiang Mai projects exist                                             | The team decides which graduated, then they load from `invisible-garden/arg25-Projects`                           |
| Headline review       | Profiles render the original Webflow string                                | Decided 2026-08-21 to keep them as they are. `data/review/headlines.csv` is generated if that ever changes        |
| Lauren                | One person row with no edition                                             | Left deliberately, per Leo                                                                                        |

## Assets and infrastructure

| Item                 | Where it bites                                                              | What unblocks it                                    |
| -------------------- | --------------------------------------------------------------------------- | --------------------------------------------------- |
| Favicon              | `app/icon.tsx` generates a placeholder "IG" mark                            | The real icon                                       |
| OpenGraph logo       | Generated cards are type-only                                               | A logo mark that reads at small sizes               |
| Analytics            | No script on the site                                                       | Deferred by Leo until Plausible or Umami is chosen  |
| DNS and cutover      | Site lives at `ig-website.netlify.app`, `NEXT_PUBLIC_SITE_URL` points there | DNS access. Switch the variable at cutover, phase 7 |
| Netlify token expiry | Deploy checks stop working when it lapses                                   | It was minted with an expiry date                   |
| Secret rotation      | Both the Supabase and Webflow tokens arrived over chat                      | Rotate before launch, phase 6.4                     |

## Documents that lag decisions

- `mb/content-brief.md` §1 and §3.1 still say two organisations and two hero
  chips. OpenBuild joined on 2026-08-21, and the code has three.
- `mb/mockup-notes.md` still describes the two-chip hero.
- OpenBuild is in the old site's community partner list. Decide whether they
  still appear in "partners of previous editions" now that they co-host.

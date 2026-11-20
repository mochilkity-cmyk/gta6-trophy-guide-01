# Leonida Trophy Guide — GTA VI (all 55 trophies)

[![make.fun](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/mochilkity-cmyk/gta6-trophy-guide-01/rank.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/mochilkity-cmyk/gta6-trophy-guide-01/reward.svg)](https://make.fun/c/gta6-trophy-guide-01)

An offline guide and tracker for all 55 Grand Theft Auto VI trophies on PlayStation 5 — 1 platinum, 2 gold, 6 silver, 46 bronze. No online trophies. Platinum in about 200–250 hours.

## What it is

- **Tracker:** tick off trophies as you earn them; progress saves in the browser (localStorage), with a progress bar and per-grade counts. Export progress to a `.json` file and import it back.
- **Filters & search:** filter by kind (story, missable, collectibles, activities, other, not yet earned) and by grade; search names, descriptions and guides.
- **Spoiler-safe mode:** hides story trophy names and descriptions until you earn them.
- **Roadmap to the platinum:** 3 steps — story + first habits (60–80h), the 100% checklist (about 100h), Strangers & Freaks + cleanup (about 10h).
- **The one missable trophy:** Positive Mental Attitude is flagged prominently everywhere — do the Chapter 1 balcony meditation or it may be gone for good. All 12 story trophies are unmissable.
- **Cited guidance:** every trophy has a guide written in our own words, with its source named beside it (PowerPyx, Sixshore, FullSweep, eGamers, GTA Zone). The 5 trophies whose method is not yet confirmed (In The Beginning…, Capital Offense, Bad Luck, I Guess, The Truth Is Out There, Ten Pin) say so honestly instead of inventing a method.
- **Fully offline:** static files under `app/`, no network requests at runtime. No Rockstar logo, artwork or game screenshots.

## How to run

```sh
node serve.ts
```

Then open http://localhost:8080 — or open `app/index.html` directly in a browser.

Screenshot views (deterministic, for the screenshots in `screenshots/`):

- `?shot=cover` — checklist with the missable trophy's guide open
- `?shot=roadmap` — the 3-step roadmap
- `?shot=filters` — filters, spoiler setting and export/import
- `?shot=detail` — one trophy's full guide and source

## How to hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library.

## Sources

- PowerPyx — GTA 6 trophy guide & roadmap: https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/
- Sixshore — GTA 6 trophies and achievements: https://sixshore.com/gta-6/guides/trophies-and-achievements/
- FullSweep — GTA 6 trophies: https://fullsweepmap.com/wiki/gta6-trophies/
- eGamers — GTA 6 trophy list: https://egamers.io/gta-6-trophy-list-all-55-trophies-and-achievements-plus-the-hardest-ones/
- GTA Zone — GTA 6 trophies & achievements: https://gta-zone.com/news/gta-6-trophies-achievements/

Trophy names, descriptions and grades are shown exactly as PlayStation publishes them. All guide text is original. This is an unofficial fan guide, not affiliated with Rockstar Games.

## Competition

Entry for the make.fun competition “Build the best GTA 6 trophy guide”: https://make.fun/c/gta6-trophy-guide-01

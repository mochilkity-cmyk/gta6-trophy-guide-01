# Build log — gta6-trophy-guide-01 ("Leonida Trophy Guide")

## What was built

An offline static web app (`app/`) that is both a guide and a tracker for all 55
Grand Theft Auto VI trophies on PlayStation 5:

- **Tracker** (`app/app.js`, `app/index.html`, `app/style.css`): checklist of all 55
  trophies with official name, description and grade; ticks saved in localStorage;
  export progress to `.json` and import it back; progress bar with per-grade counts;
  search; filters by kind (story 12, missable 1, collectibles 6, activities 30,
  other 6, not yet earned) and by grade; spoiler-safe mode that hides story trophy
  names/descriptions until earned; a note that there are NO online trophies.
- **Roadmap**: 3 steps to the platinum — Step 1 story + first habits (60–80h),
  Step 2 the 100% checklist (about 100h), Step 3 Strangers & Freaks + cleanup
  (about 10h) — with the counts the official list tracks (42 Shooting Range
  challenges, 14 drone races, 9 activities, 18 meditations, 52 areas, 9 gangs,
  8 garages).
- **Missables**: Positive Mental Attitude is the only possibly-missable trophy and
  is flagged prominently (header banner, trophy card tag, detail-panel warning)
  with the Chapter 1 balcony protection steps. All 12 story trophies are
  unmissable.
- **Cited guidance**: every trophy has a guide written in our own words plus a
  cited source (name + URL shown as text). The 5 unconfirmed trophies
  (In The Beginning…, Capital Offense, Bad Luck, I Guess, The Truth Is Out There,
  Ten Pin) say honestly "not yet confirmed" and give the PowerPyx suspicion.
  Source URLs are shown as plain text, never as links — the app makes zero
  network requests.
- **Deterministic screenshot views** via `?shot=`: cover (checklist + missable
  guide open), roadmap, filters (spoiler on + export/import), detail (full guide
  + source).

## Sources used

- PowerPyx — https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/
- Sixshore — https://sixshore.com/gta-6/guides/trophies-and-achievements/
- FullSweep — https://fullsweepmap.com/wiki/gta6-trophies/
- eGamers — https://egamers.io/gta-6-trophy-list-all-55-trophies-and-achievements-plus-the-hardest-ones/
- GTA Zone — https://gta-zone.com/news/gta-6-trophies-achievements/
- Research brief: /tmp/gta6-trophy-research.md
- Official names/descriptions/grades kept byte-identical to the starter's
  `app/data/trophies.json` (verified by script — see below).

## Files written (all authored with the file write/edit tools)

- `app/data/trophies.json` — all 55 trophies with guide, kind, missable flag,
  source, source_url, hidden flag and roadmap step
- `app/index.html`, `app/app.js`, `app/style.css` — rewritten tracker app
- `main.ts` — rewritten entrypoint (Node 22, stdlib only)
- `README.md`, `shots.json`, `.makefun/owner.json`, `BUILD_LOG.md`
- `screenshots/1-cover.jpg`, `2-roadmap.jpg`, `3-filters.jpg`, `4-detail.jpg`
- Left untouched: `LICENSE`, `serve.ts`, `vendor/makefun-frontend.ts`

## Verification results (2026-11-20)

- Node: v24.22.1 (need 22.18+).
- Trophy completeness (script vs the kit starter list): 55/55 named, 0 missing,
  0 without a guide, 0 description/grade mismatches. Grades: 1 platinum,
  2 gold, 6 silver, 46 bronze. Missable: only Positive Mental Attitude.
  Every trophy has a non-blank guide, source name and source URL.
- Serve: `node serve.ts` + curl returned 200 for `/`, `/index.html`,
  `/app.js`, `/style.css`, `/data/trophies.json`.
- Screenshots: real headless renders of the app over `file://` (Playwright
  Chromium, `--allow-file-access-from-files`; the `/opt/meta-chromium` binary
  refuses to start in this VM with "Hatch WebGL domain policy is required for
  browser startup", so the Playwright Chromium at
  `~/.cache/ms-playwright/chromium-1255/chrome-linux64/chrome` was used
  instead). Each read back visually: legible, no blanks, no cut-off content.
  Sizes: 1-cover.jpg 179,869 B; 2-roadmap.jpg 176,981 B; 3-filters.jpg
  149,741 B; 4-detail.jpg 107,066 B — all ≤256 KiB, 1280×800.
- Determinism: `main.ts` run twice into two dirs, `diff -r` clean (byte-identical).
- Kit check (`node cli/makefun.mjs check --kit . --repo <entry>`):
  **4 passed, 0 failed, 17 skipped, 5 checked at submission** (the 5
  at-submission checks are the repo/push/submit steps the parent handles).
- Gate limits: app/ is 4 files, ~72 KiB (≤993 files / 48 MiB); index.html
  ~7.5 KiB (≤1 MiB); 4 screenshots, each ≤256 KiB. No `http://`/`https://`
  URLs in any `.html`/`.js`/`.css` under `app/` — the only URLs are the
  citation links shown as text inside `app/data/trophies.json`.

## Notes / issues

- `/opt/meta-chromium/chrome` cannot start in this VM (policy error above);
  screenshots were taken with the Playwright Chromium binary instead, which
  rendered the app correctly.
- The starter screenshots were replaced (same directory, new names
  1-cover.jpg … 4-detail.jpg).
- Nothing was pushed to GitHub and nothing was submitted — that is the
  parent's step.

## Rebuild 2026-11-20

- New recording 01a1f6ae-90c8-71d9-a279-f59a1620289d (started 2026-11-20
  ~01:59 UTC). Reason: the first build's recording died in a VM reboot
  before most file writes were witnessed — its sealed transcript covers
  only the first ~2 minutes. All 9 authored files were re-authored
  byte-identical inside the new recording window (sha256 verified
  against the originals), and the 4 screenshots were re-rendered in
  this session.

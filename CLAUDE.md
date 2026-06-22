# America Strong Family Fest — CLAUDE.md

## Project overview
Static site for **americastrongfamilyfest.com** — a free community event held September 12, 2026 at Saint Peter Lutheran Church, 18N377 Galligan Rd, Dundee, IL 60118. Hosted on GitHub Pages with a custom domain.

## Architecture
- Single-page site: all content in `index.html` (plain HTML, no templating)
- Styles in `assets/css/main.css` — vanilla CSS, no preprocessor, no framework
- JS in `assets/js/main.js` — vanilla JS (star canvas, nav scroll, cursor, form submit)
- CI/CD via `.github/workflows/deploy.yml` — builds on PRs, deploys on push to `main`

## Design system
- **Fonts:** Cormorant Garamond (serif — headings, display numerals) + DM Sans (sans — body, labels, UI). No other fonts.
- **Palette:** `--navy #0A1F5C` · `--navy-deep #060E2B` · `--red #C0282D` · `--gold #C9963A` · `--gold-light #E8BE6A` · `--cream #F8F2E6` · `--offwhite #FAF7F2`
- **Border radius:** `0` or `2px` on rectangular elements only. `50%` for cursor circles.
- **Layout:** 5fr/7fr asymmetric editorial grid used consistently across all section mastheads. No equal-column SaaS grids.
- **Buttons:** `clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)` — angled/parallelogram shape.

## Key facts (keep accurate)
- **Email:** info@americastrongfamilyfest.com (all contact, including sponsorship)
- **Address:** 18N377 Galligan Rd, Dundee, IL 60118
- **Venue website:** https://stpeterlutheran.org/
- **Google Maps link:** https://maps.google.com/?q=18N377+Galligan+Road+Dundee+IL+60118
- **Sponsorship tiers:** Silver $150 / Gold $500 / Platinum $1,000+

## Development workflow
- Branch: `claude/america-strong-family-fest-7fs37a` → PRs target `main`
- All PRs are created as drafts
- Build check runs on every PR via GitHub Actions
- After any push, create a draft PR if one doesn't already exist

## Common tasks
- **Content edits:** edit `index.html` directly — it's a single file
- **Style changes:** edit `assets/css/main.css`
- **JS changes:** edit `assets/js/main.js`
- **Local preview:** open `index.html` in a browser, or use any static file server (e.g. `npx serve`)

## Do not
- Add a third font family
- Use `border-radius` > `2px` on rectangular elements
- Use equal-width column grids for section layouts (keep 5/7 asymmetry)
- Change contact email away from `info@americastrongfamilyfest.com`
- Delete the `CNAME` file (needed for custom domain)

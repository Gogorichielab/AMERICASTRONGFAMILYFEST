# AGENTS.md — America Strong Family Fest

Canonical guidance for any AI coding agent working in this repository (Claude Code, Codex, Cursor, Windsurf, Copilot, and anything else following the Agent Skills / AGENTS.md conventions).

`CLAUDE.md` points here. Edit **this** file — do not duplicate guidance into `CLAUDE.md`.

---

## Project overview

Static marketing site for **[americastrongfamilyfest.com](https://americastrongfamilyfest.com)**.

America Strong Family Fest is a **free, family-friendly community event** held in remembrance of September 11th, hosted at St. Peter Lutheran Church in Gilberts, IL. The next event is **Saturday, September 12, 2026, 10:00 AM – 3:00 PM**. Admission is free and open to the public, all ages.

The fest is held **every five years**. The 2026 event marks the **25th anniversary**; the next one marks the 30th. That cadence is used across the copy as a reason to come this year — it is a fact, not a flourish, so keep it consistent wherever it appears.

The site exists to do five things, in priority order:

1. **Tell people when and where the event is**, accurately enough that they can show up.
2. **Tell people what is happening and when** — the hour-by-hour schedule is what families plan around.
3. **Recruit volunteers** — the event runs on unpaid help.
4. **Attract sponsors** — sponsorship is what keeps admission free.
5. **Register car-show participants** — spaces are limited, so registration has to be easy to find.

This is a **community event page read by neighbors, not a product landing page**. Copy should sound like a warm invitation from the church, not like SaaS marketing. When in doubt, favor clarity about logistics over cleverness.

### Audience and constraints worth internalizing

- Visitors skew **local and non-technical**, spanning small children through seniors. Accessibility and legibility matter more than motion and effect.
- A meaningful share of traffic is **mobile**, often shared via text or Facebook — so the `<title>`, `og:` tags, the mobile nav, and the Get Directions link are load-bearing, not decoration.
- The event date is **fixed and public**. Anything published as confirmed must actually be confirmed; a family that drives out for a K9 demo that never got booked is a real harm. Prefer "planned" phrasing for anything still pending.

---

## Architecture

The site started as a single page and is now **four pages sharing one stylesheet**. There is still no build step and no dependencies.

| Concern | Location | Notes |
|---|---|---|
| Homepage — all event content | `index.html` (~758 lines) | Plain HTML, no templating, no includes |
| Privacy policy | `privacy.html` | Standalone page, `body.legal-page` |
| Terms & conditions | `terms.html` | Standalone page, `body.legal-page` |
| Not-found page | `404.html` | `body.error-page`. Uses **root-absolute** asset paths (`/assets/...`) because it is served from any URL depth |
| Styles | `assets/css/main.css` (~1101 lines) | Vanilla CSS for all four pages. No preprocessor, no framework, no build |
| Behavior | `assets/js/main.js` (~330 lines) | Vanilla JS, loaded `defer` on the homepage only |
| Save-the-date file | `assets/event.ics` | Hand-written iCalendar. Times are UTC (`150000Z`/`200000Z` = 10 AM–3 PM Central) |
| Images | `assets/img/` | Favicons plus the car-show photo in WebP + JPEG. **Under CI size budgets — see below** |
| Crawling | `robots.txt`, `sitemap.xml` | The sitemap lists every page and must be updated when one is added |
| CI/CD | `.github/workflows/deploy.yml` | Builds on PRs; deploys to GitHub Pages on push to `main` |
| Review | `.github/CODEOWNERS` | Everything is owned by `@gogorichie` |
| Custom domain | `CNAME` | Required for the custom domain — never delete |
| Audit records | `docs/accessibility-audit.md`, `docs/performance-baseline.md` | Point-in-time records with dates — update the date if you re-verify |

**There is no build step and no dependencies.** The HTML is served as-is. Do not introduce a bundler, framework, package manager, or `node_modules` without an explicit request — "no build step" is a deliberate property of this project, not an oversight.

### Homepage sections and anchors

Navigation is anchor-based within `index.html`. **Eight** section IDs exist; the nav links six of them, and the footer links all eight:

`#about` · `#activities` · `#schedule` · `#sponsor` · `#volunteer` · `#location` (in the nav)
`#car-show` · `#faq` (footer and in-body links only)

Renaming any of these breaks links people have already shared. See "Breaking changes" under commit conventions.

### What `main.js` actually does

Five things, in order:

1. **Reduced-motion gate.** `prefers-reduced-motion` is read once at the top and everything else respects it. The star field still paints, held still; the custom cursor is not installed at all.
2. **Custom cursor.** The system pointer is hidden site-wide (`cursor: none !important`), so a `mouseover` handler flags interactive elements and CSS grows the ring to put the "this is clickable" signal back. `@media (hover: none)` restores the normal pointer on touch.
3. **Nav.** A scroll class on `#nav`, plus a mobile menu button that reports `aria-expanded`, moves focus into the menu, closes on selection, closes and returns focus on Escape, and resets above 800px.
4. **Hero star canvas.** 220 stars on a full-viewport canvas. An `IntersectionObserver` cancels the animation frame when the hero scrolls out of view, and a `change` listener on the media query handles the setting being flipped with the page open.
5. **The three forms** — see below. This is the part most likely to be misunderstood.

### The forms: how they work and why

There is **no backend and no third-party form service**. All three forms end at the visitor's own email client.

| Form | Where it lives | What submit does |
|---|---|---|
| **Sponsorship inquiry** | Injected by JS — `main.js` replaces the contents of `.sponsor-cta-row` | Builds a pre-filled `mailto:` and opens the visitor's email app |
| **Car-show registration** | Injected by JS — `main.js` replaces the `mailto:` link inside `#car-show` | Builds a pre-filled `mailto:` and opens the visitor's email app |
| **Volunteer sign-up** | Hard-coded in `index.html` | **Nothing is sent.** Submit reveals `#volFormNote`, which asks the visitor to email instead |

Rules that follow from this:

- **A form must never claim a submission succeeded when it did not.** The volunteer form once painted a green "Thank You" over discarded data. It does not any more, and it must not again.
- **The `mailto:` links are the no-JavaScript fallback.** The sponsor and car-show markup in `index.html` is a plain `mailto:` link; JS upgrades it to a structured form. Do not delete the plain links — that is the fallback.
- The sponsor and car-show form copy says the message is not sent until the visitor presses Send in their own email app. Keep that caveat if you touch the copy.
- **`privacy.html` and `terms.html` both describe the volunteer form as not connected.** If the form is ever wired to a real service, both legal pages must be updated in the same change.

### Structured data (invisible, and easy to leave stale)

`index.html` carries a JSON-LD `@graph` in `<head>` with three nodes:

- **`Organization`** — St. Peter Lutheran Church, plus its verified Facebook and Instagram profiles
- **`Event`** — start/end datetime, place, geo coordinates, free-admission offer
- **`FAQPage`** — every visible FAQ question and answer, duplicated

This is the most common source of a self-contradicting page. **Change a date, time, address, price, or FAQ answer in the visible copy and you must change it in the JSON-LD too.** The FAQ answers in particular are duplicated word for word — ten of them.

### CI and deployment

`.github/workflows/deploy.yml` runs on PRs, on pushes to `main`, and on manual dispatch. It:

1. Stages the site into `_site` with an **explicit file list** — `index.html 404.html privacy.html terms.html assets CNAME robots.txt sitemap.xml`
2. Verifies the staged output exists and **enforces image budgets**: the WebP must exist, the JPEG must be under 200,000 bytes, and the WebP under 180,000 bytes
3. Uploads and deploys the Pages artifact only on `main`

Consequences worth remembering:

- **Adding a page means editing three places**: the `cp` list, the `test -f` verification, and `sitemap.xml`. Miss the `cp` line and the page silently never deploys.
- **Replacing the car-show photo means staying under budget.** An unoptimized export fails the build. Current sizes: 190,350-byte JPEG, 169,844-byte WebP.
- Action SHAs are pinned. Keep them pinned when bumping versions.
- GitHub Pages source must be set to **GitHub Actions** in repo Settings → Pages.

---

## Design system

- **Fonts:** Cormorant Garamond (serif — headings, display numerals) + DM Sans (sans — body, labels, UI). **No third font family.** Both load from Google Fonts, non-blocking, with a `<noscript>` fallback.
- **Palette:**
  - Brand — `--navy #0A1F5C` · `--navy-deep #060E2B` · `--red #C0282D` · `--red-dark #8B1218` · `--red-deep #991B20` · `--gold #C9963A` · `--gold-light #E8BE6A` · `--cream #F8F2E6` · `--offwhite #FAF7F2`
  - Text — `--text #1A1208` (body) · `--muted #6B5E4A` (muted on light) · `--on-dark-muted #D7DCE7` (**muted on dark — use this, not a low-opacity cream**)
  - Tier surfaces — `--silver #D7DEE8` · `--platinum #1C2945`
- **Contrast is audited, not incidental.** `docs/accessibility-audit.md` records the calculated ratios against WCAG 2.2 AA. `--on-dark-muted` exists because low-opacity text on navy failed. Do not reintroduce translucent text over the dark sections.
- **Focus:** every interactive element gets a two-tone `:focus-visible` ring (cream outline + navy box-shadow) so one edge stays visible on either surface. Do not remove it.
- **Border radius:** `0` or `2px` on rectangular elements only. `50%` for cursor circles.
- **Layout:** 5fr/7fr asymmetric editorial grid across all section mastheads. No equal-column SaaS grids. (The car-show body inverts it to 7fr/5fr; the sponsor tier grid is a deliberate 3-up.)
- **Buttons:** `clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)` — angled/parallelogram shape.
- **Responsive:** the stylesheet is mobile-adapted through a stack of `max-width` queries; 800px is the mobile-nav breakpoint and `main.js` matches it.

---

## Key facts (keep accurate)

### Event

- **Date:** Saturday, September 12, 2026 · **Hours:** 10:00 AM – 3:00 PM
- **Admission:** free, all ages, no registration for general attendance
- **Cadence:** every five years; 2026 is the 25th anniversary, the next is the 30th
- **Weather:** the event **and** the car show are canceled for rain / inclement weather. This is stated plainly on the page — do not soften it to "rain or shine" or "check back"

### Contact and venue

- **Email:** info@americastrongfamilyfest.com — all contact, including sponsorship and car-show registration
- **Venue:** St. Peter Lutheran Church · https://stpeterlutheran.org/
- **Address:** 985 Galligan Road, Gilberts, IL 60136
- **Church social profiles (verified):** https://www.facebook.com/StPeterLutheranGilberts · https://www.instagram.com/stpetergilberts/
- **Naming, decided — use these exact forms everywhere:** `St. Peter Lutheran Church` (abbreviated, not "Saint Peter") and `Gilberts, IL` (not "Gilberts, Illinois"). Both appear in `<meta>` and Open Graph tags as well as visible copy, so a partial change leaves the page contradicting itself
- **OpenStreetMap link:** https://www.openstreetmap.org/?mlat=42.1302386&mlon=-88.3733207#map=17/42.1302386/-88.3733207
- **Map coordinates:** `42.1302386, -88.3733207` — the embedded map marker, the Get Directions pin, and the `geo` node in the JSON-LD. Sourced from the OSM `place_of_worship` node named "St. Peter Lutheran Church" on Galligan Road in Gilberts 60136 (forward and reverse geocode agree). OSM has no house number on that node, so if the pin is ever reported as off, re-verify against the building rather than trusting a road-level geocode

### Parking

- **Guests:** on site in the church lot; volunteers direct traffic
- **Accessible:** a limited number of spaces near the main festival area
- **Volunteers:** behind the garage on the north side of the grounds

### Sponsorship

- **Tiers:** Silver $150 / Gold $500 / Platinum $1,000+ — Gold is the featured "most popular" tier and belongs in the center
- **Benefits are approved copy.** Silver: name on the sponsor list, shared social thank-you. Gold: everything in Silver plus logo on the list, logo or name on event signage, materials at the community table. Platinum: everything in Gold plus prominent logo placement, logo on event and volunteer T-shirts, featured social recognition
- **T-shirt artwork deadline: September 8, 2026.** The Platinum T-shirt benefit is conditional on artwork arriving by then — keep the condition attached to the benefit
- **The sponsor wall is live and empty.** Each tier shows an "Awaiting our first … sponsor" line. An HTML comment in the markup shows exactly how to replace it with a real name. Do not list a sponsor who has not confirmed

### Schedule (as published)

10:00 event opens (car show, Gilberts PD booth, DJ, balloon artist, bounce house, yard games, BINGO, LCC Comfort Dogs, fire truck / police car / ambulance for kids) · 11:00 food service opens · 11:30 kid karaoke · 12:00 Bad Penny Band and face painting · 1:00 kids crafts · 1:30 Elgin PD K9 demonstration at the police booth · 2:00 kid games, DJ, BINGO · 2:30 sponsor recognition and car-show awards · 3:00 close.

The schedule section, the activities section, and the FAQ all describe the same day. **Change one and check the other two** — plus the JSON-LD FAQ block.

### Car show

Free to show and free to view · all makes, models, and years welcome · **advance registration required, spaces limited, first come first served** · Fan Favorite award at 2:30 · canceled for inclement weather.

### Privacy posture — this one is a published promise

`privacy.html` states that the site uses **no analytics, no cookies, no local storage, and no tracking or advertising pixels**, and names exactly three third parties that receive a visitor's IP: **GitHub Pages, Google Fonts, and OpenStreetMap**.

Adding an analytics snippet, an embedded video, a social widget, a web font from a fourth host, or anything else that makes an outbound request **makes the published policy false**. Do not add one. If a request genuinely requires it, update `privacy.html` in the same change and say so in the PR.

---

Facts on this site are what people plan their Saturday around. **Never invent, guess, or "improve" a date, time, address, price, or email.** If a fact is missing, ask or leave it out.

---

## Commit conventions

**Every commit in this repository must follow [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/).** Commits from before the convention was adopted do not follow it, so match the spec below rather than copying the older history.

### Format

```
<type>(<optional scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type | Use for |
|---|---|
| `feat` | A new user-visible capability — a new section, activity entry, form field, or interaction |
| `fix` | Correcting something broken or wrong — a bad link, a wrong address, a layout bug |
| `docs` | `README.md`, `AGENTS.md`, `CLAUDE.md`, `docs/**`, comments — no change to the shipped site |
| `style` | **Formatting only** — whitespace, indentation, quote style. See the trap below |
| `refactor` | Restructuring markup or CSS with no change to rendered output or behavior |
| `perf` | Load time, render performance, image weight, animation cost |
| `build` | The `_site` staging step, `CNAME`, `.gitignore`, anything about how the site is assembled |
| `ci` | `.github/workflows/**` |
| `chore` | Housekeeping that fits nothing above |
| `revert` | Reverting a previous commit |

> **The `style` trap — read this one.** In Conventional Commits, `style` means *code formatting*, **not visual design**. A CSS change that alters how the site looks is a `feat` or a `fix`, never `style`. Recoloring the sponsor tiers is `fix(sponsor):`, not `style(sponsor):`. Getting this backwards is the single most common mistake on a site project.

### Scopes

Use the section or file being touched. Preferred scopes:

`hero` · `about` · `activities` · `schedule` · `car-show` · `sponsor` · `volunteer` · `faq` · `location` · `footer` · `nav` · `forms` · `legal` · `404` · `css` · `js` · `seo` · `a11y` · `ci` · `docs`

Scope is optional but strongly preferred — it is what makes the log skimmable for a non-technical maintainer.

### Description

- Imperative mood: "add", not "added" or "adds"
- Lowercase first letter, no trailing period
- Aim for ≤ 72 characters on the subject line
- Say what changed for the *visitor*, not what changed in the file

### Breaking changes

Append `!` after the type/scope and add a `BREAKING CHANGE:` footer. On a static site this is rare but real — removing or renaming a section anchor (`#sponsor`, `#volunteer`, `#schedule`, `#car-show`, `#faq`) breaks every link anyone has already shared, and so does renaming `privacy.html` or `terms.html`:

```
feat(nav)!: rename #sponsor anchor to #partners

BREAKING CHANGE: previously shared links to #sponsor no longer resolve.
```

### Examples for this repo

```
fix(location): update venue address to 985 Galligan Road, Gilberts
feat(schedule): add hour-by-hour festival schedule section
feat(forms): add structured mailto registration flows
fix(sponsor): differentiate silver, gold, and platinum tier styling
feat(faq): add confirmed event FAQ
feat(legal): add privacy policy page with footer link
fix(css): add scroll-margin-top so anchors clear the fixed nav
perf(img): serve the car-show photo as WebP with a JPEG fallback
docs(agents): document conventional commit requirements
ci: pin actions/checkout to v4
```

### Pull requests

Merges to `main` are **squash merges**, which means **the PR title becomes the commit message on `main`**. PR titles must therefore follow the same Conventional Commits format as commits. A PR titled "Address fixes" produces a permanently non-conventional commit in the history.

---

## Development workflow

- Branch from `main`; PRs target `main`
- **All PRs are opened as drafts**
- The build check runs on every PR via GitHub Actions
- After any push, open a draft PR if one does not already exist for the branch
- Never push directly to `main`
- `@gogorichie` owns every path via CODEOWNERS and reviews everything

### There is no test suite

Validation is the CI staging check plus your own eyes. Before opening a PR, at minimum:

- Open the page and click through every anchor in the nav and the footer
- Check the mobile nav at a narrow width — open, select, Escape, resize
- If you touched a form, submit it and confirm what actually happens
- If you touched a fact, `grep` for it across `index.html`, the JSON-LD, `assets/event.ics`, and the legal pages
- If you added a page, confirm it is in the workflow's `cp` list, the `test -f` block, and `sitemap.xml`

### Local preview

```bash
npx serve
# → http://localhost:3000
```

Or open `index.html` directly in a browser. Note that `404.html` uses root-absolute paths, so it only renders correctly through a server, not via `file://`.

---

## Recommended skills

Three external skill packs cover work this project regularly needs and that general coding instincts handle poorly. Install what the task calls for; you do not need all three at once.

### 1. Ponytail — restraint in code generation

**https://github.com/DietrichGebert/ponytail** — enforces minimal, pragmatic implementations: before writing anything, check whether the code needs to exist, whether something here can be reused, and whether a native feature already does the job.

**Why it matters here:** this repo is roughly 758 lines of HTML, 1,101 of CSS, and 330 of JS with **zero dependencies**. It is exactly the kind of project an agent ruins by reaching for a framework or an abstraction layer to add one activity row.

**Use it for:** any change to `index.html`, `main.css`, or `main.js` — especially when you feel an urge to "set things up properly."

```
/plugin marketplace add DietrichGebert/ponytail
/plugin install ponytail@ponytail
```

`ponytail-review` checks a diff for over-engineering; `ponytail-audit` scans the repo. The always-on hooks want `node` on PATH; the skills work without it.

### 2. Marketing Skills — conversion, copy, and SEO

**https://github.com/coreyhaines31/marketingskills** — 80+ skills across conversion (`cro`, `signup`), content (`copywriting`, `copy-editing`, `social`), and SEO (`seo-audit`, `schema`).

**Use it for:** section copy, volunteer and sponsor conversion, page titles and meta descriptions, social share previews, event promotion.

```bash
npx skills add coreyhaines31/marketingskills --skill cro copywriting seo-audit
```

> **Translate before applying.** These skills assume a SaaS product with signups and pricing. This is a free church community event — no trial, no paywall, no MRR. Take the frameworks (clarity, single obvious next action, objection handling) and discard the growth-hacking register. **Never let the site start sounding like a startup.**

### 3. Business Analysis Skills — requirements and stakeholders

**https://github.com/45ck/business-analysis-skills** — 53 techniques covering stakeholder analysis, requirements and acceptance criteria, **ambiguity detection**, assumption extraction, and consistency review.

**Why it matters here:** most requests for this site arrive as **recorded conversation between organizers** — half-finished, contradictory, full of items that are "maybe" and "I have to confirm that." Turning that into confirmed requirements is exactly business analysis, and doing it badly is how unconfirmed plans get published as fact.

**Use it for:** processing meeting transcripts into issues, separating confirmed from pending, writing acceptance criteria before implementing, and identifying who must approve a fact (organizer, church, police/fire department).

```bash
git clone https://github.com/45ck/business-analysis-skills.git
cd business-analysis-skills && bash install.sh
```

**The ambiguity-detection and assumption-extraction skills are the high-value ones here** — they catch the "I'm not sure about the food yet" class of statement that must not be silently hardened into published copy.

---

## Common tasks

| Task | Where |
|---|---|
| Content edits | `index.html` — edit directly |
| Style changes | `assets/css/main.css` |
| Behavior changes | `assets/js/main.js` |
| Add an activity | New `.act-row` block in the activities list, matching the existing pattern |
| Add an FAQ entry | New `.act-row` in `#faq` **and** a matching `Question` in the JSON-LD `FAQPage` |
| Add or move a schedule item | `.sched-block` / `.sched-items` in `#schedule` — then reconcile the activities section, which narrates the same times |
| Change a sponsorship tier | `.tier-card` blocks in the sponsor section + `.tier-*` rules in CSS |
| List a confirmed sponsor | Replace the `.sponsor-group-empty` line in that tier — the HTML comment above the groups shows the exact markup |
| Change the event date or time | `index.html` visible copy, `<meta>`/`og:`, JSON-LD `Event`, `assets/event.ics`, the Google Calendar link in `#location`, and `404.html` |
| Add a page | Create it, then add it to the workflow's `cp` list, the `test -f` verification, and `sitemap.xml` |
| Replace the car-show photo | Export WebP + JPEG under the CI budgets, keep `width`/`height`, update `og:image` dimensions if they change |

Before changing a fact (date, time, address, price, email), `grep` for it first — most facts appear in **five to eight places**, including `<meta>` tags, Open Graph tags, and the JSON-LD block, all of which are invisible when reading the rendered page. A partial update is worse than no update, because the page then contradicts itself.

---

## Do not

- Add a third font family
- Use `border-radius` > `2px` on rectangular elements
- Use equal-width column grids for section layouts — keep the 5/7 asymmetry
- Change the contact email away from `info@americastrongfamilyfest.com`
- Delete the `CNAME` file — the custom domain depends on it
- Introduce a build step, framework, or dependency without an explicit request
- Add analytics, cookies, local storage, tracking pixels, or any fourth third-party request — `privacy.html` publicly promises none of them exist
- Let a form claim a submission succeeded when nothing was sent
- Remove the plain `mailto:` links that serve as the no-JavaScript fallback for the sponsor and car-show forms
- Update a visible fact without updating its copy in the JSON-LD, `<meta>`/`og:` tags, and `assets/event.ics`
- Add a page without adding it to the deploy workflow and `sitemap.xml`
- Remove the `:focus-visible` ring or reintroduce low-opacity text on the dark sections
- Publish an activity, performer, vendor, or sponsor as confirmed when it is still pending
- Write a non-conventional commit message or PR title

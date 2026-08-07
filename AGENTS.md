# AGENTS.md — America Strong Family Fest

Canonical guidance for any AI coding agent working in this repository (Claude Code, Codex, Cursor, Windsurf, Copilot, and anything else following the Agent Skills / AGENTS.md conventions).

`CLAUDE.md` points here. Edit **this** file — do not duplicate guidance into `CLAUDE.md`.

---

## Project overview

Static marketing site for **[americastrongfamilyfest.com](https://americastrongfamilyfest.com)**.

America Strong Family Fest is a **free, family-friendly community event** held in remembrance of September 11th, hosted at Saint Peter Lutheran Church in Gilberts, Illinois. The next event is **Saturday, September 12, 2026, 10:00 AM – 3:00 PM**. Admission is free and open to the public, all ages.

The site exists to do four things, in priority order:

1. **Tell people when and where the event is**, accurately enough that they can show up.
2. **Recruit volunteers** — the event runs on unpaid help and the sign-up form is the primary channel.
3. **Attract sponsors** — sponsorship is what keeps admission free.
4. **Describe what happens at the fest** so families decide to come.

This is a **community event page read by neighbors, not a product landing page**. Copy should sound like a warm invitation from the church, not like SaaS marketing. When in doubt, favor clarity about logistics over cleverness.

### Audience and constraints worth internalizing

- Visitors skew **local and non-technical**, spanning small children through seniors. Accessibility and legibility matter more than motion and effect.
- A meaningful share of traffic is **mobile**, often shared via text or Facebook — so the `<title>`, `og:` tags, and the Get Directions link are load-bearing, not decoration.
- The event date is **fixed and public**. Anything published as confirmed must actually be confirmed; a family that drives out for a K9 demo that never got booked is a real harm. Prefer "planned" phrasing for anything still pending.

---

## Architecture

| Concern | Location | Notes |
|---|---|---|
| All page content | `index.html` | Single page, plain HTML, no templating, no includes |
| Styles | `assets/css/main.css` | Vanilla CSS. No preprocessor, no framework, no build |
| Behavior | `assets/js/main.js` | Vanilla JS: star canvas, nav scroll, custom cursor, form submit |
| CI/CD | `.github/workflows/deploy.yml` | Builds on PRs; deploys to GitHub Pages on push to `main` |
| Custom domain | `CNAME` | Required for the custom domain — never delete |

**There is no build step and no dependencies.** `index.html` is served as-is. Do not introduce a bundler, framework, package manager, or `node_modules` without an explicit request — "no build step" is a deliberate property of this project, not an oversight.

Navigation is anchor-based within the one page: `#about`, `#activities`, `#sponsor`, `#volunteer`, `#location`.

---

## Design system

- **Fonts:** Cormorant Garamond (serif — headings, display numerals) + DM Sans (sans — body, labels, UI). **No third font family.**
- **Palette:** `--navy #0A1F5C` · `--navy-deep #060E2B` · `--red #C0282D` · `--gold #C9963A` · `--gold-light #E8BE6A` · `--cream #F8F2E6` · `--offwhite #FAF7F2`
- **Border radius:** `0` or `2px` on rectangular elements only. `50%` for cursor circles.
- **Layout:** 5fr/7fr asymmetric editorial grid across all section mastheads. No equal-column SaaS grids.
- **Buttons:** `clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)` — angled/parallelogram shape.

---

## Key facts (keep accurate)

- **Email:** info@americastrongfamilyfest.com — all contact, including sponsorship
- **Venue:** Saint Peter Lutheran Church · https://stpeterlutheran.org/
- **Address:** 985 Galligan Road, Gilberts, IL 60136
- **Google Maps link:** https://maps.google.com/?q=985+Galligan+Road+Gilberts+IL+60136
- **Sponsorship tiers:** Silver $150 / Gold $500 / Platinum $1,000+ — Gold is the featured "most popular" tier and belongs in the center

Facts on this page are what people plan their Saturday around. **Never invent, guess, or "improve" a date, time, address, price, or email.** If a fact is missing, ask or leave it out.

---

## Commit conventions

**Every commit in this repository must follow [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/).** This is a new convention — commits before it was adopted do not follow it, so match the spec below rather than copying the older history.

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
| `docs` | `README.md`, `AGENTS.md`, `CLAUDE.md`, comments — no change to the shipped site |
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

`hero` · `about` · `activities` · `sponsor` · `volunteer` · `location` · `footer` · `nav` · `css` · `js` · `seo` · `a11y` · `ci` · `docs`

Scope is optional but strongly preferred — it is what makes the log skimmable for a non-technical maintainer.

### Description

- Imperative mood: "add", not "added" or "adds"
- Lowercase first letter, no trailing period
- Aim for ≤ 72 characters on the subject line
- Say what changed for the *visitor*, not what changed in the file

### Breaking changes

Append `!` after the type/scope and add a `BREAKING CHANGE:` footer. On a static site this is rare but real — removing or renaming a section anchor (`#sponsor`, `#volunteer`) breaks every link anyone has already shared:

```
feat(nav)!: rename #sponsor anchor to #partners

BREAKING CHANGE: previously shared links to #sponsor no longer resolve.
```

### Examples for this repo

```
fix(location): update venue address to 985 Galligan Road, Gilberts
feat(activities): add classic car show entry
fix(sponsor): differentiate silver, gold, and platinum tier styling
feat(activities): add kid karaoke between band sets
fix(css): add scroll-margin-top so anchors clear the fixed nav
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

### Local preview

```bash
npx serve
# → http://localhost:3000
```

Or open `index.html` directly in a browser.

---

## Recommended skills

Three external skill packs cover work this project regularly needs and that general coding instincts handle poorly. Install what the task calls for; you do not need all three at once.

### 1. Ponytail — restraint in code generation

**https://github.com/DietrichGebert/ponytail**

Enforces minimal, pragmatic implementations — "the best code is the code you never wrote." Before writing anything it checks whether the code needs to exist at all, whether something in the codebase can be reused, and whether a native/stdlib feature already does the job. Reported impact is roughly **54% fewer lines** at equal safety.

**Why it matters here:** this repo is 346 lines of HTML, 674 of CSS, and 85 of JS with **zero dependencies**. It is exactly the kind of project an agent ruins by reaching for a framework, a component library, or an abstraction layer to add one activity row. Ponytail is the counterweight.

**Use it for:** any change to `index.html`, `main.css`, or `main.js` — especially when you feel an urge to "set things up properly."

```
/plugin marketplace add DietrichGebert/ponytail
/plugin install ponytail@ponytail
```

Useful commands: `ponytail-review` (over-engineering in a diff), `ponytail-audit` (whole-repo scan). Requires `node` on PATH for the always-on hooks; the skills work without it.

### 2. Marketing Skills — conversion, copy, and SEO

**https://github.com/coreyhaines31/marketingskills**

80+ marketing skills spanning conversion (`cro`, `signup`, `onboarding`), content (`copywriting`, `copy-editing`, `emails`, `social`), SEO (`seo-audit`, `site-architecture`, `schema`), and growth (`launch`, `lead-magnets`, `community-marketing`). The `product-marketing` skill is foundational — other skills read it first for context.

**Why it matters here:** the volunteer form and the sponsorship tiers are conversion surfaces, and the copy across the page is persuasion work. These are marketing problems wearing HTML.

**Use it for:** rewriting section copy, improving volunteer sign-up conversion, structuring the sponsorship pitch, page titles and meta descriptions, social share previews, and event-launch promotion.

```bash
npx skills add coreyhaines31/marketingskills --skill cro copywriting seo-audit
```

Or via the plugin system:

```
/plugin marketplace add coreyhaines31/marketingskills
/plugin install marketing-skills
```

> **Translate before applying.** These skills assume a SaaS product with signups and pricing. This is a free church community event — there is no trial, no paywall, no MRR. Take the frameworks (clarity, single obvious next action, objection handling) and discard the growth-hacking register. Never let the site start sounding like a startup.

### 3. Business Analysis Skills — requirements and stakeholders

**https://github.com/45ck/business-analysis-skills**

53 platform-neutral business analysis techniques: atomic methods (SWOT, PESTLE, stakeholder registers, power-interest grids, RACI), requirements and specification (acceptance criteria, **ambiguity detection**, assumption extraction, constraint identification), elicitation workflows, and quality review passes (bias detection, evidence gaps, consistency checks).

**Why it matters here:** most requests for this site arrive as **recorded conversation between organizers** — half-finished, contradictory, full of items that are "maybe" and "I have to confirm that." Turning that into unambiguous, confirmed requirements is precisely business analysis, and doing it badly is how unconfirmed plans end up published as fact.

**Use it for:** processing meeting transcripts into issues, separating confirmed from pending items, writing acceptance criteria before implementing, identifying who must approve a fact (organizer, church, police/fire department), and reviewing a batch of changes for consistency before a PR.

```bash
git clone https://github.com/45ck/business-analysis-skills.git
cd business-analysis-skills && bash install.sh
```

Or copy `.claude/` and `.agents/` from that repo into this project.

**The ambiguity-detection and assumption-extraction skills are the high-value ones here** — they catch the "I'm not sure about the food yet" class of statement that must not be silently hardened into published copy.

---

## Common tasks

| Task | Where |
|---|---|
| Content edits | `index.html` — single file, edit directly |
| Style changes | `assets/css/main.css` |
| Behavior changes | `assets/js/main.js` |
| Add an activity | New `.act-row` block in the activities list, matching the existing pattern |
| Change a sponsorship tier | `.tier-card` blocks in the sponsor section + `.tier-*` rules in CSS |

Before changing a fact (date, time, address, price, email), `grep` for it first — most facts appear in **five to eight places**, including `<meta>` and Open Graph tags that are invisible when reading the rendered page. A partial update is worse than no update, because the page then contradicts itself.

---

## Do not

- Add a third font family
- Use `border-radius` > `2px` on rectangular elements
- Use equal-width column grids for section layouts — keep the 5/7 asymmetry
- Change the contact email away from `info@americastrongfamilyfest.com`
- Delete the `CNAME` file — the custom domain depends on it
- Introduce a build step, framework, or dependency without an explicit request
- Publish an activity, performer, or vendor as confirmed when the organizer flagged it as pending
- Write a non-conventional commit message or PR title

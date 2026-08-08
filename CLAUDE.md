# CLAUDE.md

**All guidance for this repository lives in [`AGENTS.md`](./AGENTS.md). Read it before making any change.**

`AGENTS.md` is the single source of truth — project overview, architecture, design system, key facts, commit conventions, and recommended skills. Guidance is kept in one file deliberately, so the two cannot drift apart and start contradicting each other.

Do not add project guidance here. Edit `AGENTS.md` instead.

---

## The short version

America Strong Family Fest is a **free community event** on **Saturday, September 12, 2026**, hosted at St. Peter Lutheran Church in Gilberts, IL. This repo is its static, single-page, zero-dependency website — `index.html`, `assets/css/main.css`, `assets/js/main.js` — deployed to GitHub Pages.

Four rules apply to every change. The reasoning behind each is in `AGENTS.md`:

1. **Never invent a fact.** Dates, times, addresses, prices, and emails are what people plan their Saturday around. `grep` before editing one — most appear in five to eight places, including `<meta>` and Open Graph tags that are invisible when reading the rendered page.
2. **Never publish an unconfirmed plan as confirmed.** If an organizer said "I have to confirm that," it does not ship as fact.
3. **Every commit and PR title follows [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).** Merges are squashed, so the PR title becomes the permanent commit message. Note that `style:` means *code formatting* — a visual CSS change is `feat` or `fix`.
4. **Keep it small.** No build step, no framework, no dependencies. That is a deliberate property of this project, not an oversight.

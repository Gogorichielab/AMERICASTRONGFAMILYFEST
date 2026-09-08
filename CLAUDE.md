# CLAUDE.md

**All guidance for this repository lives in [`AGENTS.md`](./AGENTS.md). Read it before making any change.**

`AGENTS.md` is the single source of truth — project overview, architecture, design system, key facts, commit conventions, and recommended skills. Guidance is kept in one file deliberately, so the two cannot drift apart and start contradicting each other.

Do not add project guidance here. Edit `AGENTS.md` instead.

---

## The short version

America Strong Family Fest is a **free community event** on **Saturday, September 12, 2026, 10:00 AM – 3:00 PM**, hosted at St. Peter Lutheran Church in Gilberts, IL. It is held every five years; this one marks the 25th anniversary.

This repo is its static, zero-dependency website, deployed to GitHub Pages: **four HTML pages** — `index.html`, `privacy.html`, `terms.html`, `404.html` — sharing one `assets/css/main.css` and one `assets/js/main.js`.

Five rules apply to every change. The reasoning behind each is in `AGENTS.md`:

1. **Never invent a fact.** Dates, times, addresses, prices, and emails are what people plan their Saturday around. `grep` before editing one — most appear in five to eight places, including `<meta>` tags, Open Graph tags, the JSON-LD block, and `assets/event.ics`, all invisible when reading the rendered page.
2. **Never publish an unconfirmed plan as confirmed.** If an organizer said "I have to confirm that," it does not ship as fact. The same goes for listing a sponsor who has not signed.
3. **Never let a form claim success.** There is no backend. The sponsor and car-show forms open a pre-filled `mailto:`; the volunteer form sends nothing and says so. Do not paint a thank-you over discarded data.
4. **Never add a tracker.** `privacy.html` publicly promises no analytics, no cookies, no local storage, and exactly three third-party requests (GitHub Pages, Google Fonts, OpenStreetMap). Adding a fourth makes the published policy false.
5. **Every commit and PR title follows [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).** Merges are squashed, so the PR title becomes the permanent commit message. Note that `style:` means *code formatting* — a visual CSS change is `feat` or `fix`.

And keep it small: no build step, no framework, no dependencies. That is a deliberate property of this project, not an oversight.

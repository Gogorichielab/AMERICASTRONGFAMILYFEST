# America Strong Family Fest

**Website:** [americastrongfamilyfest.com](https://americastrongfamilyfest.com)

A free, family-friendly community event held in remembrance of September 11th at St. Peter Lutheran Church in Gilberts, IL. The fest is held **every five years** — the 2026 event marks the 25th anniversary, and the next one marks the 30th.

---

## Event Details

| | |
|---|---|
| **Date** | Saturday, September 12, 2026 |
| **Time** | 10:00 AM – 3:00 PM |
| **Venue** | St. Peter Lutheran Church |
| **Address** | 985 Galligan Road, Gilberts, IL 60136 |
| **Admission** | Free & open to the public |
| **Ages** | All ages welcome |
| **Held** | Every five years (2026 is the 25th anniversary) |
| **Weather** | The event and the car show are canceled for inclement weather |

---

## What's on the site

**Homepage (`index.html`)** — about the event, activities, an hour-by-hour schedule, the car show, sponsorship tiers, volunteer sign-up, an FAQ, and directions with an embedded map and calendar links.

**Also published:** a privacy policy (`privacy.html`), terms and conditions (`terms.html`), and a branded not-found page (`404.html`).

### Forms

There is no backend and no third-party form service. Everything reaches the organizers by email:

- **Sponsorship inquiry** and **car-show registration** open a pre-filled message in the visitor's own email app. Nothing sends until the visitor presses Send.
- **Volunteer sign-up** is not connected. Submitting it shows a note asking the visitor to email instead — deliberately, rather than pretending a submission worked. Both legal pages say so.

To volunteer, register a car, or sponsor, email **info@americastrongfamilyfest.com**.

---

## Repository layout

```
index.html              Homepage — all event content
privacy.html            Privacy policy
terms.html              Terms & conditions
404.html                Not-found page (uses root-absolute asset paths)
assets/css/main.css     One stylesheet, all four pages
assets/js/main.js       Vanilla JS — nav, hero canvas, mailto forms
assets/event.ics        Save-the-date calendar file
assets/img/             Favicons and the car-show photo (WebP + JPEG)
robots.txt, sitemap.xml Crawling
CNAME                   Custom domain — required, do not delete
docs/                   Accessibility audit and performance baseline
AGENTS.md               Contributor and AI-agent guidance
```

## Tech Stack

- **Generator:** Plain static HTML — no build step, no framework, no dependencies
- **Hosting:** GitHub Pages with custom domain
- **Fonts:** Cormorant Garamond (serif) + DM Sans (sans), loaded non-blocking
- **SEO:** JSON-LD structured data (Organization, Event, FAQPage) plus Open Graph and Twitter card tags
- **Privacy:** no analytics, no cookies, no local storage, no tracking pixels
- **CI/CD:** GitHub Actions — builds on every PR, deploys to GitHub Pages on merge to `main`

## Local Development

Open `index.html` directly in a browser, or use any static file server:

```bash
npx serve
# → http://localhost:3000
```

`404.html` uses root-absolute asset paths, so it only renders correctly through a server — not over `file://`.

There is no test suite. Validation is the CI build check plus manual review.

## Deployment

Every push to `main` triggers the GitHub Actions workflow (`.github/workflows/deploy.yml`), which stages the static files into `_site` and deploys them to GitHub Pages automatically. Pull requests run the build without deploying.

The build also enforces image budgets and fails if the car-show JPEG reaches 200 KB or the WebP reaches 180 KB. **Adding a new page means editing three places:** the workflow's `cp` list, its `test -f` verification block, and `sitemap.xml`. A page missing from the `cp` list silently never deploys.

CodeQL analysis runs on every pull request through GitHub's code-scanning default setup, so there is no CodeQL workflow file in this repository.

The deploy workflow is adapted from the organization GitHub Pages template at commit `6599d2688f322bb63a01452e032777d7c0bf6eb9`. Repository-specific adaptations preserve the zero-dependency `_site` staging step, custom domain, static performance budgets, and production-only Pages permissions.

GitHub Pages source must be set to **GitHub Actions** in repo Settings → Pages.

## Contributing

Read **[`AGENTS.md`](./AGENTS.md)** first — it is the single source of truth for architecture, the design system, event facts, and conventions, for human contributors and AI coding agents alike.

The essentials:

- Branch from `main`, target `main`, and open pull requests as **drafts**. Never push directly to `main`.
- Every commit and PR title follows [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). Merges are squashed, so the PR title becomes the permanent commit message.
- **Never invent a date, time, address, price, or email.** Most facts appear in five to eight places, including `<meta>` tags and the JSON-LD block that are invisible when reading the rendered page. `grep` before you edit one.
- Never publish an activity, performer, vendor, or sponsor as confirmed while it is still pending.

## Contact

**General & sponsorship:** info@americastrongfamilyfest.com  
**Venue:** [stpeterlutheran.org](https://stpeterlutheran.org/)  
**St. Peter Lutheran Church:** [Facebook](https://www.facebook.com/StPeterLutheranGilberts) · [Instagram](https://www.instagram.com/stpetergilberts/)

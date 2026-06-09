# America Strong Family Fest

**Website:** [americastrongfamilyfest.com](https://americastrongfamilyfest.com)

A free, family-friendly community event held annually in remembrance of September 11th at Saint Peter Lutheran Church in Gilberts, Illinois.

---

## Event Details

| | |
|---|---|
| **Date** | Saturday, September 12, 2026 |
| **Time** | 10:00 AM – 3:00 PM |
| **Venue** | Saint Peter Lutheran Church |
| **Address** | 18N377 Galligan Rd, Dundee, IL 60118 |
| **Admission** | Free & open to the public |
| **Ages** | All ages welcome |

---

## Tech Stack

- **Generator:** [Jekyll](https://jekyllrb.com/) static site
- **Hosting:** GitHub Pages with custom domain
- **Fonts:** Cormorant Garamond (serif) + DM Sans (sans)
- **CI/CD:** GitHub Actions — builds on every PR, deploys to GitHub Pages on merge to `main`

## Local Development

```bash
bundle install
bundle exec jekyll serve
# → http://localhost:4000
```

Requires Ruby. If you don't have Bundler: `gem install bundler`.

## Deployment

Every push to `main` triggers the GitHub Actions workflow (`.github/workflows/deploy.yml`), which builds the site with Jekyll and deploys it to GitHub Pages automatically.

GitHub Pages source must be set to **GitHub Actions** in repo Settings → Pages.

## Contact

**General & sponsorship:** info@americastrongfamilyfest.com  
**Venue:** [stpeterlutheran.org](https://stpeterlutheran.org/)

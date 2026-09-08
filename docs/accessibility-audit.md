# Accessibility audit

Audit date: September 7, 2026  
Standard: WCAG 2.2 Level AA  
Scope: `index.html`, `404.html`, `terms.html`, and `assets/css/main.css`

## Contrast and interaction results

- Normal text uses combinations meeting the WCAG AA 4.5:1 requirement.
- Large display text uses combinations meeting the WCAG AA 3:1 requirement.
- Previously low-contrast footer, sponsor-note, calendar-label, scroll-hint, photo-caption, and 404-event text now use `--on-dark-muted` (`#D7DCE7`) on the dark navy surfaces.
- Sponsor-tier text is explicitly paired with its tier surface: navy on silver and gold, and cream/muted cream on platinum.
- Form controls use a visible boundary against the navy form surface.
- Links, buttons, inputs, selects, and textareas use a two-tone `:focus-visible` indicator so one edge remains visible on both light and dark surfaces.
- The mobile navigation button exposes its expanded state, supports keyboard activation and Escape, returns focus when dismissed, and closes after a destination is chosen.
- Existing `prefers-reduced-motion` handling stops smooth scrolling and continuous decorative motion.

## Representative calculated ratios

| Foreground | Background | Ratio | Use |
| --- | --- | ---: | --- |
| `#D7DCE7` | `#0A1F5C` | 11.2:1 | Muted text on navy |
| `#F8F2E6` | `#1C2945` | 13.0:1 | Platinum tier headings |
| `#0A1F5C` | `#D7DEE8` | 11.4:1 | Silver tier text |
| `#060E2B` | `#C9963A` | 7.2:1 | Gold tier text |
| `#6B5E4A` | `#FAF7F2` | 5.9:1 | Muted body text |
| `#E8BE6A` | `#991B20` | 4.7:1 | Small gold labels on deep red |

Ratios are rounded to one decimal. Decorative borders and the non-text star field are not relied upon to communicate information.

## Manual verification checklist

- Keyboard-only navigation at desktop and mobile widths.
- Menu open/close, Escape behavior, focus return, and destination selection.
- Browser zoom to 200% with no loss of content or controls.
- Viewports at 320, 390, 600, 768, and 1440 CSS pixels.
- Reduced-motion mode.

No WCAG exception is intentionally claimed for informative text.

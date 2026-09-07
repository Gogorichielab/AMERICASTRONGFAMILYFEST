# Performance baseline and media budget

Baseline date: September 7, 2026  
Site: `https://americastrongfamilyfest.com/`

## Baseline

The site is plain static HTML, CSS, and JavaScript with no framework, package dependencies, or client-side data fetch during initial rendering. The production baseline before this change used a 253,076-byte, 1400-by-933 JPEG for the car-show photograph.

This change adds a 169,844-byte WebP source while retaining a 190,350-byte compressed progressive JPEG fallback and the existing explicit image dimensions. That reduces the modern-browser photo transfer by about 33% from the original JPEG. The image stays lazy-loaded because it is below the fold. The embedded map also has explicit dimensions and remains lazy-loaded. JavaScript remains deferred, and the animated hero canvas pauses when it is outside the viewport or reduced motion is requested.

## Repository performance budgets

The Pages build now fails when:

- the optimized WebP source is missing;
- the JPEG fallback is 200,000 bytes or larger; or
- the WebP source is 180,000 bytes or larger.

These limits are deliberately generous enough to preserve the event photograph while preventing an accidental return to an oversized original.

## Core Web Vitals targets

| Metric | Target |
| --- | ---: |
| Lighthouse Performance | 90 or higher on mobile and desktop |
| Largest Contentful Paint | 2.5 seconds or less |
| Cumulative Layout Shift | 0.10 or less |
| Interaction to Next Paint | 200 milliseconds or less |
| Total Blocking Time | 200 milliseconds or less |

The repository has no supported browser binary in its validation environment, so a synthetic Lighthouse score is not fabricated here. After this branch is deployed, run Lighthouse against the production URL on mobile and desktop and attach the report to issue #63. Field INP requires real-user data and cannot be derived from a one-off local test.

## Image guidance

- Provide WebP for photographs, with a JPEG fallback when the image is used by social-sharing services.
- Use the smallest dimensions that cover the rendered slot; the current 1400-by-933 source is the ceiling for the car-show layout.
- Strip metadata and use progressive JPEG encoding.
- Keep explicit `width` and `height` attributes to prevent layout shift.
- Lazy-load images below the fold.
- Keep individual photographs below 180 KB when practical; CI enforces the stated fallback budgets for the current hero-independent photograph.

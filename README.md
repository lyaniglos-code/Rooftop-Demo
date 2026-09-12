# Copperline Roofing Co. — Demo Website

A demo website for a **completely fictional** roofing company, built to show
what a modern, photo-led, scroll-animated site can look like for a trade
business.

Every name, number, review, and credential on the site is invented. The photos
are stock images from [Unsplash](https://unsplash.com), used under the Unsplash
License; they are not Copperline jobs.

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static export to ./out
```

## Stack

- **Next.js** (App Router, static export) + **TypeScript** + **Tailwind CSS**
- **Framer Motion** for scroll-linked and interaction animation
- **Lenis** for inertial scroll smoothing (drives native scrolling, so
  `position: sticky` pins keep working)

## Look

Dark job-site charcoal, one copper accent, square corners, and condensed
Big Shoulders Display headlines over Barlow body text.

## Scroll animations

| Effect | File |
| --- | --- |
| Hero photo pushes in and darkens while the headline lines slide apart | `components/Hero.tsx` |
| Two rows of oversized type sliding opposite ways with scroll | `components/WordBand.tsx` |
| Pinned section where the service cards travel sideways (desktop) | `components/Services.tsx` |
| Sticky photo that wipes to the next step, copper rule filling down | `components/HowWeWork.tsx` |
| Project photos opening out of a smaller frame as they rise | `components/RecentWork.tsx` |
| Form over a drifting background photo | `components/QuoteCTA.tsx` |
| Oversized footer wordmark rising into place | `components/Footer.tsx` |

Also: count-up stats (`Stats.tsx`), quote cards (`Testimonials.tsx`), an
accordion (`FAQ.tsx`), and a nav with a storm-line strip and mobile sheet
(`Nav.tsx`).

All brand copy and image paths live in `data/site.ts`.

Accessibility: every scroll effect is skipped under `prefers-reduced-motion`,
the sideways services strip becomes a stacked list on phones, and controls
are keyboard-operable.

# Copperline Roofing Co. — Demo Website

A demo website for a **completely fictional** roofing company, built to showcase
what a modern, fluidly animated site can look like for any trade business
(roofing, HVAC, electric, gyms — swap the copy and palette).

Every name, number, review, and credential on the site is invented.

## Run it

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Stack

- **Next.js** (App Router) + **TypeScript** + **Tailwind CSS**
- **Framer Motion** for all scroll-linked and interaction animation
- **Lenis** for inertial scroll smoothing (drives native scrolling, so
  `position: sticky` pins keep working)

## The centerpiece — "Anatomy of a Copperline roof"

`components/RoofBuilder.tsx` is a 520vh pinned scroll scene:

- An **isometric house drawn programmatically in SVG** — all geometry comes
  from one projection helper (`iso(x, y, z)`) plus a handful of constants
  (width, depth, wall height, ridge rise, overhang), so the whole model is
  tweakable in one place.
- Scroll progress **builds the roof in five stages**: rafters/decking →
  synthetic underlayment → ice shield & copper drip edge → shingles (each tab
  cascades in individually, staggered like real courses) → ridge vent & caps,
  ending with the windows glowing warm.
- A **camera** (translate + scale written to the SVG group's `transform`
  attribute) holds an angle over the house and glides to whichever part of the
  roof is being worked on. Note: framer-motion ignores a raw `transform`
  style on SVG elements, which is why the camera writes the attribute itself.
- One **info card per stage** transforms in and out (blur, tilt, rise) with a
  stat and plain-language copy.

## Other showcased features

| Feature | File |
| --- | --- |
| Scroll-smoothing + anchor easing | `components/SmoothScroll.tsx` |
| Depth-tilt section transitions | `components/DepthSection.tsx` |
| Parallax ambient washes (light theme, no stars) | `components/DuskSky.tsx` |
| Hero with staggered reveal + the finished house (`FinishedHouse`) | `components/Hero.tsx` |
| Infinite trust marquee | `components/TrustMarquee.tsx` |
| Count-up stat band | `components/Stats.tsx` |
| Draggable before/after comparison slider | `components/BeforeAfter.tsx` |
| Scroll-drawn process timeline | `components/Process.tsx` |
| Auto-advancing testimonial carousel | `components/Testimonials.tsx` |
| Height-animated FAQ accordion | `components/FAQ.tsx` |
| Floating-label form with validation + success animation | `components/QuoteCTA.tsx` |
| Scroll-aware glass nav + mobile sheet menu | `components/Nav.tsx` |

All brand copy lives in `data/site.ts` — re-skinning the demo for another
trade is mostly a matter of editing that file and the accent colors in
`app/globals.css`.

Accessibility: every animation collapses under `prefers-reduced-motion`
(the roof builder renders as a static grid), controls are keyboard-operable,
and the comparison slider exposes a proper `role="slider"`.

Several motion primitives (`DepthSection`, `SmoothScroll`, `Reveal`) are
ported from the YANIGLOS portfolio project.

---
name: testing-hsmart-scroll
description: How to run and manually scroll-test the hsmart (형서마트) Next.js portfolio locally, including the sticky corner/Passage scroll scenes and checkout receipt.
---

# Testing the hsmart scroll-driven portfolio

## Running locally
- Repo lives at `~/hsmart` (may be a plain checkout with no `.git`, so git tools can fail — that is fine for runtime testing).
- `pnpm` may not be installed in the box image. If `pnpm dev` fails with "No such file or directory", use `npm run dev` instead (deps are already vendored in `node_modules`).
- App serves on http://localhost:3000. No login, no secrets, no external API required.
- Static art assets live in `public/mart/*.png` (corner backgrounds, passage/route backgrounds, side-walking character sprites). Verify they load with
  `curl -s -o /dev/null -w "%{http_code}" localhost:3000/mart/<name>.png` — the Next dev log does not print static asset requests, so grepping the log for 404s proves nothing.

## Page structure (important for scroll testing)
- Everything below the intro only mounts **after clicking "장보기 시작하기 →"** in the intro checklist (`components/mart-intro.tsx` gates `MartAisle` + `MartSections` behind `started`). If you jump to a scroll offset without clicking start, the page will look empty/short.
- The page is a stack of tall sticky sections. Section heights are data-driven so each work set gets its own dwell: coding is `AISLE_BASE_VH + projects * AISLE_PROJECT_VH`, every other corner is `ZONE_BASE_VH + sets * SET_VH` (4 works per set), checkout is `CHECKOUT_BASE_VH + items * CHECKOUT_ITEM_VH`, and every `Passage` is a flat `PASSAGE_HEIGHT`. Scroll position determines animation phase; there are no clickable animation controls. Dwell is measured in 100px wheel notches: a work set should hold for roughly 15 notches and a checkout item for ~5 before the next one arrives.
- Reliable technique: use `computer` mouse `scroll` a few clicks at a time and take a screenshot after each step. Small increments (2–5 clicks) are needed to catch short-lived phases such as the structural panels covering the viewport.
- The annotated DOM is a good oracle: each section's `aria-label` plus the `<img src>` list tells you exactly which background and which character sprite (`cart-side-still.png` vs `cart-side-walk.png`) is currently active, which is how you prove the walk/still sprite alternation rather than eyeballing the video.
- Corner zones show the front-facing `/cart-character.png`; passages show only the side-view sprite.

## Hover detail expectations
Every corner has in-place hover details (no floating card, no modal): the hovered work expands where it stands and its siblings drop to opacity 0.72. The field set differs per `Category.kind` in `lib/portfolio.ts` — coding `TOOLS/MY ROLE/POINT`, design `CONCEPT/DESIGN/MY ROLE`, cardnews `TOPIC/FORMAT/POINT/MY ROLE`, cafe24 `PLATFORM/WORK/POINT/MY ROLE` — and each row only renders when the work supplies that field. Assert by hovering a shelf frame and diffing its bounding box (height grows, x stays put) rather than looking for a detail node elsewhere in the DOM. Note each grid child is a presentation wrapper (scroll-driven card stacking / drop-in); the dim lives on its first child, so read opacity one level deeper.

Cardnews is the exception: it has no expanding row block — on hover its image gets `filter: blur(4px) brightness(0.92)` and an in-card overlay (title / topic / format / `VIEW PROJECT`) fades to opacity 1, so assert on those computed styles, not on height growth. Every work frame is also `role="button"`: clicking a work with a real `link` opens it in a new tab, and a work without one (`link` missing or `"#"`) opens the in-page lightbox (`div[role="dialog"]`, image `object-contain`, closes on Escape / backdrop / CLOSE).

## Checkout expectations
Checkout section slides every work from `lib/portfolio.ts` across the counter (each dips ~7px while passing the scanner, then settles centred), and after the last one a receipt prints upward from the counter front with the category counts, `TOTAL n ITEMS`, and `마음에 드셨다면, 형서를 데려가세요.`. Recompute counts from `lib/portfolio.ts` rather than hard-coding them.

## Devin Secrets Needed
None.

# Mindstor AI website

Landing site for Mindstor AI, a product studio for web products, apps, and AI-powered software.
Built with Vite, React 18, TypeScript, and three.js.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

| Command             | What it does                                   |
| ------------------- | ---------------------------------------------- |
| `npm run dev`       | Dev server with hot reload                     |
| `npm run build`     | Type-check, then production build into `dist/` |
| `npm run preview`   | Serve the production build locally             |
| `npm run typecheck` | TypeScript only                                |
| `npm test`          | Unit tests (Vitest)                            |

## The loading screen

`src/components/LogoLoader.tsx` is the first thing visitors see: glowing shards swirl, lock into the
Mindstor AI brain mark, the wordmark fades in, then the screen lifts away (about 5 seconds).

- It plays once per browser session. Add `?loader` to the URL to force it while you work on it.
- A **Skip** button is always available.
- `prefers-reduced-motion` shows the finished mark for about a second, with no animation.
- No WebGL: the flat SVG logo is shown instead, then the site continues.
- Timing constants (`ASM_START`, `ASM_END`, `HOLD_END`) are at the top of the file.

## Project layout

```
src/
  data/logo.ts            13 logo facets (single source for nav, favicon, ticket, loader, hero) + brand colors
  data/content.ts         All page copy: nav, services, core values
  three/common.ts         Renderer, lighting, disposal helpers
  three/logoGeometry.ts   Builds the extruded 3D logo pieces
  components/             LogoLoader, Hero3D, Nav, Sections, LogoMark
  lib/validate.ts         Access-form validation (tested)
  index.css               Design tokens and all styles
```

Edit copy in `src/data/content.ts`; no component changes needed.

## Before going live

1. **Connect the Request Access form.** Create a form in Formspree, copy `.env.example` to `.env`, and set
   `VITE_FORM_ENDPOINT` to your Formspree endpoint (for example, `https://formspree.io/f/YOUR_FORM_ID`).
   The form submits JSON `{ name, email, brief }` and reports success or failure to the visitor.
2. **Review the copy** in `src/data/content.ts` (What We Make, the "Whole Product" value). Values 01, 02, 03,
   and 05 are based on the company documents; the rest was drafted for the product-studio positioning.
3. Fonts (Quicksand, Manrope) load from Google Fonts in `index.html`. Self-host them if you need to avoid that.

## Brand

Quicksand for headings and wordmark. Palette: Pink `#E12D9B`, Purple `#AD32C0`, Bright Pink `#FF4770`,
Coral `#FD6055`, Orange `#FE7045`, on a dark canvas (`#11091a` to `#05020a`).

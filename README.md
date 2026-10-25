# Portfolio

A creative portfolio landing page. It has a layered hero built from the supplied photograph and scroll-driven floating cards (GSAP + ScrollTrigger).

## Scripts

```bash
npm install
npm run dev        # dev server on http://localhost:5173
npm run build      # typecheck + production build to dist/
npm run preview    # serve the production build
npm run typecheck
npm run lint       # oxlint
npm run images     # regenerate hero images from source-assets/
```

## Where things live

- `src/styles/tokens.css`: design tokens
- `src/config/site.ts`: contact details, domain, sections and navigation (placeholders)
- `src/content/`: copy and data
- `src/components/hero/`: the landing hero
- `src/components/floating/` and `src/animation/`: the reusable scroll-driven card system

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for how the pieces fit together and how to add sections or pages.

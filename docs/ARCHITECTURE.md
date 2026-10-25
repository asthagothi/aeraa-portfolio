# Architecture

A three-page portfolio built with Vite, React 19, TypeScript, CSS Modules and GSAP (with ScrollTrigger). It uses a small built-in router and no UI library.

## Pages and routing

| URL | Page | File |
|---|---|---|
| `/` | Home: the original hero, the foldable-device experience, Creative Corner, then Contact (a Thank You section will follow) | `pages/HomePage.tsx` → `components/hero/HeroSection.tsx` + `components/fold/FoldHome.tsx` + `components/creative/CreativeCorner.tsx` |
| `/work` | Work: the reference-style project grid, work history and the Ssensazione case study | `pages/WorkPage.tsx` |
| `/work/<slug>` | Old placeholder case pages: redirect to `/work` | `App.tsx` (`Redirect`) |
| `/journal` | Old address: redirects (replacing the history entry) to `/#creative-corner` | `App.tsx` (`Redirect`) |
| anything else | Not found, with links back | `pages/NotFoundPage.tsx` |

- **Router** (`src/router/`): real URLs through the History API, plus back/forward with scroll restoration, hash links and direct loading. `navigate(to, { replace: true })` swaps the current history entry (used by redirects). After a route change to a `#hash`, the router re-measures ScrollTrigger first and then jumps, so pinned sections above the target are accounted for. Use `<Link to>` for in-app links; it renders a real `<a href>`. The route table is in `App.tsx`, and page paths, labels and titles are in `config/site.ts` (`routes`).
- **Hosting:** the server must return `index.html` for unknown paths (SPA fallback). Vite's dev and preview servers already do; for static hosting add a rewrite from `/*` to `/index.html`.
- **Shell** (`components/shell/`):
  - `SiteNav` is the fixed navigation, with a dot under the active page and a full-screen menu on phones.
  - `PageTransition` is the sage-then-cream wipe. It swaps the page while the screen is covered (~0.3s), and is instant with reduced motion.
  - After each navigation, focus moves to `<main>`, and a skip link is provided.

## Layers

| Layer | Location | Owns |
|---|---|---|
| Design tokens | `src/styles/tokens.css` | Every color, font size, space, radius, shadow, duration and z-index, plus the `.theme-studio` palette for Pages 2 and 3. |
| Typography roles | `src/styles/typography.css` | Page 1 roles (`.t-eyebrow`, `.t-display`, …). |
| Motion tokens | `src/design/motion.ts` | GSAP durations and eases, plus `motionQuery` (`scene`, `light`, `any`) shared by every scroll scene. |
| Config | `src/config/site.ts` | Routes, navigation, the brand name, and Page 1 contact details. |
| Content | `src/content/*.ts` | All copy and data (`home.ts`, `work.ts`, `creative.ts`, `page2.ts`; `hero.ts` for the hero). |
| Components | `src/components/<area>/` | Presentation. Each has its own `.module.css`. |
| Animation | `src/animation/` | `fold.ts` (home), `collage.ts` (the work page), `reveal.ts` (fade-ups), the floating-card engine and its presets. |
| GSAP setup | `src/lib/gsap.ts` | The only place plugins are registered. |

## Studio theme (every page)

- **Site palette** (whole site): Blue `#C4DAE8`, Butter `#FEEFB8`, Chocopie `#432F2E`, Silent Ocean `#0F3C65`, Vanilla Beige `#FAF1CA`, Pearl `#EAE0C8` and Slate Gray `#708090`, plus tints and shades of them. Vanilla Beige is the page background, Pearl the journal paper, and Silent Ocean the stats band, one project panel, the giant name and a device finish. Slate Gray is decorative only (under 4.5:1 against every colour here), so it never carries text. Body text is a deeper Chocopie (`#2E201F`) for contrast. `--texture-grain` (in `:root`) is a fine paper-grain layer used over page backgrounds, but not over the hero, whose wall must match the photo exactly. The values are in `styles/tokens.css`: `--palette-*`, the hero tokens (`--color-*`) and `.theme-studio` (`--studio-*`; the names are historical, from the first green palette). A few page-level backgrounds repeat the Vanilla and Pearl hex values: `body[data-theme]` in `base.css`, `SiteNav.module.css`, `PageTransition.module.css`, `JournalPage.module.css`, `Lightbox.module.css` and `FoldHome.module.css` (device finishes, glow, glass). Update those if the palette changes.
- **Hero photo:** `npm run images` builds `portrait-palette-*.webp`. The bare background is tinted row by row to the exact hero canvas colour behind it (the desktop placement: the photo spans 10.8%–94% of the hero), keeping each pixel's own light and shade, so photo and page meet without a seam. Only neutral, light pixels are tinted; the computers, their screens, the colour chart and the camera keep their colour. The cut-out is composited back on top, so the person keeps natural colour. Edges are feathered (7% sides, last 5% at the bottom), so the floor props stay solid.
- **Contrast** (WCAG): text on Vanilla is at least 6.3:1 (body text 13.8:1) and on Pearl 5.4:1, Butter on Chocopie 10.8:1, Vanilla on Silent Ocean 10:1, and the Chocopie hero headline on the Blue wall 8.6:1.
- **Type system:** one family, **Sofia Sans**. Its Extra Condensed cut (`--font-condensed`, `--font-display`; weights 700 and 800) sets every heading, title and figure, in heavy upper case like "What I do". The regular width (`--font-ui`, variable) sets body text, labels and buttons. Vogue (`--font-logo`) is kept only for the logo "Aeraa". No other font is loaded (`styles/fonts.ts`).

## Home, second half — the fold (`components/fold/FoldHome.tsx`, `animation/fold.ts`, `content/home.ts`)

- **Story:** a folded phone sits in front of the backdrop. Its lock screen shows your cut-out portrait, a live clock, two notifications, Pinterest and YouTube buttons, and "Scroll to unfold". Scrolling swings it open like a book into a near-full-screen tablet. While it is open, the page scroll moves its screen through the split home screen, the figures, selected work, "What I do", "Find me on" and a closing card, one pixel of page scroll for one pixel of screen. The screen then goes dark and the device folds shut into an "incoming call" screen with the email action, followed by Creative Corner.
- **How the fold is built:** the device is always laid out at its open size.
  - `body` is the open device (frame + inner screen). It is clipped to its right half while folded.
  - `cover` is a page hinged on the centre line. Its front face is the outer screen (lock and call layers). Its back face holds a decorative copy of the opening screen (`inert`, `aria-hidden`), so the back of the swinging page shows the left half of the home screen.
  - When the page lands, the clip is removed and the cover hidden. Shade layers darken each face as it turns away.
- **Timeline** (`createFoldTimeline`): it is measured in scroll pixels. The phases are:
  - unfold (1 viewport height);
  - open (0.6 viewport heights of page scroll; the screen scrolls itself, independently);
  - fold shut (1 viewport height);
  - a final hold on the call screen.

  The stage is pinned. `measureGeometry` sizes the open device (at most 78% of the width and 80% of the height), and the timeline is rebuilt on resize. The whole sequence is **one scrubbed timeline driven by one value, the page's scroll position**: unfold, a short hold, the content's `translateY` (its travel is the content's measured height minus the screen's, 1:1 with scroll), a short hold, fold, call. Nothing inside the device scrolls on its own, and no wheel or touch input is intercepted, so mouse wheel, trackpad, touch, keyboard and scrollbar behave the same, and scrolling back reverses the timeline exactly. The screen (`[data-screen]`) clips the content and is reset to `scrollTop = 0` if focus scrolling moves it. The dock's active item is derived from the scroll position and section offsets, and React state is set only when the item changes. Dock buttons and keyboard focus scroll the page to the matching content position (`scrollToContent`). The timeline is rebuilt on resize, and when a ResizeObserver sees the content's height change, the content currently on screen is kept in place. The pin uses `anticipatePin`. **Lock screen:** a depth wallpaper made from the hero's own files, already loaded: the original photo, the clock, then the pixel-aligned cut-out over her, so the clock tucks behind her hair as on a phone. It settles from a slight zoom during the hand-off. (A cut-out that flew from the hero into the phone was removed: with the chair and cord it read as pasted.) Every portrait `<img>` shares the srcset and `PORTRAIT_SIZES` in `components/hero/portrait.ts`, so each file downloads once. **Weight:** the phone's wrapper (`[data-float]`) lags up to 14px and tips up to 3° with scroll momentum, then settles (quickTo, 0.9s). **Falling entrances** (after the reference, on mobile and inside the phone): each `[data-drop]` block falls into place the first time it enters view, settling on cubic-bezier(0.16, 1, 0.3, 1) over 0.8s, with blocks staggered 80ms. An IntersectionObserver triggers them, so it works inside the phone's screen and in the flow. The variant is the attribute's value: paragraphs (40px with a 3° skew), `label` (20px from the left), `row` (96% scale, 32px), `panel` (96% scale, 48px), `screen` (the lock and call cards, static flow only), and `letters` (headings via `FallText`, whose letters fall 72px with an 8° lean, 18ms apart; screen readers get the plain text). **Hand-off from the hero** (`motionQuery.fold` only): over the screen of scrolling before the pin and a quarter-screen past it, the hero recedes (parallax, slight scale-down and fade, in HeroSection) while the phone section slides over it. The section's top edge starts in the hero's floor colour (`.seam`) and dissolves. The phone rises, straightens and grows along one curve (P = A·(1 − u)^1.6) that never moves it above its section and brings it to rest with zero speed after the pin engages, as the unfold begins (the unfold now starts the moment the stage pins).
- **Atmosphere** (the stage background under every backdrop): slowly drifting colour fields (Blue, Butter, Pearl, a Slate haze and a touch of Silent Ocean) on Vanilla, two fine Slate rings framing the device, and paper grain. The drift stops with reduced motion. On phones the page gets the same colour fields at the top.
- **Controls under the device** (scene only): five finishes (Chocopie, Silent Ocean, Blue, Slate Gray, Butter) recolour the frame, and three backdrops are available: Basic (the giant name), Glow (a Blue, Slate and Butter halo) and Wheel (`QuestionWheel.tsx`, `wheel.ts`). Wheel is two 3D picker drums of questions either side of the folded device, sized to the space beside it. They turn with scroll through the section (two full turns, scrubbed); the question facing the viewer is lit and opens an email with itself as the subject. The questions live in `wheelQuestions` in `content/home.ts`. Both choices are remembered per visitor in `localStorage`, and the page works without it. Finish colours are in `FoldHome.module.css` (`[data-finish]`), and the options are in `content/home.ts`.
- **Modes:** the pinned scene runs only with motion allowed on screens at least 900×600. Phones, short screens, reduced motion and no-JS get a static stack: the lock screen as a phone card, the content as normal sections, and the call screen as a phone card.
- **Smooth scrolling over the device:** smoothing comes only from the timeline's `scrub` (0.6s), which always converges on the scroll position. The device has no clip-path while open (the clip would force full repaints on every scroll), the background fields are radial gradients rather than live blur filters, and Creative Corner's loop writes nothing on idle frames.
- **Keyboard:** the content and dock fade by opacity only, so their links stay in the tab order. Focusing one opens the device (scrolls the page into the open window), and the browser scrolls the screen to the focused element. Focusing a lock-screen or call-screen control scrolls to the folded start or end. The dock buttons open the device if needed and scroll the screen to their section.
- **Static mode:** the device wrappers become `display: contents` and the parts are reordered: lock card, sections, call card. The back face, dock, status bar and controls are hidden.
- **What I do** (inside the screen): four service groups (copy as supplied) in a ruled 2×2 grid, then "Tools & technical skills" as a separate panel, with design tools and technical foundations in two groups (`toolGroups` in `content/home.ts`; no proficiency levels claimed).
- **One grid inside the screen** (at container widths of 760px and up): every section's text starts at 4cqi, and every second column starts on the centre line. Two-column rows use `column-gap: 0`, and the left item carries the gutter as padding. Full-width panels (category cards, the toolkit, the call to action) extend 2cqi past the text edge, so the text inside them still sits on the grid. Grid rules that later base rules would override go in a container block at the end of the file.
- The hinge crease fades out while the device is open, so it never runs through headings. The giant name behind the device uses wide tracking, so its letters flank the device and the whole word stays inside the screen.
- **About + Work** (`components/fold/SelectedWork.tsx`, `content/selectedWork.ts`): inside the screen, after the home screen. "A little about me" (half-and-half grid, text on the centre line), then **Work**: a header (title, intro, "All projects") and one panel per category, each a header row (number, title, description, Explore) above a grid built for its proportions (a logo pair, the Ssensazione case-study panel with applications, browser frames, two platform collections). Images unfold as they enter view and open in the viewer.
- **Work assets:** originals downloaded from the shared Google Drive folder into `source-assets/drive/` (`freelance/`, `pinterest-youtube/`). `npm run images` publishes only the files listed in its `USED` map, under stable names, to `src/assets/selected-work/` (480px and 1200px WebP), and writes `content/selected-work-manifest.json`. Analytics charts, an unrelated dashboard screenshot and two broken slivers are not published. At the time of writing, the Drive folders "Logo design & branding", "Social creatives" and "Website UI/UX" were empty.
- **Contact:** `call.email` in `content/home.ts` (aeraaa07@gmail.com) makes the call screen's "Slide to talk" a `mailto:` link. If it's set to `null`, the screen shows "Email address to be added" instead.
- **Content:** every figure comes from `content/page2.ts` or `content/work.ts`, and the selected work is the same `projects` list as /work.

## Home — Contact (`components/contact/ContactSection.tsx`)

- After Creative Corner, anchor `#contact` (`sections.contact`); the nav's "Contact" and the phone's Contact / Say hello buttons go here. It sits outside every scroll scene, so nothing folds or hides it.
- A dark panel ruled into columns by hairlines (adapted from the supplied contact reference; the lines sit between columns, never through text). It contains: a short blurb; "Let's work together"; the email (from `call.email` in `content/home.ts`) as a `mailto:` link, plus "Write to me" and "Copy email"; Index; What I do; and Elsewhere (`elsewhere`: Pinterest, YouTube, and Instagram from the YouTube About panel). No phone, address or LinkedIn, because none were supplied.
- "ASTHA GOTHI" closes the panel. It is sized in container units of the frame (20cqi; the frame, max 1400px wide, is the container), so it always fits inside the frame on any screen. The section is also a container, because the frame's own column layout has to query its parent.
- **Thank You:** the final section goes after Contact (marked in `pages/HomePage.tsx`). Not designed yet: waiting for its reference.

## Home, first half — hero (`src/components/hero/`)

- `HeroSection` owns the composition and the entrance timeline; child components own only how they look.
- The stage keeps the reference's 1397×1008 proportions (at least 1000px wide) and is a CSS size container.
- The layout changes at these sizes:
  - **Desktop:** an alignment grid. The figure's centre sits on the headline's axis, and the card columns are mirrored.
  - **`@container (max-width: 1180px)`:** compact spacing.
  - **768–1023px or portrait tablet:** a 3:4 stage.
  - **Phones:** a stacked flow.
- Layering: photo, then headline, then the background-removed cut-out.

## Work page (`pages/WorkPage.tsx`, data from `content/selectedWork.ts`)

- **Content:** only real projects and supplied copy, the same data as the phone's Work section (`projects`, `projectImageIds`, `workCategories`, `experience`). No placeholders, and `brief` / `role` render only once supplied.
- **Layout, after the reference site (nikastern.framer.media):** faint lines mark four columns down the whole page (two edges on phones). A loader (`components/work/WorkLoader.tsx`, rendered into the body so it covers the nav; plays each time /work opens, skipped with reduced motion) shows four near-black columns with lens-bowed dividers: one digit of the year rises into each in red, the corner squares light up in turn and a red line grows along the bottom, then the columns lift away. Every section header puts "[ 0n ] Label" in the first column and the title (letters rising) from the second.
- **Order:** hero (a four-column meta row, "WORK" with "AERAA" faded beneath, a dark sections box with counts); a strip (three thumbnails, the role, the roles line); 01 Approach (the Work intro lighting up word by word on scroll, the About text, "See the work"); 02 Freelance, 03 UI/UX & Website Design, 04 YouTube & Pinterest Content, each a section header with Astha's category copy above one wide card and three cards (`components/work/WorkSection.tsx`, `workGrid`); 05 Experience as a dark notes panel; 06 the Ssensazione case study (rows: heading in the first column, text across the rest); 07 Index, every project as a ticket row (thumbnail, kind, year where known, name, type, status tag); contact panel.
- **Motion:** the page observer marks [data-drop] blocks in as they enter (staggered 70ms): paragraphs fall with a slight skew, labels slide in, buttons and panels rise from 96%, headings rise letter by letter, and photos settle from a zoom inside their frames.
- **Viewer:** every image opens in the shared Lightbox, scoped to its group.
- The old collage page's files (`content/work.ts`, `animation/collage.ts`, `components/work/CollageVisual.tsx`, `pages/CasePage.tsx`) are no longer mounted.

## Home, third section — Creative Corner (`components/creative/CreativeCorner.tsx`, `content/creative.ts`)

- **Placement:** the third section of the home page, after the phone section (anchor `#creative-corner`, `sections.creative` in `config/site.ts`). The nav's "Creative Corner" links to `/#creative-corner`, and the old `/journal` address redirects there, so there is one Creative Corner. Heading (an `<h2>`, since the hero owns the page's `<h1>`): "Creative Corner" / "Paintings, sketches, and things I make."
- **3D orbit:** one perspective space (`.space`) and one `preserve-3d` scene, so the browser layers the focal piece and every card by real depth (no z-index). The large focal piece is set back (`translateZ(--focal-z)`, about -0.14 × the orbit radius). The cards travel a tilted ellipse around it: x = sin θ · rx, z = cos θ · rz, y = cos θ · ry (the front is lower). Front cards are nearer, so they render larger and in front of the focal piece; back cards render smaller, higher and behind it. Each card also turns slightly toward the centre (`rotateY`), keeps a small fixed tilt, and is shaded by depth (`--shade`).
- **Scroll:** the stage is pinned, and scroll progress sets the orbit angle (about 0.32 viewport heights per piece). The angle is eased every frame with no snapping, and transforms are written straight to the DOM, so React only re-renders when the focal piece changes. The card travelling behind the focal piece fades out and becomes the focal piece (cross-fade), so the same artwork is never shown twice.
- **Interaction:** every card is a button (hover or focus lifts it and shows its label; click opens the shared `Lightbox`); View opens the focal piece; ← / → (buttons and arrow keys) step one piece; the mouse tilts the scene slightly.
- **Modes:** with reduced motion the orbit stays still (no pin) and the buttons step it instantly. Phones get the same orbit with smaller radii, cards and perspective. Without JS, the focal piece is shown above a simple centred row.
- **Artwork files:** originals in `source-assets/creative/` (`NN-short-name.jpg`). `npm run images` builds 480px and 1200px WebPs in `src/assets/creative/` and writes `content/creative-manifest.json` (sizes, for ratios); `17-painting-lineup` has its black letterbox trimmed. Images are shown with `object-fit: contain`, never cropped. Labels describe what each piece shows; no invented titles, dates or stories.
- **To add a piece:** add the photo to `source-assets/creative/`, run `npm run images`, and add an `art(...)` entry in `content/creative.ts`.
- The previous journal page (`pages/JournalPage.tsx`, `content/journal.ts`) is kept but not mounted.

## Adding things later

1. **New page:** add it to `routes` in `config/site.ts` (it appears in the nav automatically), create `pages/<Name>Page.tsx` and call `useDocumentTheme` in it, then add it to the route table in `App.tsx`.
2. **New project:** add a `Project` to `content/work.ts`. It appears on /work and gets a case page automatically.
3. **New Creative Corner piece:** see the Creative Corner section above.

## Pins and Pinterest data (`content/page2.ts`)

- Pins are from the styleaeraa Pinterest **Created** tab. The originals are in `source-assets/page-2/pins/`, and `npm run images` builds 360px and 600px WebP versions in `src/assets/pins/`.
- **Analytics:** each figure keeps the exact text Pinterest displayed (`shown`) next to its readable form and its definition, with the date range from `source-assets/page-2/`.
- **Profile figures:** 382.6k monthly views and 102 followers, as shown on 23 Oct 2026.
- **Affiliate:** `affiliate.storefrontUrl` is the Amazon link from the profile. Affiliate links get `rel="sponsored"`, and the disclosure is shown beside them.

## Legacy, not mounted


- `components/page2/`: the earlier single-scroll Pinterest page (board scene, gallery, reach, affiliate journey, outro).
- `components/floating/`: the floating-card scene (`content/demoCards.ts`).

They're kept for reuse; delete them if you don't need them.

## Placeholders to replace

- `content/work.ts`: the four placeholder projects (freelance ×2, graphic, UI), YouTube thumbnails, and the `TODO:` approach fields.
- `styles/tokens.css` (`.theme-studio`): your final palette.
- `content/home.ts`: `call.email` (your contact address) and the intro line.
- `config/site.ts`: `brand` (shown in the nav).

## Assets

The original images are in `source-assets/` and are never modified. `npm run images` (`scripts/optimize-images.mjs`, using sharp) builds the hero photo, the cut-out and the pin WebPs.

## Accessibility notes

- The giant name behind the device is decorative (`aria-hidden`). The home screen's own `<h1>` carries the name.
- Studio text colours: `--studio-ink` and `--studio-ink-muted` on cream meet WCAG AA.
- Decorative collage fragments are hidden from assistive technology. In the work scene, only the active slide's title and link are focusable (the others are `inert`).


## Smooth scroll and cursor

- **Smooth scroll** (`src/lib/smoothScroll.ts`, started in main.tsx): Lenis with lerp 0.07, matching the reference's glide, driven by GSAP's ticker with `ScrollTrigger.update` on every Lenis scroll. Touch, keyboard and the scrollbar stay native; the image viewer `<dialog>` and `[data-lenis-prevent]` keep their own scrolling; it is off with reduced motion. All scripted scrolls go through `scrollToY` / `scrollToElement`.
- **Cursor** (`components/shell/Cursor.tsx`, fine pointers only): a 10px dot that follows the pointer exactly. In the site palette, flipping contrast with the surface like the reference: Silent Ocean on light surfaces with a subtle haze in its own colour, and Butter on dark ones with a strong glow (three layered box-shadows, after the reference). Over photos it is the glowing Butter dot with a hairline Silent Ocean edge. Over `[data-cursor="view"]` (Selected Work cells, Creative Corner cards) it becomes a Chocopie glass "View" pill with a Blue mark and a Butter label. The surface is the first opaque background up the tree from the element under the pointer, re-read on move and on scroll, at most once per frame. The native cursor returns over the image viewer.

## Toolkit logos (Section 2, tools panel)

- Real logos in their official colours (Devicon, MIT; licence in `src/assets/tools/`), standing on their own with no tile, each with a soft drop-shadow glow in its brand colour (`--glow`, set per logo in `toolGroups` in `content/home.ts`). Django and GitHub use their white marks for the dark panel. "SQL & database fundamentals" uses our own neutral database glyph, since no product is named.

## Sitewide details

- **Favicon:** `public/favicon.svg`, an Aeraa monogram (a Didone "A" echoing the Vogue lettering, Butter on Chocopie, so it holds on light and dark browser chrome), plus `public/apple-touch-icon.png`. `public/og-image.png` (1200×630: the portrait, name and roles) is the social-sharing image; `index.html` holds the title, description, Open Graph and Twitter tags (make `og:image` absolute once the site has a domain).
- **Navigation:** Home, Work, What I do, Creative Corner, Contact. "What I do" (`/#what-i-do`) reaches the services inside the pinned phone through a registered hash target (`router/hashTargets.ts`): the router tries registered handlers before plain element scrolling, and FoldHome maps the section to its page position. FoldHome measures content offsets in layout space (`offsetWithin`), so the device's entrance tilt and scale can't skew them. The phone scene calls `ScrollTrigger.sort()` before refreshing, so triggers further down (Creative Corner) are measured in page order even when the scene is created after them (crossing into desktop size).
- **Contact actions:** one copy hook (`lib/useCopy.ts`) behind every "Copy email" (Contact section, the hero contact card, the phone's call screen), each with a live announcement. The hero contact card shows the portrait and two real buttons (copy, email). The call screen replaced its mock "Slide to talk" with "Email me" and "Copy email".
- **Hero:** the intro card and contact card stack in one column on desktop (`.leftCol`), so they never overlap however tall the card is; tablet and phone keep their own positions.
- **Copy:** descriptions are Astha's own words: About (`about` in content/selectedWork.ts), the four What I do services (`services`), the work category descriptions, per-platform descriptions (`collections[].title/description`, shown in the phone and on the Work page), the two skills groups (`toolGroups[].note`), Creative Corner's "Where it began" (`creativeIntro.story`, in an introduction above the pinned stage), and the Contact line.
- **Technical skills layout:** an editorial spread: the two groups side by side (container ≥ 760px) with italic serif headings and descriptions; tools as icon-over-name, four across only at container ≥ 1080px (the open device), two across below. The phone's Ssensazione case study sits side by side only at container ≥ 1000px.

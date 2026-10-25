// Builds web-ready images (hero photo + Page 2 pins) from the originals in source-assets/.
// Run with: npm run images
// Originals are never modified. Outputs go to src/assets/hero/ and are committed.
import { mkdir } from 'node:fs/promises'
import sharp from 'sharp'

const SRC = 'source-assets'
const OUT = 'src/assets/hero'
const WIDTHS = [640, 1024]

const jobs = [
  // Full photograph: keep it close to lossless so the portrait is not degraded.
  { input: `${SRC}/portrait.webp`, name: 'portrait', webp: { quality: 90 } },
  // Background-removed cut-out, layered above the headline. Alpha must survive.
  { input: `${SRC}/main-model.png`, name: 'portrait-cutout', webp: { quality: 90, alphaQuality: 100 } },
]

await mkdir(OUT, { recursive: true })

for (const job of jobs) {
  const meta = await sharp(job.input).metadata()
  for (const width of WIDTHS) {
    const file = `${OUT}/${job.name}-${width}.webp`
    const pipeline = sharp(job.input)
    // At native width, re-encode at near-lossless settings instead of resizing.
    if (width < meta.width) pipeline.resize({ width })
    const info = await pipeline.webp(width >= meta.width ? { ...job.webp, quality: 95 } : job.webp).toFile(file)
    console.log(`${file}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`)
  }
}

// ---------------------------------------------------------------------------
// Palette version of the photograph: the studio's bare background is tinted to the hero canvas
// row by row (the exact page colour behind each row), keeping each pixel's own light and shade.
// Only neutral, light pixels are tinted; colourful or dark ones (the computers and their screens,
// the colour chart, the camera) keep their colour.
// Then the background-removed cut-out is composited back on top so the person keeps natural colour.
// → src/assets/hero/portrait-palette-<width>.webp
// ---------------------------------------------------------------------------
// The hero canvas behind the photo (HeroSection.module.css): --color-canvas-top at 0%,
// --color-canvas at 62%, --color-canvas-bottom at 100% of the hero's height.
const CANVAS = [
  [0, [195, 217, 230]],
  [0.62, [192, 212, 226]],
  [1, [242, 233, 190]],
]
const canvasAt = (t) => {
  let i = 1
  while (i < CANVAS.length - 1 && t > CANVAS[i][0]) i++
  const [t0, c0] = CANVAS[i - 1]
  const [t1, c1] = CANVAS[i]
  const u = Math.min(Math.max((t - t0) / (t1 - t0), 0), 1)
  return c0.map((v, k) => v + (c1[k] - v) * u)
}
// Where a row of the photo sits on the hero (desktop): the photo starts 10.8% down the stage and is
// 0.6 stage-widths tall, the stage being 1008/1397 of its width tall.
const PHOTO_TOP = 0.108
const PHOTO_SPAN = 0.6 / (1008 / 1397)
const smooth = (lo, hi, x) => {
  const t = Math.min(Math.max((x - lo) / (hi - lo), 0), 1)
  return t * t * (3 - 2 * t)
}
{
  const { data, info } = await sharp(`${SRC}/portrait.webp`).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width, height } = info
  // Reference brightness of the bare wall and floor, sampled from the photo's corners and foot.
  const lumAt = (x, y) => {
    const i = (Math.round(y) * width + Math.round(x)) * 3
    return 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
  }
  const avg = (pts) => pts.reduce((sum, [x, y]) => sum + lumAt(x, y), 0) / pts.length
  const wallL = avg([[width * 0.06, height * 0.1], [width * 0.94, height * 0.1], [width * 0.06, height * 0.4], [width * 0.94, height * 0.4]])
  const floorL = avg([[width * 0.5, height * 0.985], [width * 0.6, height * 0.97], [width * 0.4, height * 0.99]])
  const mapped = Buffer.alloc(data.length)
  for (let y = 0; y < height; y++) {
    // The wall meets the floor about 87% down; blend the two tints over a short band there.
    // Tint each row to the page colour right behind it, so the photo and page meet without a seam
    // (the floor no longer fades through a mismatched colour). Shade is relative to the bare wall
    // or floor at that height, so shadows and the room's light are kept.
    const f = smooth(0.82, 0.92, y / height)
    const target = canvasAt(PHOTO_TOP + PHOTO_SPAN * (y / height))
    const refL = wallL + (floorL - wallL) * f
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 3
      const r = data[i], g = data[i + 1], b = data[i + 2]
      const l = 0.299 * r + 0.587 * g + 0.114 * b
      // Weight: 1 for grey and light, fading to 0 for colourful or dark pixels.
      const w = (1 - smooth(10, 26, Math.max(r, g, b) - Math.min(r, g, b))) * smooth(110, 160, l)
      const shade = Math.min(l / refL, 1.12)
      for (let k = 0; k < 3; k++) {
        const t = Math.min(255, target[k] * shade)
        mapped[i + k] = Math.round(data[i + k] + (t - data[i + k]) * w)
      }
    }
  }
  const composed = await sharp(mapped, { raw: info })
    .composite([{ input: `${SRC}/main-model.png` }])
    .png()
    .toBuffer()
  for (const width of WIDTHS) {
    const file = `${OUT}/portrait-palette-${width}.webp`
    const pipeline = sharp(composed)
    if (width < info.width) pipeline.resize({ width })
    const out = await pipeline.webp({ quality: width >= info.width ? 95 : 90 }).toFile(file)
    console.log(`${file}  ${out.width}x${out.height}  ${(out.size / 1024).toFixed(0)} KB`)
  }
}

// ---------------------------------------------------------------------------
// Page 2 pins: source-assets/page-2/pins/*.jpg (downloaded from the styleaeraa
// Pinterest "Created" tab) → src/assets/pins/<name>-360.webp / -600.webp
// ---------------------------------------------------------------------------
const PIN_SRC = `${SRC}/page-2/pins`
const PIN_OUT = 'src/assets/pins'
const PIN_WIDTHS = [360, 600]
const { readdir } = await import('node:fs/promises')

await mkdir(PIN_OUT, { recursive: true })
for (const file of (await readdir(PIN_SRC)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort()) {
  const name = file.replace(/\.[^.]+$/, '')
  for (const width of PIN_WIDTHS) {
    const out = `${PIN_OUT}/${name}-${width}.webp`
    const info = await sharp(`${PIN_SRC}/${file}`).resize({ width, withoutEnlargement: true }).webp({ quality: 82 }).toFile(out)
    console.log(`${out}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`)
  }
}

// ---------------------------------------------------------------------------
// Page 3 artwork (Creative Corner): source-assets/creative/*.jpg → src/assets/creative/
// <name>-480.webp / -1200.webp, plus creative-manifest.json with each original's size
// (the gallery uses the ratios for layout).
// ---------------------------------------------------------------------------
{
  const ART_SRC = `${SRC}/creative`
  const ART_OUT = 'src/assets/creative'
  const { writeFile } = await import('node:fs/promises')
  await mkdir(ART_OUT, { recursive: true })
  const manifest = {}
  // Photos with letterbox bars around them: trim the flat black border first.
  const TRIM = new Set(['17-painting-lineup'])
  const load = async (file, name) => (TRIM.has(name) ? sharp(await sharp(`${ART_SRC}/${file}`).rotate().trim({ background: '#000', threshold: 40 }).toBuffer()) : sharp(`${ART_SRC}/${file}`).rotate())
  for (const file of (await readdir(ART_SRC)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort()) {
    const name = file.replace(/\.[^.]+$/, '')
    const meta = await (await load(file, name)).metadata()
    manifest[name] = { width: meta.width, height: meta.height }
    for (const width of [480, 1200]) {
      const out = `${ART_OUT}/${name}-${width}.webp`
      const info = await (await load(file, name)).resize({ width, withoutEnlargement: true }).webp({ quality: width > 600 ? 84 : 80 }).toFile(out)
      console.log(`${out}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`)
    }
  }
  await writeFile('src/content/creative-manifest.json', JSON.stringify(manifest, null, 2) + '\n')
  console.log(`src/content/creative-manifest.json  ${Object.keys(manifest).length} works`)
}

// ---------------------------------------------------------------------------
// Home, Section 2 — Selected Work: originals downloaded from the shared Drive folder into
// source-assets/drive/ (freelance/, pinterest-youtube/). Each used file gets a stable name here →
// src/assets/selected-work/<name>-480.webp / -1200.webp, plus selected-work-manifest.json (sizes).
// Files not listed (analytics charts, an unrelated dashboard, broken slivers) are not published.
// ---------------------------------------------------------------------------
{
  const SW_OUT = 'src/assets/selected-work'
  const { writeFile } = await import('node:fs/promises')
  const USED = {
    'ssensazione-logo': 'freelance/f05.jpg',
    'logo-mark-fish': 'freelance/f11.jpg',
    'ssensazione-business-card': 'freelance/f06.jpg',
    'ssensazione-cake-care-guide': 'freelance/f09.jpg',
    'gift-voucher-beauty': 'freelance/f07.jpg',
    'bloom-nails-cards': 'freelance/f08.jpg',
    'type-poster': 'freelance/f10.jpg',
    'web-hi-im-mara': 'freelance/f01.jpg',
    'web-eleanor-profile': 'freelance/f02.jpg',
    'web-maison-rouge': 'freelance/f03.jpg',
    'web-astha-profile': 'freelance/f04.png',
    'youtube-channel': 'pinterest-youtube/p11.png',
    'youtube-shorts': 'pinterest-youtube/p12.png',
    'youtube-about': 'pinterest-youtube/p13.png',
    'pinterest-profile': 'pinterest-youtube/p07.png',
    'pinterest-created': 'pinterest-youtube/p01.png',
    'pinterest-board-a': 'pinterest-youtube/p08.png',
    'pinterest-board-b': 'pinterest-youtube/p10.png',
    'pinterest-top-pins': 'pinterest-youtube/p03.png',
    // Ssensazione case study (Work page): pages rendered from the menu and trifold brochure PDFs.
    // The menu's last page (a photo of the owners) is not used.
    'ssensazione-menu-01': 'ssensazione/menu-01.png',
    'ssensazione-menu-02': 'ssensazione/menu-02.png',
    'ssensazione-menu-04': 'ssensazione/menu-04.png',
    'ssensazione-menu-08': 'ssensazione/menu-08.png',
    'ssensazione-menu-10': 'ssensazione/menu-10.png',
    'ssensazione-menu-14': 'ssensazione/menu-14.png',
    'ssensazione-brochure-a-outside': 'ssensazione/brochure-a-outside.png',
    'ssensazione-brochure-a-inside': 'ssensazione/brochure-a-inside.png',
    'ssensazione-brochure-b-outside': 'ssensazione/brochure-b-outside.png',
    'ssensazione-brochure-b-inside': 'ssensazione/brochure-b-inside.png',
  }
  // The client's personal phone numbers and email, blurred out of the published images (boxes in
  // the original's pixels). The originals are untouched.
  const contactBoxes = [{ left: 740, top: 296, width: 228, height: 52 }, { left: 740, top: 470, width: 228, height: 46 }]
  const REDACT = {
    'ssensazione-business-card': [{ left: 1470, top: 585, width: 870, height: 120 }, { left: 1490, top: 800, width: 790, height: 115 }],
    'ssensazione-brochure-a-outside': contactBoxes,
    'ssensazione-brochure-b-outside': contactBoxes,
  }
  const load = async (input, name) => {
    const boxes = REDACT[name]
    if (!boxes) return sharp(input).rotate()
    const base = await sharp(input).rotate().toBuffer()
    const patches = await Promise.all(boxes.map(async (b) => ({ input: await sharp(base).extract(b).blur(Math.max(14, b.height / 4)).toBuffer(), left: b.left, top: b.top })))
    return sharp(await sharp(base).composite(patches).png().toBuffer())
  }
  await mkdir(SW_OUT, { recursive: true })
  const manifest = {}
  for (const [name, rel] of Object.entries(USED)) {
    const input = `${SRC}/drive/${rel}`
    const meta = await sharp(input).rotate().metadata()
    manifest[name] = { width: meta.width, height: meta.height }
    for (const width of [480, 1200]) {
      const out = `${SW_OUT}/${name}-${width}.webp`
      const info = await (await load(input, name)).resize({ width, withoutEnlargement: true }).webp({ quality: width > 600 ? 86 : 80 }).toFile(out)
      console.log(`${out}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`)
    }
  }
  await writeFile('src/content/selected-work-manifest.json', JSON.stringify(manifest, null, 2) + '\n')
  console.log(`src/content/selected-work-manifest.json  ${Object.keys(manifest).length} images`)
}

// Page 2 — Pinterest & affiliate marketing. All copy and data for the page lives here.
//
// Accuracy rules for this file:
//   - Only figures that can be read from a supplied screenshot. Never estimates, earnings or conversions.
//   - Every metric keeps the exact text the screenshot shows (`shown`) next to its readable form.
//   - Historical figures always carry their date range.
//
// Pins:
//   Images come from the styleaeraa Pinterest "Created" tab (the account's own pins). Originals are in
//   source-assets/page-2/pins/; `npm run images` builds src/assets/pins/<name>-360/-600.webp.
//   To add one: drop the image in source-assets/page-2/pins/, run `npm run images`, then add an entry
//   below with `pinImage('<name>')`, the pin's title, alt text and its Pinterest URL.
// Affiliate: `affiliate.storefrontUrl` is the Amazon link from the Pinterest profile. Add
//   `affiliate.products` (title, url, image) to feature specific products.
import type { FloatingCardData } from '../components/floating/types.ts'

const pinFiles = import.meta.glob<string>('../assets/pins/*.webp', { eager: true, import: 'default' })

/** Responsive image fields for a processed pin (see scripts/optimize-images.mjs). */
function pinImage(name: string, ratio: number) {
  const small = pinFiles[`../assets/pins/${name}-360.webp`]
  const large = pinFiles[`../assets/pins/${name}-600.webp`]
  if (!small || !large) throw new Error(`Missing processed pin image "${name}". Run npm run images.`)
  return { image: large, srcSet: `${small} 360w, ${large} 600w`, ratio }
}

const pinUrl = (id: string) => `https://www.pinterest.com/pin/${id}/`

export const pinterestProfile = {
  username: 'styleaeraa',
  url: 'https://www.pinterest.com/styleaeraa/',
  /** As displayed on the public profile, read on 23 Oct 2026. */
  capturedLabel: '23 Oct 2026',
  monthlyViews: '382.6k' as string | null,
  followers: '102' as string | null,
  monthlyViewsDefinition:
    'Pinterest’s own count of views of the pins on my profile over the past 30 days. It is measured differently from the impressions in Analytics.',
}

export const pinIntro = {
  eyebrow: 'Page 02 · Pinterest',
  title: 'Pinterest',
  heading: 'Curating & creating on Pinterest',
  body: 'On Pinterest I collect and create visual inspiration: fashion finds and outfit ideas, lifestyle and beauty, aesthetic collages, and original designs and creative pins of my own.',
  linkLabel: 'Visit @styleaeraa on Pinterest',
  themesTitle: 'On my boards',
  themes: ['Fashion finds', 'Outfit inspiration', 'Lifestyle', 'Beauty', 'Aesthetic collages', 'Original creative pins'],
}

export type Pin = FloatingCardData & {
  /** Theme shown under the pin in the gallery. */
  theme: string
}

/**
 * Pins from the Created tab. Order = order on the board (first 8) and in the gallery.
 * `aspect` is the board slot the pin is cropped to (see animation/presets/board.ts);
 * the gallery shows each image at its natural `ratio`. `caption` is the pin's own title.
 */
export const pins: Pin[] = [
  { id: 'i-love-this-one', title: 'I love this one 🤍', caption: 'I love this one 🤍', theme: 'Fashion finds', aspect: 'tall',
    alt: 'Outfit pin: a white draped mini dress with lace tights and black boots, on a black background.',
    href: pinUrl('1067423549204703480'), ...pinImage('01-i-love-this-one', 736 / 1306) },
  { id: 'brown-mini-skirt', title: 'Brown mini skirt outfit', caption: 'Brown mini skirt outfit', theme: 'Outfit inspiration', aspect: 'square',
    alt: 'Outfit pin: a brown leather mini skirt worn with fluffy fur leg warmers.',
    href: pinUrl('1067423549205623396'), ...pinImage('03-brown-mini-skirt', 736 / 1047) },
  { id: 'chic', title: 'chic 🤍', caption: 'chic 🤍', theme: 'Outfit inspiration', aspect: 'portrait',
    alt: 'Outfit collage: brown leather jacket, leopard-print cap, fur skirt and tall boots, with bag, sunglasses and earrings.',
    href: pinUrl('1067423549204744692'), ...pinImage('04-chic', 736 / 1104) },
  { id: 'blair-inspired', title: 'blair inspired 🤍', caption: 'blair inspired 🤍', theme: 'Outfit inspiration', aspect: 'portrait',
    alt: 'Outfit collage: white blouse with a black bow, black pleated skirt, headband, handbag and slingback heels.',
    href: pinUrl('1067423549205166143'), ...pinImage('09-blair-inspired', 736 / 1104) },
  { id: 'coffee-collage', title: 'Coffee collage', caption: 'Coffee collage', theme: 'Lifestyle', aspect: 'square',
    alt: 'Lifestyle collage of coffee drinks and pastries with the words “Don’t overthink it”.',
    href: pinUrl('1067423549204850456'), ...pinImage('12-coffee-collage', 736 / 1308) },
  { id: 'chocolate-trench', title: 'Chocolate brown leather trench coat outfit 🤎🖤', caption: 'Chocolate brown trench coat 🤎🖤', theme: 'Fashion finds', aspect: 'tall',
    alt: 'Outfit pin: a long chocolate-brown leather trench coat with black heels and a small black bag.',
    href: pinUrl('1067423549205623487'), ...pinImage('02-chocolate-trench', 736 / 1306) },
  { id: 'y2k-leopard', title: 'Y2K outfit inspo', caption: 'Y2K outfit inspo', theme: 'Outfit inspiration', aspect: 'card',
    alt: 'Outfit collage: leopard-print top and mini skirt with fur leg warmers and a shoulder bag, labelled “outfit inspo”.',
    href: pinUrl('1067423549204596322'), ...pinImage('07-y2k-leopard', 736 / 1308) },
  { id: 'vamp', title: 'Vamp 🕷️', caption: 'Vamp 🕷️', theme: 'Outfit inspiration', aspect: 'portrait',
    alt: 'Halloween outfit collage: deep-red corset top and ruffled skirt with knee-high boots, bag and sunglasses.',
    href: pinUrl('1067423549204639664'), ...pinImage('11-vamp', 736 / 1104) },
  { id: 'y2k-inspired', title: 'y2k inspired 💅', caption: 'y2k inspired 💅', theme: 'Outfit inspiration', aspect: 'portrait',
    alt: 'Outfit collage: cropped brown jacket, black shorts and fur boots, with a fur hat, sunglasses and belt bag.',
    href: pinUrl('1067423549204732929'), ...pinImage('05-y2k-inspired', 736 / 1104) },
  { id: 'outfit-inspo', title: 'outfit inspo 🤍', caption: 'outfit inspo 🤍', theme: 'Outfit inspiration', aspect: 'portrait',
    alt: 'Outfit collage: graphic baby tee with faded flared jeans, platform boots and sunglasses.',
    href: pinUrl('1067423549204703255'), ...pinImage('06-outfit-inspo', 736 / 1104) },
  { id: 'y2k-brown-outfit', title: 'Y2K brown outfit', caption: 'Y2K brown outfit', theme: 'Outfit inspiration', aspect: 'portrait',
    alt: 'Outfit collage: red halter top, plaid trousers, a cap and suede boots.',
    href: pinUrl('1067423549204609419'), ...pinImage('08-y2k-brown-outfit', 736 / 1307) },
  { id: 'y2k-fashion', title: 'y2k fashion', caption: 'y2k fashion', theme: 'Aesthetic collages', aspect: 'square',
    alt: 'Grid of Y2K street-style outfits with baggy jeans and cargo trousers.',
    href: pinUrl('1067423549204797299'), ...pinImage('13-y2k-fashion', 736 / 785) },
]

export const gallery = {
  eyebrow: 'Selected pins',
  heading: 'The board, up close',
  note: 'From my Pinterest “Created” tab. Each pin links to the original.',
}

/** Pins titled “Aeraa’s Amazon Page”: outfit pins that lead to the storefront. They link to the pins themselves. */
export const storefrontPins: Pin[] = [
  { id: 'amazon-page-a', title: 'Aeraa’s Amazon Page', caption: 'Brown blazer dress & burgundy boots', theme: 'Fashion finds', aspect: 'tall',
    alt: 'Outfit pin: a double-breasted brown blazer dress with burgundy thigh-high boots.',
    href: pinUrl('1067423549205462162'), ...pinImage('15-amazon-page-a', 735 / 1306) },
  { id: 'amazon-page-b', title: 'Aeraa’s Amazon Page', caption: 'Red leather jacket & knee boots', theme: 'Fashion finds', aspect: 'tall',
    alt: 'Outfit pin: dark-red leather jacket, black mini skirt and red knee boots, with accessories.',
    href: pinUrl('1067423549205185732'), ...pinImage('16-amazon-page-b', 736 / 1104) },
  { id: 'amazon-page-c', title: 'Aeraa’s Amazon Page', caption: 'Striped top & denim maxi skirt', theme: 'Fashion finds', aspect: 'tall',
    alt: 'Outfit pin: striped bandeau top with a faded denim maxi skirt and boots.',
    href: pinUrl('1067423549205170219'), ...pinImage('17-amazon-page-c', 736 / 1307) },
]

// ---------------------------------------------------------------------------
// Analytics — read from the Pinterest Analytics screenshot
// (source-assets/page-2/pinterest-analytics-2026-09-20_2026-10-20.jpeg).
// The app shows Indian-English abbreviations: "l" = lakh (100,000), "t" = thousand.
// ---------------------------------------------------------------------------
export type Metric = {
  id: string
  label: string
  /** Exactly as the screenshot shows it. */
  shown: string
  /** Readable form of `shown` (Pinterest already rounds these). */
  display: string
  /** Change vs the previous 30 days, as shown. */
  change: string
  definition: string
}

export const analytics = {
  eyebrow: 'Reach',
  heading: 'Thirty days on Pinterest',
  rangeLabel: '20 Sep – 20 Oct 2026',
  source: 'Pinterest Analytics · organic · historical figures, captured at the time',
  comparisonNote: 'Percentage changes are compared with the 30 days before this range.',
  abbreviationNote: 'Pinterest showed these as 3.7l, 17t, 3.2t, 3l and 14t (l = lakh, t = thousand).',
  lead: {
    id: 'impressions',
    label: 'Impressions',
    shown: '3.7l',
    display: '≈370K',
    change: '+86%',
    definition: 'How many times my pins were shown on screen. Not unique people, and not website visits.',
  } satisfies Metric,
  metrics: [
    { id: 'audience', label: 'Total audience', shown: '3l', display: '≈300K', change: '+97%', definition: 'People who saw my pins.' },
    { id: 'engagements', label: 'Engagements', shown: '17t', display: '≈17K', change: '+120%', definition: 'Saves, clicks and other interactions with my pins.' },
    { id: 'engaged', label: 'Engaged audience', shown: '14t', display: '≈14K', change: '+137%', definition: 'People who interacted with my pins.' },
    { id: 'saves', label: 'Saves', shown: '3.2t', display: '≈3.2K', change: '+129%', definition: 'Times my pins were saved to someone’s board.' },
    { id: 'outbound', label: 'Outbound clicks', shown: '33', display: '33', change: '+17%', definition: 'Clicks from a pin to a website off Pinterest. A click is not a purchase.' },
  ] satisfies Metric[],
  topPin: { label: 'Top pin by impressions', title: 'I love this one 🤍', shown: '49t', display: '≈49K impressions', pinId: 'i-love-this-one' },
}

// ---------------------------------------------------------------------------
// Affiliate marketing
// ---------------------------------------------------------------------------
export type AffiliateProduct = {
  id: string
  title: string
  /** Amazon affiliate URL for this product. */
  url: string
  image?: string
  alt?: string
}

export const affiliate = {
  eyebrow: 'Affiliate',
  heading: 'From pin to product',
  intro: 'Visual content is often where product discovery starts. This is one way a pin can lead to a product. It is an illustration, not every visitor’s path.',
  steps: [
    { id: 'discover', title: 'A pin is discovered', body: 'Someone comes across a pin while browsing or searching.' },
    { id: 'idea', title: 'It introduces an idea or a product', body: 'The image shows an outfit, a look or an object worth a closer look.' },
    { id: 'link', title: 'The visitor follows the link', body: 'If they want to know more, they can follow the pin’s link.' },
    { id: 'product', title: 'A product page', body: 'The link can lead to the product on Amazon through my affiliate link.' },
  ],
  storefrontHeading: 'Shop my finds',
  /** Amazon storefront link from the Pinterest profile ("Aeraa's Amazon Page", amazon.in, tag styleaeraa-21). */
  storefrontUrl: 'https://link.amazon/B00kUtftW' as string | null,
  storefrontLabel: 'Visit my Amazon storefront',
  /** Shown instead of the button if storefrontUrl is ever cleared. */
  storefrontPending: 'My Amazon storefront link will be added here.',
  /** Selected products with affiliate links. While empty, the storefront pins are shown instead. */
  products: [] as AffiliateProduct[],
  storefrontPinsNote: 'Outfit pins from my “Aeraa’s Amazon Page” series. Each opens the pin on Pinterest.',
  disclosure:
    'Affiliate disclosure: as an Amazon Associate I earn from qualifying purchases. Some links on this page are affiliate links, and I may earn a commission if you buy through them.',
}

// ---------------------------------------------------------------------------
// Outro — hand-off to Page 3 (YouTube & dance)
// ---------------------------------------------------------------------------
export const outro = {
  eyebrow: 'Next · Page 03',
  heading: 'art in motion.',
  body: 'From still images to movement. My YouTube channel is where I dance.',
  channelName: 'Aeraa',
  channelHandle: '@Aeraaa-m7u',
  channelUrl: 'https://www.youtube.com/@Aeraaa-m7u',
  linkLabel: 'Watch on YouTube',
}

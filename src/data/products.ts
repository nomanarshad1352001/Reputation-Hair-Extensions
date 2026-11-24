// Sample catalog. On Shopify this is real product data (variants = Length × Texture × Color).
// Prices, stock, ratings and review counts here are demo values for the prototype.
import type { ImgKey } from "@/data/images";

export type Texture = "Straight" | "Body Wave" | "Deep Wave";
export type ColorKey = "natural-black" | "dark-brown" | "chestnut" | "honey-blonde" | "platinum";
export type TypeHandle = "weft-extensions" | "wigs" | "closures" | "frontals";

export const TEXTURES: Texture[] = ["Straight", "Body Wave", "Deep Wave"];

export const COLORS: Record<ColorKey, { name: string; code: string; hex: string }> = {
  "natural-black": { name: "Natural Black", code: "1B", hex: "#1c1614" },
  "dark-brown": { name: "Dark Brown", code: "2", hex: "#3d2a21" },
  chestnut: { name: "Chestnut Brown", code: "4", hex: "#6f472f" },
  "honey-blonde": { name: "Honey Blonde", code: "27", hex: "#c79d5e" },
  platinum: { name: "Platinum Blonde", code: "613", hex: "#eadbb2" },
};

export const TYPE_LABEL: Record<TypeHandle, string> = {
  "weft-extensions": "Weft Extensions",
  wigs: "Human Hair Wigs",
  closures: "Closures",
  frontals: "Frontals",
};

export interface Selection {
  length: number;
  texture: Texture;
  color: ColorKey;
}

export interface Product {
  id: number;
  handle: string;
  title: string;
  subtitle: string;
  type: TypeHandle;
  basePrice: number;
  step: number;
  discount: number;
  textures: Texture[];
  lengths: number[];
  colors: ColorKey[];
  images: ImgKey[];
  optionImages?: Partial<Record<Texture | ColorKey, ImgKey>>;
  rating: number;
  reviewCount: number;
  bestSeller?: boolean;
  isNew?: boolean;
  soldOut?: boolean;
  salesRank: number;
  createdAt: string;
  description: string;
}

const LENGTHS: Record<TypeHandle, number[]> = {
  "weft-extensions": [12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
  wigs: [14, 16, 18, 20, 22, 24, 26, 28],
  closures: [10, 12, 14, 16, 18, 20],
  frontals: [10, 12, 14, 16, 18, 20],
};

type Seed = Omit<Product, "lengths" | "discount"> & { discount?: number };
const make = (s: Seed): Product => ({ discount: 0, lengths: LENGTHS[s.type], ...s });

export const products: Product[] = [
  make({
    id: 1,
    handle: "signature-sew-in-weft",
    title: "Signature Sew-In Weft",
    subtitle: "Double-drawn machine weft",
    type: "weft-extensions",
    basePrice: 89,
    step: 12,
    discount: 20,
    textures: ["Straight", "Body Wave", "Deep Wave"],
    colors: ["natural-black", "dark-brown", "chestnut"],
    images: ["catWeft", "pStraightBlack", "pWaveBrown", "pCurlyBlack", "edSalon"],
    optionImages: { Straight: "pStraightBlack", "Body Wave": "pWaveBrown", "Deep Wave": "pCurlyBlack" },
    rating: 4.9,
    reviewCount: 412,
    bestSeller: true,
    salesRank: 1,
    createdAt: "2025-06-02",
    description:
      "The weft our stylists reach for first. Full from root to tip, with a flat, reinforced track that sits close to the head and stays comfortable through every wash and wear.",
  }),
  make({
    id: 2,
    handle: "full-install-bundle",
    title: "The Full Install Bundle",
    subtitle: "Three wefts · one price",
    type: "weft-extensions",
    basePrice: 249,
    step: 32,
    discount: 25,
    textures: ["Straight", "Body Wave", "Deep Wave"],
    colors: ["natural-black", "dark-brown"],
    images: ["edBox", "heroMobile", "pWaveBrown", "pStraightBlack", "pCurlyBlack"],
    optionImages: { Straight: "pStraightBlack", "Body Wave": "pWaveBrown", "Deep Wave": "pCurlyBlack" },
    rating: 4.9,
    reviewCount: 327,
    bestSeller: true,
    salesRank: 2,
    createdAt: "2025-07-14",
    description:
      "Everything you need for a complete sew-in: three matched wefts cut from the same lot, so tone, texture and density blend perfectly from nape to crown.",
  }),
  make({
    id: 3,
    handle: "hd-lace-front-body-wave-wig",
    title: "HD Lace Front Body Wave Wig",
    subtitle: "13×4 HD lace · pre-plucked",
    type: "wigs",
    basePrice: 289,
    step: 30,
    discount: 20,
    textures: ["Body Wave"],
    colors: ["chestnut", "dark-brown", "natural-black"],
    images: ["catWigs", "pWig", "heroMobile"],
    optionImages: { "dark-brown": "pWig" },
    rating: 4.9,
    reviewCount: 268,
    bestSeller: true,
    salesRank: 3,
    createdAt: "2025-08-01",
    description:
      "Soft, swinging waves on whisper-thin HD lace. The hairline is pre-plucked and the knots are lightly bleached, so it melts with minimal customizing.",
  }),
  make({
    id: 4,
    handle: "honey-blonde-luxe-weft",
    title: "Honey Blonde Luxe Weft",
    subtitle: "Hand-toned warm blonde",
    type: "weft-extensions",
    basePrice: 119,
    step: 15,
    discount: 30,
    textures: ["Straight", "Body Wave"],
    colors: ["honey-blonde"],
    images: ["ugc1", "pStraightBlonde", "edBox"],
    optionImages: { Straight: "pStraightBlonde" },
    rating: 4.8,
    reviewCount: 188,
    bestSeller: true,
    salesRank: 4,
    createdAt: "2025-09-10",
    description:
      "A warm, dimensional honey that looks lived-in rather than lifted. Toned by hand in small batches to keep the cuticle smooth and the shine intact.",
  }),
  make({
    id: 5,
    handle: "4x4-hd-lace-closure",
    title: "4×4 HD Lace Closure",
    subtitle: "Free part · pre-plucked",
    type: "closures",
    basePrice: 79,
    step: 10,
    discount: 20,
    textures: ["Straight", "Body Wave", "Deep Wave"],
    colors: ["natural-black", "dark-brown"],
    images: ["pClosure", "catClosures"],
    rating: 4.8,
    reviewCount: 176,
    bestSeller: true,
    salesRank: 5,
    createdAt: "2025-06-20",
    description:
      "The everyday closure. A 4×4 HD lace base with a soft, natural density at the part — designed to sit flat and disappear into the skin.",
  }),
  make({
    id: 6,
    handle: "13x4-hd-lace-frontal",
    title: "13×4 HD Lace Frontal",
    subtitle: "Ear-to-ear · pre-plucked",
    type: "frontals",
    basePrice: 119,
    step: 14,
    discount: 20,
    textures: ["Straight", "Body Wave", "Deep Wave"],
    colors: ["natural-black", "dark-brown"],
    images: ["pFrontal", "catFrontals"],
    rating: 4.8,
    reviewCount: 139,
    bestSeller: true,
    salesRank: 6,
    createdAt: "2025-06-20",
    description:
      "Full ear-to-ear coverage with a hairline that lets you part anywhere and pull everything back. Sheer HD lace, pre-plucked with baby hairs.",
  }),
  make({
    id: 7,
    handle: "bone-straight-weft",
    title: "Bone Straight Weft",
    subtitle: "Glass-finish straight",
    type: "weft-extensions",
    basePrice: 99,
    step: 13,
    textures: ["Straight"],
    colors: ["natural-black"],
    images: ["pStraightBlack", "ugc2", "catWeft"],
    rating: 4.9,
    reviewCount: 205,
    salesRank: 7,
    createdAt: "2025-09-28",
    description:
      "Poker-straight with a mirror finish. Steam-processed to stay sleek between washes without constant heat.",
  }),
  make({
    id: 8,
    handle: "hand-tied-volume-weft",
    title: "Hand-Tied Volume Weft",
    subtitle: "Ultra-thin hand-tied track",
    type: "weft-extensions",
    basePrice: 129,
    step: 16,
    textures: ["Straight", "Body Wave"],
    colors: ["dark-brown", "chestnut", "natural-black"],
    images: ["edStreet", "pWaveBrown", "edSalon"],
    rating: 4.8,
    reviewCount: 96,
    isNew: true,
    salesRank: 8,
    createdAt: "2026-01-05",
    description:
      "Tied by hand for the thinnest, most flexible track we make. It stacks without bulk, so you get more hair and less weight on fine or thinning areas.",
  }),
  make({
    id: 9,
    handle: "deep-wave-weft",
    title: "Deep Wave Weft",
    subtitle: "Defined, springy curl",
    type: "weft-extensions",
    basePrice: 95,
    step: 12,
    discount: 15,
    textures: ["Deep Wave"],
    colors: ["natural-black", "dark-brown"],
    images: ["pCurlyBlack", "ugc3"],
    rating: 4.7,
    reviewCount: 143,
    salesRank: 9,
    createdAt: "2025-08-22",
    description:
      "A tight, defined wave pattern that springs back after washing. Wear it wet-look, brushed out, or diffused for maximum volume.",
  }),
  make({
    id: 10,
    handle: "deep-curly-lace-wig",
    title: "Deep Curly Lace Wig",
    subtitle: "13×4 HD lace · 180% density",
    type: "wigs",
    basePrice: 279,
    step: 30,
    discount: 15,
    textures: ["Deep Wave"],
    colors: ["natural-black", "dark-brown"],
    images: ["ugc3", "pCurlyBlack"],
    rating: 4.8,
    reviewCount: 121,
    salesRank: 10,
    createdAt: "2025-10-06",
    description:
      "Big, defined curls with real movement. Just add water and leave-in — the pattern does the rest.",
  }),
  make({
    id: 11,
    handle: "wear-and-go-straight-wig",
    title: "Wear-&-Go Glueless Straight Wig",
    subtitle: "Pre-cut lace · no glue needed",
    type: "wigs",
    basePrice: 259,
    step: 28,
    textures: ["Straight"],
    colors: ["natural-black"],
    images: ["ugc2", "pStraightBlack"],
    rating: 4.7,
    reviewCount: 58,
    isNew: true,
    salesRank: 11,
    createdAt: "2026-01-12",
    description:
      "Out of the box and out the door. Pre-cut lace, an adjustable band and a secure fit mean no glue, no tools and no appointment.",
  }),
  make({
    id: 12,
    handle: "layered-blowout-wig",
    title: "Layered Blowout Wig",
    subtitle: "Face-framing layers · 5×5 lace",
    type: "wigs",
    basePrice: 309,
    step: 30,
    textures: ["Body Wave", "Straight"],
    colors: ["chestnut", "dark-brown"],
    images: ["ugc4", "pWig"],
    rating: 4.8,
    reviewCount: 87,
    salesRank: 12,
    createdAt: "2025-11-11",
    description:
      "A fresh-from-the-salon blowout that holds. Pre-cut face-framing layers give instant bounce and shape without a round brush.",
  }),
  make({
    id: 13,
    handle: "5x5-hd-lace-closure",
    title: "5×5 HD Lace Closure",
    subtitle: "Deeper part · more versatility",
    type: "closures",
    basePrice: 99,
    step: 12,
    textures: ["Straight", "Body Wave"],
    colors: ["natural-black"],
    images: ["catClosures", "pClosure"],
    rating: 4.7,
    reviewCount: 64,
    salesRank: 13,
    createdAt: "2025-10-20",
    description:
      "An extra inch in every direction for a deeper part and more room to style. The cleanest middle part we make.",
  }),
  make({
    id: 14,
    handle: "13x6-body-wave-frontal",
    title: "13×6 Body Wave Frontal",
    subtitle: "Extra-deep parting space",
    type: "frontals",
    basePrice: 149,
    step: 15,
    textures: ["Body Wave"],
    colors: ["dark-brown", "natural-black"],
    images: ["heroMobile", "pFrontal"],
    rating: 4.9,
    reviewCount: 41,
    isNew: true,
    salesRank: 14,
    createdAt: "2026-01-18",
    description:
      "Six inches of parting depth for dramatic side parts and half-up styles, with soft body waves that fall effortlessly.",
  }),
  make({
    id: 15,
    handle: "deep-wave-frontal",
    title: "Deep Wave Frontal",
    subtitle: "13×4 HD lace · baby hairs",
    type: "frontals",
    basePrice: 129,
    step: 14,
    discount: 15,
    textures: ["Deep Wave"],
    colors: ["natural-black"],
    images: ["catFrontals", "pFrontal"],
    rating: 4.7,
    reviewCount: 52,
    salesRank: 15,
    createdAt: "2025-09-03",
    description:
      "A defined deep-wave pattern on sheer lace, with pre-plucked baby hairs for a swept-back hairline that looks grown, not installed.",
  }),
  make({
    id: 16,
    handle: "platinum-613-weft",
    title: "Platinum 613 Weft",
    subtitle: "Pre-lightened · ready to tone",
    type: "weft-extensions",
    basePrice: 139,
    step: 16,
    textures: ["Straight", "Body Wave"],
    colors: ["platinum"],
    images: ["pPlatinum", "pStraightBlonde"],
    rating: 4.8,
    reviewCount: 74,
    soldOut: true,
    salesRank: 16,
    createdAt: "2025-12-01",
    description:
      "An even, bright 613 blonde that takes toner and color beautifully. Lifted slowly to protect the cuticle.",
  }),
];

/* ── Collections ─────────────────────────────────────────────────────────── */
export interface Collection {
  handle: string;
  title: string;
  intro: string;
  image: ImgKey;
  seoDescription: string;
}

export const collections: Record<string, Collection> = {
  "weft-extensions": {
    handle: "weft-extensions",
    title: "Weft Extensions",
    intro: "Sew-in and hand-tied wefts with flat, comfortable tracks and fullness from root to tip.",
    image: "catWeft",
    seoDescription: "Shop premium human hair weft extensions in straight, body wave and deep wave, 12–30 inches.",
  },
  wigs: {
    handle: "wigs",
    title: "Human Hair Wigs",
    intro: "HD lace fronts and glueless wear-and-go units, pre-plucked for a hairline that melts.",
    image: "catWigs",
    seoDescription: "Shop HD lace front and glueless human hair wigs in straight, body wave and deep wave.",
  },
  closures: {
    handle: "closures",
    title: "Closures",
    intro: "4×4 and 5×5 HD lace closures for a clean, natural part that protects your leave-out.",
    image: "catClosures",
    seoDescription: "Shop 4x4 and 5x5 HD lace closures with pre-plucked parts and natural density.",
  },
  frontals: {
    handle: "frontals",
    title: "Frontals",
    intro: "Ear-to-ear lace frontals with pre-plucked hairlines — part anywhere, pull it all back.",
    image: "catFrontals",
    seoDescription: "Shop 13x4 and 13x6 HD lace frontals with pre-plucked hairlines and baby hairs.",
  },
  "best-sellers": {
    handle: "best-sellers",
    title: "Best Sellers",
    intro: "The pieces our stylists and customers reorder most.",
    image: "heroMobile",
    seoDescription: "Shop Reputation's best-selling wefts, wigs, closures and frontals.",
  },
  all: {
    handle: "all",
    title: "Shop All",
    intro: "Every weft, wig, closure and frontal in the Reputation collection.",
    image: "edStreet",
    seoDescription: "Shop the full Reputation Hair Extensions collection.",
  },
};

export function productsIn(handle: string): Product[] {
  if (handle === "all") return products;
  if (handle === "best-sellers") return products.filter((p) => p.bestSeller);
  return products.filter((p) => p.type === handle);
}

export const getProduct = (handle?: string) => products.find((p) => p.handle === handle);

/* ── Variant logic ───────────────────────────────────────────────────────── */
export function priceFor(p: Product, sel: Selection) {
  const i = Math.max(0, p.lengths.indexOf(sel.length));
  const compareAt = p.basePrice + p.step * i;
  const price = p.discount ? Math.round(compareAt * (1 - p.discount / 100)) : compareAt;
  return { price, compareAt, saving: compareAt - price };
}

export const fromPrice = (p: Product) =>
  priceFor(p, { length: p.lengths[0], texture: p.textures[0], color: p.colors[0] });

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export const variantKey = (p: Product, s: Selection) => `${p.handle}|${s.length}|${s.texture}|${s.color}`;

/** Deterministic demo inventory per variant. On Shopify this is `variant.inventory_quantity`. */
export function stockFor(p: Product, sel: Selection): number {
  if (p.soldOut) return 0;
  const r = hash(variantKey(p, sel)) % 17;
  if (r === 0) return 0;
  if (r <= 2) return r + 1;
  return 10 + r;
}

export function defaultSel(p: Product): Selection {
  const order = [...p.lengths.slice(3), ...p.lengths.slice(0, 3)];
  for (const length of order) {
    const s = { length, texture: p.textures[0], color: p.colors[0] };
    if (stockFor(p, s) > 0) return s;
  }
  return { length: p.lengths[Math.min(3, p.lengths.length - 1)], texture: p.textures[0], color: p.colors[0] };
}

export const imageFor = (p: Product, sel: Selection): ImgKey =>
  p.optionImages?.[sel.color] ?? p.optionImages?.[sel.texture] ?? p.images[0];

export const describeSel = (s: Selection) => `${s.length}″ · ${s.texture} · ${COLORS[s.color].name}`;

export function searchProducts(query: string): Product[] {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => (t.length > 3 && t.endsWith("s") ? t.slice(0, -1) : t));
  if (!terms.length) return [];
  return products.filter((p) => {
    const hay = [p.title, p.subtitle, TYPE_LABEL[p.type], ...p.textures, ...p.colors.map((c) => COLORS[c].name)]
      .join(" ")
      .toLowerCase();
    return terms.every((t) => hay.includes(t));
  });
}

export const SPECS: Record<TypeHandle, [string, string][]> = {
  "weft-extensions": [
    ["Hair", "100% Remy human hair, cuticle aligned"],
    ["Weight", "100 g (3.5 oz) per weft"],
    ["Track", "Reinforced double-stitched weft"],
    ["Colour & heat", "Can be coloured, toned and heat-styled up to 400°F"],
    ["Lifespan", "12+ months with proper care"],
  ],
  wigs: [
    ["Hair", "100% Remy human hair, cuticle aligned"],
    ["Lace", "HD Swiss lace, pre-plucked hairline"],
    ["Density", "180%"],
    ["Cap", "Medium (22.5″) with adjustable band and combs"],
    ["Lifespan", "12+ months with proper care"],
  ],
  closures: [
    ["Hair", "100% Remy human hair, cuticle aligned"],
    ["Lace", "HD Swiss lace, lightly bleached knots"],
    ["Parting", "Free part"],
    ["Density", "150%"],
    ["Colour & heat", "Can be coloured and heat-styled up to 400°F"],
  ],
  frontals: [
    ["Hair", "100% Remy human hair, cuticle aligned"],
    ["Lace", "HD Swiss lace, ear to ear, pre-plucked with baby hairs"],
    ["Parting", "Free part"],
    ["Density", "150%"],
    ["Colour & heat", "Can be coloured and heat-styled up to 400°F"],
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// THEME SETTINGS — the single source of truth for merchandisable content.
// This file mirrors what the client edits in the Shopify theme editor (Symmetry
// section + block settings): every section exposes image, heading, body,
// CTA label/link and a `visible` toggle. Change a value here → the storefront updates.
// ─────────────────────────────────────────────────────────────────────────────
import type { ImgKey } from "@/data/images";

export interface NavLink {
  label: string;
  to: string;
}
export interface NavItem extends NavLink {
  columns?: { title: string; links: NavLink[] }[];
  promos?: { image: ImgKey; title: string; caption: string; to: string }[];
}

const q = (s: string) => encodeURIComponent(s);

const shopMega = (handle: string, label: string, lengths: [string, string][], promos: NavItem["promos"]): NavItem => ({
  label,
  to: `/collections/${handle}`,
  columns: [
    {
      title: "Shop by texture",
      links: ["Straight", "Body Wave", "Deep Wave"].map((t) => ({
        label: t,
        to: `/collections/${handle}?texture=${q(t)}`,
      })),
    },
    {
      title: "Shop by length",
      links: lengths.map(([l, v]) => ({ label: l, to: `/collections/${handle}?length=${v}` })),
    },
    {
      title: "Featured",
      links: [
        { label: `All ${label.toLowerCase()}`, to: `/collections/${handle}` },
        { label: "On sale", to: `/collections/${handle}?sale=1` },
        { label: "Best sellers", to: "/collections/best-sellers" },
        { label: "Hair care guide", to: "/pages/hair-care-guide" },
      ],
    },
  ],
  promos,
});

const LONG: [string, string][] = [
  ["Short · 12–16″", "12,14,16"],
  ["Mid · 18–22″", "18,20,22"],
  ["Long · 24–30″", "24,26,28,30"],
];
const SHORT: [string, string][] = [
  ["10–12″", "10,12"],
  ["14–16″", "14,16"],
  ["18–20″", "18,20"],
];

export const settings = {
  brand: {
    name: "Reputation",
    descriptor: "Hair Extensions",
    legalName: "Reputation Hair Extensions Company",
    instagramHandle: "@reputationextensions",
    email: "hello@reputationextensions.com",
    freeShippingThreshold: 150,
    social: [
      { name: "Instagram", url: "https://www.instagram.com/" },
      { name: "TikTok", url: "https://www.tiktok.com/" },
      { name: "Facebook", url: "https://www.facebook.com/" },
      { name: "Pinterest", url: "https://www.pinterest.com/" },
    ],
  },

  announcement: {
    visible: true,
    rotateMs: 5000,
    messages: [
      { text: "New Year. New Hair. New Energy — Up to 30% off.", link: "/collections/all?sale=1" },
      { text: "Free U.S. shipping on orders over $150", link: "/policies/shipping" },
      { text: "30-day exchanges & returns on unopened hair", link: "/policies/returns" },
    ],
  },

  // Sale timer — set endsAt to the real sale end. The countdown hides itself once it has passed.
  // Urgency copy is only shown when this date is real (brief: no fabricated scarcity).
  sale: {
    visible: true,
    endsAt: "2026-03-01T00:00:00-05:00",
    headline: "Sale ends in",
    offer: "Up to 30% off sitewide",
    code: "SAVE5",
    codeNote: "Add code SAVE5 at checkout for an extra 5% off sale items.",
  },

  // Brief decision point: the mockup's "Hair Quiz" slot is replaced with "Best Sellers"
  // (quizzes / shade matching are out of scope). "Hair Care Guide" lives under About Us + footer.
  nav: [
    shopMega("weft-extensions", "Weft Extensions", LONG, [
      { image: "catWeft", title: "Signature Sew-In Weft", caption: "The one stylists reorder", to: "/products/signature-sew-in-weft" },
      { image: "edBox", title: "The Full Install Bundle", caption: "Three wefts, one price", to: "/products/full-install-bundle" },
    ]),
    shopMega("wigs", "Wigs", [["Shoulder · 14–16″", "14,16"], ["Mid · 18–22″", "18,20,22"], ["Long · 24–28″", "24,26,28"]], [
      { image: "catWigs", title: "HD Lace Front Wig", caption: "Melted, undetectable lace", to: "/products/hd-lace-front-body-wave-wig" },
      { image: "ugc4", title: "Layered Blowout Wig", caption: "Salon bounce, zero effort", to: "/products/layered-blowout-wig" },
    ]),
    shopMega("closures", "Closures", SHORT, [
      { image: "catClosures", title: "5×5 HD Lace Closure", caption: "A deeper, cleaner part", to: "/products/5x5-hd-lace-closure" },
      { image: "pClosure", title: "4×4 HD Lace Closure", caption: "The everyday essential", to: "/products/4x4-hd-lace-closure" },
    ]),
    shopMega("frontals", "Frontals", SHORT, [
      { image: "catFrontals", title: "Deep Wave Frontal", caption: "Ear-to-ear definition", to: "/products/deep-wave-frontal" },
      { image: "pFrontal", title: "13×4 HD Lace Frontal", caption: "A hairline that disappears", to: "/products/13x4-hd-lace-frontal" },
    ]),
    { label: "Best Sellers", to: "/collections/best-sellers" },
    {
      label: "About Us",
      to: "/pages/about",
      columns: [
        {
          title: "Our world",
          links: [
            { label: "Our story", to: "/pages/about" },
            { label: "The Journal", to: "/blogs/journal" },
            { label: "Hair care guide", to: "/pages/hair-care-guide" },
          ],
        },
        {
          title: "Here to help",
          links: [
            { label: "FAQ", to: "/pages/faq" },
            { label: "Contact us", to: "/pages/contact" },
            { label: "Track your order", to: "/pages/track-order" },
          ],
        },
      ],
      promos: [
        { image: "mission", title: "Making a difference", caption: "How every order gives back", to: "/blogs/journal/making-a-difference" },
        { image: "edSalon", title: "Created behind the chair", caption: "Meet Liv & Kathy", to: "/pages/about" },
      ],
    },
  ] as NavItem[],

  search: {
    popular: ["Body wave", "Lace front wig", "Closure", "Honey blonde", "Straight weft"],
  },

  home: {
    hero: {
      visible: true,
      image: "hero" as ImgKey,
      mobileImage: "heroMobile" as ImgKey,
      eyebrow: "New Year · New Hair · New Energy",
      headingTop: "Hair that earns",
      headingAccent: "its reputation.",
      body: "Premium wefts, wigs, closures and frontals — selected for softness, shine and a naturally seamless blend. Up to 30% off for a limited time.",
      cta: { label: "Shop the sale", to: "/collections/all?sale=1" },
      secondaryCta: { label: "Best sellers", to: "/collections/best-sellers" },
    },
    press: {
      visible: true,
      heading: "As seen in",
      // Placeholder wordmarks — swap for licensed, client-supplied logo files before launch.
      logos: ["BET", "Cosmopolitan", "CNN", "Seventeen", "Allure"],
    },
    categories: {
      visible: true,
      eyebrow: "The collection",
      heading: "Shop by category",
      body: "Four ways to wear it. One standard of hair.",
      cta: "Shop now",
      // Extend this list as the catalog grows (tape-ins, toppers, ponytails, halo…).
      tiles: [
        { title: "Weft Extensions", to: "/collections/weft-extensions", image: "catWeft" as ImgKey, inset: "pStraightBlack" as ImgKey },
        { title: "Human Hair Wigs", to: "/collections/wigs", image: "catWigs" as ImgKey, inset: "pWig" as ImgKey },
        { title: "Closures", to: "/collections/closures", image: "catClosures" as ImgKey, inset: "pClosure" as ImgKey },
        { title: "Frontals", to: "/collections/frontals", image: "catFrontals" as ImgKey, inset: "pFrontal" as ImgKey },
      ],
    },
    vip: {
      visible: true,
      image: "edBox" as ImgKey,
      eyebrow: "Exclusive VIP welcome offer",
      heading: "50% off",
      subheading: "your first look, when you join the list.",
      body: "Be first to shop new drops, restocks and private sales. Add your number for text-only early access.",
      cta: { label: "Unlock my offer" },
      shopCta: { label: "Shop now", to: "/collections/all" },
      privacy: "By signing up you agree to receive marketing emails and texts from Reputation. Unsubscribe anytime.",
    },
    bestSellers: {
      visible: true,
      eyebrow: "Most loved",
      heading: "Best sellers",
      cta: { label: "View all", to: "/collections/best-sellers" },
      limit: 8,
    },
    reviews: {
      visible: true,
      eyebrow: "Real hair. Real reviews.",
      heading: "300,000+ happy customers",
      rating: 4.8, // review count is pulled live from the reviews app
    },
    mission: {
      visible: true,
      image: "mission" as ImgKey,
      eyebrow: "Our mission",
      heading: "Together, we’re making a difference.",
      body: "Hair is confidence — and confidence should be shared. A portion of every Reputation order goes toward organizations supporting women through hair loss, recovery and new beginnings.",
      cta: { label: "See our impact", to: "/blogs/journal/making-a-difference" },
    },
    blog: {
      visible: true,
      eyebrow: "The Journal",
      heading: "Notes from behind the chair",
      cta: { label: "Read the journal", to: "/blogs/journal" },
    },
    instagram: {
      visible: true,
      heading: "Seen on you",
      body: "Tag us to be featured.",
      tiles: ["ugc1", "edStreet", "ugc2", "catWigs", "ugc3", "edBox", "ugc4", "catFrontals"] as ImgKey[],
    },
    newsletter: {
      visible: true,
      eyebrow: "The list",
      heading: "Get up to 55% off",
      body: "Sign up for early access to sales, new arrivals and stylist-only tips. No spam — just good hair.",
      cta: "Sign me up",
    },
  },

  popup: {
    visible: true,
    delayMs: 15000,
    heading: "Your first order, sweeter.",
    body: "Join the list for an exclusive welcome offer and early access to every drop.",
    cta: "Get my offer",
  },

  footer: {
    newsletterHeading: "Sign up and add 5% off our up-to-50% off sale",
    columns: [
      {
        title: "Shop",
        links: [
          { label: "Weft Extensions", to: "/collections/weft-extensions" },
          { label: "Wigs", to: "/collections/wigs" },
          { label: "Closures", to: "/collections/closures" },
          { label: "Frontals", to: "/collections/frontals" },
          { label: "Best Sellers", to: "/collections/best-sellers" },
          { label: "Shop All", to: "/collections/all" },
        ],
      },
      {
        title: "About",
        links: [
          { label: "About Us", to: "/pages/about" },
          { label: "Our Story", to: "/pages/about" },
          { label: "Blog", to: "/blogs/journal" },
          { label: "Hair Care Guide", to: "/pages/hair-care-guide" },
        ],
      },
      {
        title: "Help",
        links: [
          { label: "Track Order", to: "/pages/track-order" },
          { label: "FAQ", to: "/pages/faq" },
          { label: "Contact", to: "/pages/contact" },
          { label: "Accessibility", to: "/policies/accessibility" },
          { label: "Shipping & Delivery", to: "/policies/shipping" },
          { label: "Exchanges & Returns", to: "/policies/returns" },
          { label: "Payments & Tax", to: "/policies/payments-tax" },
        ],
      },
    ],
    payments: ["Visa", "Mastercard", "Amex", "PayPal", "Apple Pay", "Shop Pay"],
    legal: [
      { label: "Privacy", to: "/policies/privacy" },
      { label: "Terms", to: "/policies/terms" },
      { label: "Accessibility", to: "/policies/accessibility" },
    ],
  },
};

export type Settings = typeof settings;

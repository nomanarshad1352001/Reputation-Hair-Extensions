// Editorial + CMS-style content. On Shopify: blog posts, pages, policies and the reviews app.
// Reviews are SAMPLE content for layout only — replace with real, collected reviews before launch.
import type { ImgKey } from "@/data/images";

export interface Review {
  name: string;
  rating: number;
  title: string;
  text: string;
  photo: ImgKey;
  product: string; // product handle
  date: string;
}

export const reviews: Review[] = [
  {
    name: "Danielle R.",
    rating: 5,
    title: "The blend is unreal",
    text: "I wore the honey blonde wefts for a full week of events and nobody could tell where my hair ended. Soft, no shedding, and they curled in one pass.",
    photo: "ugc1",
    product: "honey-blonde-luxe-weft",
    date: "2026-01-14",
  },
  {
    name: "Marisol V.",
    rating: 5,
    title: "Straight, sleek, stays that way",
    text: "This is the first straight hair I’ve had that still looks glassy after washing. The track lies completely flat — my stylist asked where I got it.",
    photo: "ugc2",
    product: "bone-straight-weft",
    date: "2026-01-09",
  },
  {
    name: "Amara O.",
    rating: 5,
    title: "Curls that bounce back",
    text: "Co-wash, leave-in, done. The curl pattern springs right back every time and the lace melted with barely any work. Worth every dollar.",
    photo: "ugc3",
    product: "deep-curly-lace-wig",
    date: "2025-12-28",
  },
  {
    name: "Jasmine T.",
    rating: 4,
    title: "My everyday blowout",
    text: "The layers are cut so well. I put it on in five minutes before work and it looks like I spent an hour with a round brush. Runs slightly long — size down.",
    photo: "ugc4",
    product: "layered-blowout-wig",
    date: "2025-12-19",
  },
  {
    name: "Keisha M.",
    rating: 5,
    title: "Three months in, still perfect",
    text: "I’ve reinstalled these wefts twice now and they look the same as day one. Minimal tangling at the nape and the ends are still full.",
    photo: "ugc3",
    product: "signature-sew-in-weft",
    date: "2025-12-02",
  },
];

/* ── Journal ─────────────────────────────────────────────────────────────── */
export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
  date: string;
  readMins: number;
  image: ImgKey;
  body: { h?: string; p: string }[];
}

export const posts: Post[] = [
  {
    slug: "making-a-difference",
    title: "Together, we’re making a difference",
    excerpt: "Why giving back is built into every Reputation order — and where it goes.",
    tag: "Community",
    date: "2026-01-20",
    readMins: 3,
    image: "mission",
    body: [
      {
        p: "Reputation started behind the chair, where we see every day what hair means to the women who sit in it. It isn’t vanity. It’s feeling like yourself again after a hard season — and sometimes for the first time.",
      },
      {
        h: "Built into every order",
        p: "From day one we decided that a portion of every order would go toward organizations that support women through hair loss, treatment and recovery. It isn’t a campaign or a limited-time promotion; it’s simply part of how we do business.",
      },
      {
        h: "Where it goes",
        p: "We’re finalizing our first partner organizations now and will publish each one here, along with what was given and when. We’d rather share real numbers a little later than vague ones today.",
      },
      {
        h: "How you can help",
        p: "Every order counts. If you know a group doing meaningful work in your community, tell us — our contact page goes straight to Liv and Kathy.",
      },
    ],
  },
  {
    slug: "weft-closure-or-frontal",
    title: "Weft, closure or frontal? How to choose your install",
    excerpt: "A stylist’s plain-language guide to what each piece does and who it’s for.",
    tag: "Guides",
    date: "2026-01-12",
    readMins: 5,
    image: "edSalon",
    body: [
      {
        p: "If you’re new to extensions the vocabulary can feel like a lot. Here’s the short version, the way we’d explain it to a client in the chair.",
      },
      {
        h: "Wefts add length and volume",
        p: "A weft is hair sewn onto a thin track. It’s installed in rows and does the heavy lifting of length and fullness. Most full installs use two to three wefts depending on length.",
      },
      {
        h: "Closures finish the top",
        p: "A closure is a small lace piece — usually 4×4 or 5×5 — that sits at the top of the head to create a natural part while keeping all your own hair protected. Low maintenance and beginner friendly.",
      },
      {
        h: "Frontals give you the whole hairline",
        p: "A frontal runs ear to ear, recreating your entire hairline. It’s the most versatile option — ponytails, side parts, slick-backs — but asks for a little more upkeep.",
      },
      {
        h: "Or skip the install",
        p: "Wigs combine all of the above into one ready-to-wear unit. If you like to switch looks often, start there.",
      },
    ],
  },
  {
    slug: "nightly-routine",
    title: "The five-minute nightly routine that makes extensions last",
    excerpt: "Small habits, big difference. What to do before bed so your hair looks new for months.",
    tag: "Hair care",
    date: "2026-01-05",
    readMins: 4,
    image: "edCare",
    body: [
      { p: "Most wear and tear happens while you sleep. These four steps take less time than brushing your teeth." },
      {
        h: "1. Detangle from the ends up",
        p: "Use a wide-tooth comb or a soft bristle brush, starting at the ends and working toward the root while supporting the track with your other hand.",
      },
      {
        h: "2. Add a little moisture",
        p: "A pea-sized amount of lightweight serum through the mid-lengths and ends. Keep oils away from lace and wefts — they loosen adhesive and attract buildup.",
      },
      {
        h: "3. Braid or wrap",
        p: "A loose braid for wavy and curly textures, a wrap for straight. Never sleep on wet hair; it’s when strands are weakest.",
      },
      {
        h: "4. Silk or satin, always",
        p: "A bonnet, scarf or pillowcase reduces friction and keeps the cuticle smooth. It’s the single cheapest way to extend the life of your hair.",
      },
    ],
  },
  {
    slug: "body-wave-vs-deep-wave",
    title: "Body wave vs. deep wave: finding your texture",
    excerpt: "Two of our most-requested textures, compared side by side.",
    tag: "Style",
    date: "2025-12-18",
    readMins: 3,
    image: "edStreet",
    body: [
      { p: "Both are wavy. Both are beautiful. They behave very differently day to day." },
      {
        h: "Body wave",
        p: "A loose, glossy S-pattern. It straightens easily, holds a curl well and softens over time into a relaxed, lived-in wave. Choose it if you like to switch between sleek and voluminous.",
      },
      {
        h: "Deep wave",
        p: "A tighter, more defined pattern with lots of natural volume. It loves water and leave-in and looks its best when you let it do its own thing. Choose it if you want low-heat, high-impact hair.",
      },
      {
        h: "Still deciding?",
        p: "Think about your mornings. If you reach for a flat iron, go body wave. If you reach for a spray bottle, go deep wave.",
      },
    ],
  },
];

/* ── FAQ ─────────────────────────────────────────────────────────────────── */
export const faqs: { group: string; items: { q: string; a: string }[] }[] = [
  {
    group: "Hair & quality",
    items: [
      {
        q: "What kind of hair do you use?",
        a: "Every Reputation piece is made from premium human hair selected for its softness, shine and naturally seamless blend, with cuticles kept intact and aligned so it stays smooth and tangle-free.",
      },
      {
        q: "Can I colour or heat-style the hair?",
        a: "Yes. The hair can be coloured, toned and heat-styled up to 400°F. For lifting or major colour changes we recommend a professional colourist, and always a strand test first.",
      },
      {
        q: "How long will my extensions last?",
        a: "With proper care, wefts, closures and frontals typically last 12 months or more and can be reinstalled several times. See our Hair Care Guide for the routine we recommend.",
      },
      {
        q: "How many wefts do I need for a full install?",
        a: "As a guide: two wefts for lengths up to 18″, three for 20–24″, and three to four for 26″ and longer. Add a closure or frontal to finish the look.",
      },
    ],
  },
  {
    group: "Orders & shipping",
    items: [
      {
        q: "How long does shipping take?",
        a: "Orders are processed within 1–2 business days. Standard U.S. delivery takes 3–5 business days and express options are available at checkout.",
      },
      {
        q: "Do you offer free shipping?",
        a: "Yes — standard U.S. shipping is free on orders over $150.",
      },
      {
        q: "How do I track my order?",
        a: "You’ll receive a tracking link by email as soon as your order ships. You can also use the Track Order page with your order number and email.",
      },
    ],
  },
  {
    group: "Exchanges & returns",
    items: [
      {
        q: "What is your return policy?",
        a: "Unopened, unworn hair in its original packaging can be returned or exchanged within 30 days of delivery. For hygiene reasons we can’t accept hair that has been installed, washed, cut or coloured.",
      },
      {
        q: "My order arrived damaged. What should I do?",
        a: "We’re sorry — contact us within 7 days with your order number and a photo and we’ll make it right.",
      },
    ],
  },
  {
    group: "Payments",
    items: [
      {
        q: "Which payment methods do you accept?",
        a: "All major credit and debit cards, PayPal, Apple Pay and Shop Pay. Sales tax is calculated at checkout based on your shipping address.",
      },
    ],
  },
];

/* ── Hair care guide ─────────────────────────────────────────────────────── */
export const careSteps = [
  {
    title: "Wash",
    body: "Every 7–10 wears, in lukewarm water, with a sulfate-free shampoo. Smooth product downward from root to tip — never scrub or bunch the hair.",
  },
  {
    title: "Condition",
    body: "Apply a hydrating conditioner from mid-length to ends and leave it for 3–5 minutes. Keep conditioner off lace and tracks. A deep mask every third wash keeps hair soft.",
  },
  {
    title: "Dry",
    body: "Blot with a microfibre towel and let it air dry until about 80% dry. If you blow-dry, use medium heat, point the nozzle down the hair shaft and always dry wefts fully at the root.",
  },
  {
    title: "Style",
    body: "Use heat protectant every time and keep tools at or below 400°F. For curly textures, define with water and leave-in rather than brushing dry.",
  },
  {
    title: "Sleep",
    body: "Loose braid or wrap, silk or satin bonnet or pillowcase. Never go to bed with wet hair.",
  },
  {
    title: "Store",
    body: "Between installs, wash and fully dry the hair, then store flat in its box or hanging in a breathable bag, away from direct sunlight.",
  },
];

export const lengthGuide: [string, string][] = [
  ["10–12″", "Chin to collarbone"],
  ["14–16″", "Shoulder to armpit"],
  ["18–20″", "Bra strap to mid-back"],
  ["22–24″", "Mid-back to waist"],
  ["26–30″", "Waist to hip"],
];

/* ── Policies ────────────────────────────────────────────────────────────── */
export interface Policy {
  title: string;
  intro: string;
  sections: { h: string; p: string[] }[];
}

export const policies: Record<string, Policy> = {
  shipping: {
    title: "Shipping & Delivery",
    intro: "Where we ship, how long it takes and what it costs.",
    sections: [
      { h: "Processing", p: ["Orders are processed within 1–2 business days, Monday to Friday, excluding U.S. holidays. You’ll receive a confirmation email when your order is placed and a tracking email when it ships."] },
      { h: "U.S. delivery", p: ["Standard (3–5 business days): free on orders over $150, otherwise calculated at checkout.", "Express (1–2 business days): calculated at checkout."] },
      { h: "Delays & lost parcels", p: ["Carrier delays are outside our control, but we’re always here to help. If your tracking hasn’t updated in 5 business days, contact us and we’ll open an investigation with the carrier."] },
    ],
  },
  returns: {
    title: "Exchanges, Returns & Refunds",
    intro: "We want you to love your hair. If something isn’t right, here’s how we fix it.",
    sections: [
      { h: "30-day window", p: ["Unopened, unworn hair in its original sealed packaging may be returned or exchanged within 30 days of delivery."] },
      { h: "What we can’t accept", p: ["For hygiene and safety, we can’t accept hair that has been removed from its packaging band, installed, washed, cut, coloured or chemically treated. Final-sale items are not eligible."] },
      { h: "How to start", p: ["Contact us with your order number. We’ll send return instructions within one business day. Once your return is inspected, refunds are issued to the original payment method within 5–7 business days."] },
      { h: "Damaged or incorrect items", p: ["Tell us within 7 days of delivery with a photo and we’ll send a replacement or refund at no cost to you."] },
    ],
  },
  "payments-tax": {
    title: "Payments & Tax",
    intro: "How you can pay and how tax is calculated.",
    sections: [
      { h: "Accepted payments", p: ["Visa, Mastercard, American Express, PayPal, Apple Pay and Shop Pay. All payments are processed securely through Shopify’s PCI-compliant checkout — we never see or store your card details."] },
      { h: "Sales tax", p: ["Sales tax is calculated at checkout based on your shipping address and applicable state and local rates."] },
      { h: "Promotions", p: ["One discount code can be applied per order unless stated otherwise. Promotions cannot be applied to previous purchases."] },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    intro: "What we collect, why, and the choices you have.",
    sections: [
      { h: "Information we collect", p: ["Details you give us (name, email, phone, shipping address, order history) and standard device and browsing data collected through cookies and similar technologies."] },
      { h: "How we use it", p: ["To fulfil orders, provide support, send marketing you’ve opted in to, prevent fraud, and understand how our store is used so we can improve it."] },
      { h: "Sharing", p: ["We share data only with service providers that help us run the store — such as Shopify, payment processors, shipping carriers, and email and analytics tools. We do not sell your personal information."] },
      { h: "Your choices", p: ["You can unsubscribe from marketing at any time, and request access to, correction of or deletion of your data by contacting us."] },
    ],
  },
  terms: {
    title: "Terms & Conditions",
    intro: "The terms that apply when you use this site and place an order.",
    sections: [
      { h: "Using this site", p: ["By using this site you agree to these terms. You must be at least 18, or have the permission of a parent or guardian, to place an order."] },
      { h: "Products & pricing", p: ["We do our best to display colours and textures accurately; slight variation is natural with human hair. Prices are in USD and may change without notice. We reserve the right to correct errors and to cancel orders affected by them."] },
      { h: "Intellectual property", p: ["All content on this site is owned by Reputation Hair Extensions Company and may not be used without written permission."] },
      { h: "Liability", p: ["To the extent permitted by law, our liability is limited to the amount you paid for the product in question."] },
    ],
  },
  accessibility: {
    title: "Accessibility Statement",
    intro: "Beautiful hair should be for everyone — and so should shopping for it.",
    sections: [
      { h: "Our commitment", p: ["Reputation is committed to making this website usable for as many people as possible, and we aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA."] },
      { h: "What we’ve done", p: ["Text meets AA colour-contrast requirements; every image has descriptive alternative text; all functionality is available by keyboard with visible focus indicators; headings follow a logical order; and animation respects your reduced-motion setting."] },
      { h: "Known limitations", p: ["Some third-party content — such as embedded social feeds and maps — may not fully meet these standards. We review them regularly and choose the most accessible options available."] },
      { h: "Feedback", p: ["If you have difficulty using any part of this site, please contact us. We aim to respond within two business days and will work with you to provide the information or product you need."] },
    ],
  },
};

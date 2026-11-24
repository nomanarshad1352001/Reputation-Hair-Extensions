# Reputation Hair Extensions — storefront handover

## What this is

A fully working, mobile-first **storefront prototype** (React + Vite + Tailwind) that defines the design system,
section structure, templates and shopping behaviour to be carried into the client's **Symmetry** theme.
It is **not** Liquid theme code and has not been installed on the Shopify store — that step needs collaborator access.
There is no database: cart, recently viewed, newsletter sign-ups, contact messages and reviews are kept in the
visitor's browser (`localStorage`) only.

## Where things live

| Area | File | Shopify equivalent |
| --- | --- | --- |
| All editable content + visibility toggles | `src/theme/settings.ts` | Theme editor section/block settings |
| Design tokens, type scale, buttons | `src/index.css` | Theme settings → Colors / Typography + `assets/custom.css` |
| Catalog, variants, price + stock logic | `src/data/products.ts` | Products, variants, inventory |
| Journal, FAQ, care guide, policies, sample reviews | `src/data/content.ts` | Blog, Pages, Policies, reviews app |
| Images (original, WebP) | `src/assets/img`, `src/data/images.ts` | Files / section image pickers |
| Announcement, header, mega menu, mobile drawer, predictive search | `src/components/Header.tsx` | `header-group` sections |
| Product card, variant picker, quick add | `src/components/ProductCard.tsx` | `product-block`, quick-buy |
| Cart drawer, shipping bar, cross-sell, popup | `src/components/CartDrawer.tsx` | Cart drawer + popup section |
| Homepage sections (in brief order) | `src/sections/home.tsx` | `templates/index.json` |
| Collection + search (filters, sort, load more) | `src/pages/Collection.tsx` | `collection.json`, `search.json` |
| Product page | `src/pages/Product.tsx` | `product.json` |
| Cart + checkout hand-off | `src/pages/Cart.tsx` | `cart.json` → Shopify Checkout |
| About, Contact, FAQ, Care Guide, Journal, Policies, Track Order, Account, 404 | `src/pages/Content.tsx` | Page / blog / policy templates |

## Decisions to confirm in writing

1. **"Hair Quiz" nav slot** → replaced with **Best Sellers** (quizzes / shade matching are out of scope).
   "Hair Care Guide" sits under About Us, in the mobile menu and in the footer.
2. **Logo** → set as a typographic wordmark. Replace with the client's logo file.
3. **Promo figures** (30% / 50% / 55% / "5% off our up-to-50% off sale") → taken from the brief; confirm each is a real, live offer.

## Placeholder content — must be replaced or substantiated before launch

- **Reviews, star ratings and review counts** are sample data for layout.
- **"300,000+ happy customers"** is from the brief; publish only if it can be substantiated.
- **Press strip** (BET, Cosmopolitan, CNN, Seventeen, Allure) uses typographic stand-ins; use only where the brand
  has genuinely been featured and with client-supplied logo files.
- **Giving-back copy** makes no dollar claims and names no partner; add real partners and figures when confirmed.
- **Products, prices, specs and inventory** are a sample catalog. "Only N left" reads from variant stock and is
  never shown otherwise.
- **Contact details** (email address, hours), **social links / @handle**, shipping threshold ($150) and policy text
  are placeholders. Policies need the client's (and ideally legal) review.
- **Photography** was generated for this build. Swap in real brand photography when available.

## Apps to connect on Shopify (free / native first)

| Need | Recommendation | Cost |
| --- | --- | --- |
| Filters + predictive search | Shopify Search & Discovery | Free |
| Reviews with photos | Judge.me (free plan) | Free tier |
| Email + popup | Shopify Email + Shopify Forms, or Klaviyo | Free tier |
| Instagram feed | Instafeed | Free tier |
| Analytics | GA4 + Meta Pixel via Google & YouTube / Facebook & Instagram channels | Free |

No paid app is required for anything shown here. Get written approval before installing anything paid.

## Known limitations

- Checkout, customer accounts and order tracking stop at a clearly labelled preview screen (Shopify handles these).
- Images are inlined into one HTML file for this preview, so there is no `srcset`; on Shopify use `image_url` + `srcset`.
- Lighthouse / Core Web Vitals targets must be measured on the real theme with real images and apps.
- Automated checks run here: no horizontal overflow, no console errors and one `<h1>` per template at 390 / 820 / 1440px.
  Real-device testing (iPhone, Android, tablet) is still required.
- Product video in the gallery is not included.

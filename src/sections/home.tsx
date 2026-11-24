// Homepage sections. Each reads its content + `visible` toggle from theme/settings.ts,
// mirroring an editable Symmetry section in the Shopify theme editor.
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { settings } from "@/theme/settings";
import { ALT, IMG } from "@/data/images";
import { getProduct, products } from "@/data/products";
import { posts, reviews, type Post } from "@/data/content";
import { formatDate } from "@/lib/utils";
import { cn } from "@/utils/cn";
import { EmailForm, Img, SectionHead, SocialIcon, Stars } from "@/components/ui";
import { ProductCarousel } from "@/components/ProductCard";

const H = settings.home;

/* 2 ── Hero ─────────────────────────────────────────────────────────────── */
export function Hero() {
  const h = H.hero;
  if (!h.visible) return null;
  return (
    <section className="relative overflow-hidden bg-blush" aria-labelledby="hero-heading">
      <div className="relative md:absolute md:inset-0">
        <picture>
          <source media="(min-width: 768px)" srcSet={IMG[h.image]} />
          <img
            src={IMG[h.mobileImage]}
            alt={ALT[h.image]}
            fetchPriority="high"
            decoding="async"
            className="aspect-[5/6] w-full object-cover object-top md:aspect-auto md:h-full md:object-[88%_0%]"
          />
        </picture>
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-blush to-transparent md:hidden" aria-hidden="true" />
      </div>

      <div className="wrap relative -mt-12 pb-12 text-center md:mt-0 md:flex md:min-h-[clamp(33rem,51vw,48rem)] md:items-center md:pb-0 md:text-left">
        <div className="animate-fade-up md:max-w-[46%] md:py-16 lg:max-w-[36rem]">
          <p className="t-eyebrow">{h.eyebrow}</p>
          <h1 id="hero-heading" className="mt-4 text-[clamp(2.75rem,11.5vw,3.75rem)] leading-[0.98] tracking-[-0.02em] md:text-[clamp(2.6rem,5.3vw,5.25rem)]">
            {h.headingTop} <em className="block font-normal">{h.headingAccent}</em>
          </h1>
          <p className="t-lead mx-auto mt-5 max-w-md md:mx-0">{h.body}</p>
          <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center md:justify-start">
            <Link to={h.cta.to} className="btn btn-primary w-full sm:w-auto">
              {h.cta.label}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link to={h.secondaryCta.to} className="btn btn-outline w-full sm:w-auto">
              {h.secondaryCta.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* 3 ── Press strip (typographic placeholders, grayscale) ─────────────────── */
const PRESS_STYLE: Record<string, string> = {
  BET: "font-sans text-[1.7rem] font-semibold tracking-[0.28em]",
  Cosmopolitan: "font-sans text-[1.15rem] font-medium uppercase tracking-[0.2em]",
  CNN: "font-sans text-[1.8rem] font-semibold tracking-tight",
  Seventeen: "font-sans text-[1.55rem] font-semibold lowercase tracking-tight",
  Allure: "font-display text-[2rem] lowercase italic",
};

export function PressStrip() {
  const p = H.press;
  if (!p.visible) return null;
  return (
    <section aria-label={p.heading} className="border-b border-line py-7 md:py-9">
      <div className="wrap md:flex md:items-center md:gap-12">
        <p className="t-eyebrow mb-4 shrink-0 text-center text-muted md:mb-0">{p.heading}</p>
        <ul className="no-scrollbar -mx-5 flex snap-x items-center gap-10 overflow-x-auto px-5 md:mx-0 md:flex-1 md:justify-between md:px-0">
          {p.logos.map((name) => (
            <li key={name} className={cn("shrink-0 snap-center leading-none text-[#6a6366]", PRESS_STYLE[name] ?? "font-display text-2xl")}>
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* 4 ── Shop by category ──────────────────────────────────────────────────── */
export function Categories() {
  const c = H.categories;
  if (!c.visible) return null;
  return (
    <section className="section" aria-labelledby="cat-heading">
      <div className="wrap">
        <div className="mb-8 text-center md:mb-12">
          <p className="t-eyebrow mb-3 text-muted">{c.eyebrow}</p>
          <h2 id="cat-heading" className="t-h2">
            {c.heading}
          </h2>
          <p className="mt-3 text-muted">{c.body}</p>
        </div>
        <ul className="grid grid-cols-2 gap-x-3 gap-y-9 md:gap-x-6 lg:grid-cols-4">
          {c.tiles.map((t) => (
            <li key={t.title}>
              <Link to={t.to} className="group block text-center">
                <div className="relative">
                  <div className="aspect-[3/4] overflow-hidden rounded-[1.25rem] bg-blush md:rounded-[1.75rem]">
                    <Img k={t.image} className="size-full object-cover transition-transform duration-[900ms] ease-luxe group-hover:scale-105" />
                  </div>
                  <div className="absolute -bottom-8 left-1/2 size-[4.5rem] -translate-x-1/2 overflow-hidden rounded-full border-[3px] border-white bg-blush shadow-[0_6px_18px_rgba(0,0,0,0.12)] transition-transform duration-500 ease-luxe group-hover:-translate-y-1 md:-bottom-11 md:size-[6.5rem] md:border-4">
                    <Img k={t.inset} alt="" className="size-full scale-110 object-cover" />
                  </div>
                </div>
                <h3 className="mt-11 text-[1.3rem] md:mt-16 md:text-[1.7rem]">{t.title}</h3>
                <span className="t-eyebrow link-line mt-2 inline-block">{c.cta}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* 5 ── VIP welcome offer (email + SMS capture) ───────────────────────────── */
export function VipOffer() {
  const v = H.vip;
  if (!v.visible) return null;
  return (
    <section className="on-dark bg-black text-white" aria-labelledby="vip-heading">
      <div className="grid md:grid-cols-2">
        <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[36rem]">
          <Img k={v.image} className="absolute inset-0 size-full object-cover" />
        </div>
        <div className="flex flex-col justify-center px-5 py-14 md:px-12 md:py-20 lg:px-20">
          <p className="t-eyebrow text-blush">{v.eyebrow}</p>
          <h2 id="vip-heading" className="mt-4">
            <em className="t-display block font-normal">{v.heading}</em>
            <span className="mt-3 block text-2xl md:text-[2rem]">{v.subheading}</span>
          </h2>
          <p className="mt-5 max-w-md text-white/80">{v.body}</p>
          <div className="mt-7 max-w-md">
            <EmailForm source="vip" cta={v.cta.label} dark withPhone />
          </div>
          <p className="mt-4 max-w-md text-sm text-white/65">
            {v.privacy}{" "}
            <Link to="/policies/privacy" className="underline underline-offset-2">
              Privacy Policy
            </Link>
            .
          </p>
          <Link to={v.shopCta.to} className="t-eyebrow link-line mt-8 inline-flex items-center gap-2 self-start">
            {v.shopCta.label} <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* 6 ── Best sellers ──────────────────────────────────────────────────────── */
export function BestSellers() {
  const b = H.bestSellers;
  if (!b.visible) return null;
  const items = products.filter((p) => p.bestSeller).slice(0, b.limit);
  return (
    <section className="section overflow-hidden">
      <div className="wrap">
        <SectionHead
          align="left"
          eyebrow={b.eyebrow}
          heading={b.heading}
          action={
            <Link to={b.cta.to} className="t-eyebrow link-line mb-1 shrink-0">
              {b.cta.label}
            </Link>
          }
        />
        <ProductCarousel items={items} label="Best-selling products" />
      </div>
    </section>
  );
}

/* 7 ── Reviews / social proof ────────────────────────────────────────────── */
export function Reviews() {
  const r = H.reviews;
  const ref = useRef<HTMLUListElement>(null);
  if (!r.visible) return null;
  const total = products.reduce((n, p) => n + p.reviewCount, 0);
  const scroll = (d: number) => ref.current?.scrollBy({ left: d * (ref.current.clientWidth * 0.7), behavior: "smooth" });
  const arrow = "grid size-12 place-items-center rounded-full border border-black transition-colors hover:bg-black hover:text-white";
  return (
    <section className="section overflow-hidden bg-blush-soft" aria-labelledby="reviews-heading">
      <div className="wrap grid gap-10 lg:grid-cols-[20rem_1fr] lg:gap-14">
        <div className="text-center lg:text-left">
          <p className="t-eyebrow mb-3 text-muted">{r.eyebrow}</p>
          <h2 id="reviews-heading" className="t-h2">
            {r.heading}
          </h2>
          <div className="mt-6 flex items-center justify-center gap-4 lg:justify-start">
            <span className="font-display text-6xl leading-none">{r.rating}</span>
            <div className="text-left">
              <Stars value={r.rating} size={18} />
              <p className="mt-1 text-[15px] text-muted">from {total.toLocaleString("en-US")} reviews</p>
            </div>
          </div>
          <div className="mt-8 hidden gap-3 lg:flex">
            <button type="button" className={arrow} onClick={() => scroll(-1)} aria-label="Previous reviews">
              <ChevronLeft size={20} strokeWidth={1.5} aria-hidden="true" />
            </button>
            <button type="button" className={arrow} onClick={() => scroll(1)} aria-label="Next reviews">
              <ChevronRight size={20} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
        </div>

        <ul ref={ref} aria-label="Customer reviews" className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 md:-mx-10 md:scroll-px-10 md:px-10 lg:mx-0 lg:-mr-10 lg:scroll-px-0 lg:pl-0">
          {reviews.map((rev) => {
            const prod = getProduct(rev.product);
            return (
              <li key={rev.name} className="flex w-[82%] shrink-0 snap-start flex-col overflow-hidden rounded-3xl bg-white sm:w-[46%] lg:w-[21rem]">
                <div className="aspect-[5/4] overflow-hidden bg-blush">
                  <Img k={rev.photo} className="size-full object-cover object-[50%_25%]" />
                </div>
                <figure className="flex flex-1 flex-col p-6">
                  <Stars value={rev.rating} size={15} />
                  <blockquote className="mt-3 flex-1">
                    <p className="font-display text-xl leading-snug">“{rev.title}”</p>
                    <p className="mt-2 text-muted">{rev.text}</p>
                  </blockquote>
                  <figcaption className="mt-5 border-t border-line pt-4 text-[15px]">
                    <span className="font-medium">{rev.name}</span>
                    {prod && (
                      <>
                        <span className="text-muted"> on </span>
                        <Link to={`/products/${prod.handle}`} className="underline underline-offset-4">
                          {prod.title}
                        </Link>
                      </>
                    )}
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* 8 ── Mission / storytelling ────────────────────────────────────────────── */
export function Mission() {
  const m = H.mission;
  if (!m.visible) return null;
  return (
    <section className="section" aria-labelledby="mission-heading">
      <div className="wrap grid items-center gap-9 md:grid-cols-2 md:gap-14 lg:gap-20">
        <div className="relative">
          <div className="absolute -bottom-4 -left-4 hidden h-2/3 w-2/3 rounded-[2rem] bg-blush md:block" aria-hidden="true" />
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-blush md:aspect-[5/4] md:rounded-[2rem]">
            <Img k={m.image} className="size-full object-cover" />
          </div>
        </div>
        <div>
          <p className="t-eyebrow mb-4 text-muted">{m.eyebrow}</p>
          <h2 id="mission-heading" className="t-h1">
            {m.heading}
          </h2>
          <p className="t-lead mt-5 max-w-lg text-muted">{m.body}</p>
          <Link to={m.cta.to} className="btn btn-primary mt-8">
            {m.cta.label}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* 9 ── Journal teaser ────────────────────────────────────────────────────── */
export function PostCard({ post, className }: { post: Post; className?: string }) {
  return (
    <article className={cn("group", className)}>
      <Link to={`/blogs/journal/${post.slug}`} className="block">
        <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-blush">
          <Img k={post.image} className="size-full object-cover transition-transform duration-700 ease-luxe group-hover:scale-105" />
        </div>
        <p className="mt-4 text-sm text-muted">
          <span className="t-eyebrow text-black">{post.tag}</span>
          <span className="mx-2" aria-hidden="true">
            ·
          </span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </p>
        <h3 className="mt-2 text-[1.45rem] leading-tight md:text-[1.6rem]">{post.title}</h3>
        <p className="mt-2 text-muted">{post.excerpt}</p>
        <span className="t-eyebrow link-line mt-4 inline-block">Read more</span>
      </Link>
    </article>
  );
}

export function BlogTeaser() {
  const b = H.blog;
  if (!b.visible) return null;
  return (
    <section className="section overflow-hidden border-t border-line">
      <div className="wrap">
        <SectionHead
          align="left"
          eyebrow={b.eyebrow}
          heading={b.heading}
          action={
            <Link to={b.cta.to} className="t-eyebrow link-line mb-1 hidden shrink-0 sm:block">
              {b.cta.label}
            </Link>
          }
        />
        <ul className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 md:mx-0 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:px-0">
          {posts.slice(0, 3).map((p) => (
            <li key={p.slug} className="w-[80%] shrink-0 snap-start md:w-auto">
              <PostCard post={p} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* 10 ── Instagram feed ───────────────────────────────────────────────────── */
export function InstagramFeed() {
  const ig = H.instagram;
  if (!ig.visible) return null;
  const url = settings.brand.social[0].url;
  return (
    <section className="pb-16 md:pb-24" aria-labelledby="ig-heading">
      <div className="wrap mb-8 text-center">
        <h2 id="ig-heading" className="t-h2">
          {ig.heading}
        </h2>
        <p className="mt-3 text-muted">
          {ig.body}{" "}
          <a href={url} target="_blank" rel="noreferrer" className="font-medium text-black underline underline-offset-4">
            Follow {settings.brand.instagramHandle}
          </a>
        </p>
      </div>
      <ul className="grid grid-cols-4 gap-1 px-1 md:gap-2 md:px-2 lg:grid-cols-8">
        {ig.tiles.map((k, i) => (
          <li key={k + i}>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              aria-label={`View on Instagram: ${ALT[k]} (opens in a new tab)`}
              className="group relative block aspect-square overflow-hidden rounded-lg bg-blush md:rounded-xl"
            >
              <Img k={k} alt="" className="size-full object-cover object-top transition-transform duration-700 ease-luxe group-hover:scale-110" />
              <span className="absolute inset-0 grid place-items-center bg-black/35 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                <SocialIcon name="Instagram" size={24} />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* 11 ── Newsletter CTA (pre-footer) ──────────────────────────────────────── */
export function NewsletterCta() {
  const n = H.newsletter;
  if (!n.visible) return null;
  return (
    <section className="bg-blush py-16 md:py-24" aria-labelledby="nl-heading">
      <div className="wrap max-w-2xl text-center">
        <p className="t-eyebrow mb-4">{n.eyebrow}</p>
        <h2 id="nl-heading" className="t-h1">
          <em className="font-normal">{n.heading}</em>
        </h2>
        <p className="t-lead mx-auto mt-4 max-w-md">{n.body}</p>
        <div className="mx-auto mt-8 max-w-lg text-left">
          <EmailForm source="newsletter-cta" cta={n.cta} />
        </div>
        <p className="mt-4 text-sm text-muted">
          By subscribing you agree to our{" "}
          <Link to="/policies/privacy" className="underline underline-offset-2">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Expand, RefreshCw, ShieldCheck, Star, Truck, X } from "lucide-react";
import {
  defaultSel,
  describeSel,
  getProduct,
  priceFor,
  products,
  SPECS,
  stockFor,
  TYPE_LABEL,
  type Product,
  type Selection,
} from "@/data/products";
import { careSteps, lengthGuide, reviews as siteReviews } from "@/data/content";
import { ALT, IMG, type ImgKey } from "@/data/images";
import { settings } from "@/theme/settings";
import { useStore } from "@/lib/store";
import { formatDate, load, money, save, useSeo } from "@/lib/utils";
import { cn } from "@/utils/cn";
import { Accordion, Crumbs, Img, Qty, Stars } from "@/components/ui";
import { Badges, ProductCarousel, StockNote, VariantPicker } from "@/components/ProductCard";
import { NotFound } from "@/pages/Content";

export default function ProductPage() {
  const { handle } = useParams();
  const p = getProduct(handle);
  if (!p) return <NotFound />;
  return <ProductView key={p.handle} p={p} />;
}

/* ── Gallery: swipe carousel on mobile · thumbnails + hover zoom on desktop ─ */
function Gallery({ p, idx, setIdx }: { p: Product; idx: number; setIdx: (i: number) => void }) {
  const scroller = useRef<HTMLDivElement>(null);
  const programmatic = useRef(false);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [lightbox, setLightbox] = useState(false);
  const n = p.images.length;
  const go = (d: number) => setIdx((idx + d + n) % n);

  useEffect(() => {
    const el = scroller.current;
    if (!el || !el.clientWidth) return;
    const target = idx * el.clientWidth;
    if (Math.abs(el.scrollLeft - target) > 4) {
      programmatic.current = true;
      el.scrollTo({ left: target, behavior: "smooth" });
      const t = setTimeout(() => (programmatic.current = false), 600);
      return () => clearTimeout(t);
    }
  }, [idx]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") setIdx((idx + 1) % n);
      if (e.key === "ArrowLeft") setIdx((idx - 1 + n) % n);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lightbox, idx, n, setIdx]);

  const onScroll = () => {
    const el = scroller.current;
    if (!el || programmatic.current) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== idx) setIdx(i);
  };

  const navBtn = "grid size-11 place-items-center rounded-full bg-white/90 shadow-md backdrop-blur transition-colors hover:bg-black hover:text-white";

  return (
    <div>
      {/* Mobile swipe */}
      <div className="relative -mx-5 md:mx-0 md:overflow-hidden md:rounded-3xl lg:hidden">
        <div ref={scroller} onScroll={onScroll} className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto" aria-label="Product images" role="group">
          {p.images.map((k, i) => (
            <div key={k} className="aspect-[4/5] w-full shrink-0 snap-center bg-blush">
              <Img k={k} eager={i === 0} className="size-full object-cover" />
            </div>
          ))}
        </div>
        <Badges p={p} className="pointer-events-none absolute left-4 top-4" />
        <button type="button" onClick={() => setLightbox(true)} aria-label="View image full screen" className={cn(navBtn, "absolute right-4 top-4")}>
          <Expand size={17} strokeWidth={1.5} aria-hidden="true" />
        </button>
        <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
          {p.images.map((k, i) => (
            <button key={k} type="button" onClick={() => setIdx(i)} aria-label={`Show image ${i + 1} of ${n}`} aria-current={i === idx} className="grid size-6 place-items-center">
              <span className={cn("h-1.5 rounded-full transition-all duration-300", i === idx ? "w-5 bg-black" : "w-1.5 bg-black/30")} />
            </button>
          ))}
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden gap-4 lg:grid lg:grid-cols-[5rem_1fr]">
        <ul className="flex flex-col gap-3">
          {p.images.map((k, i) => (
            <li key={k}>
              <button
                type="button"
                onClick={() => setIdx(i)}
                aria-label={`Show image ${i + 1} of ${n}`}
                aria-current={i === idx}
                className={cn("block aspect-[4/5] w-full overflow-hidden rounded-xl border bg-blush transition-colors", i === idx ? "border-black" : "border-transparent hover:border-black/30")}
              >
                <Img k={k} alt="" className="size-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
        <div className="relative">
          <button
            type="button"
            onClick={() => setLightbox(true)}
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
            }}
            onMouseLeave={() => setZoom(null)}
            aria-label="Open image full screen"
            className="block aspect-[4/5] w-full cursor-zoom-in overflow-hidden rounded-3xl bg-blush"
          >
            <img
              key={p.images[idx]}
              src={IMG[p.images[idx]]}
              alt={ALT[p.images[idx]]}
              className="size-full animate-fade object-cover transition-transform duration-300 ease-out"
              style={zoom ? { transform: "scale(1.9)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
            />
          </button>
          <Badges p={p} className="pointer-events-none absolute left-4 top-4" />
          {n > 1 && (
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button type="button" className={navBtn} onClick={() => go(-1)} aria-label="Previous image">
                <ChevronLeft size={18} strokeWidth={1.5} aria-hidden="true" />
              </button>
              <button type="button" className={navBtn} onClick={() => go(1)} aria-label="Next image">
                <ChevronRight size={18} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div role="dialog" aria-modal="true" aria-label="Image viewer" className="on-dark fixed inset-0 z-[60] flex animate-fade items-center justify-center bg-black/95 p-4">
          <img src={IMG[p.images[idx]]} alt={ALT[p.images[idx]]} className="max-h-full max-w-full rounded-xl object-contain" />
          <button type="button" autoFocus onClick={() => setLightbox(false)} aria-label="Close image viewer" className="absolute right-4 top-4 grid size-12 place-items-center rounded-full bg-white text-black">
            <X size={20} aria-hidden="true" />
          </button>
          {n > 1 && (
            <>
              <button type="button" onClick={() => go(-1)} aria-label="Previous image" className="absolute left-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white text-black">
                <ChevronLeft size={20} aria-hidden="true" />
              </button>
              <button type="button" onClick={() => go(1)} aria-label="Next image" className="absolute right-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white text-black">
                <ChevronRight size={20} aria-hidden="true" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Product view ────────────────────────────────────────────────────────── */
function ProductView({ p }: { p: Product }) {
  const { add, pushRecent, recent } = useStore();
  const navigate = useNavigate();
  const [sel, setSel] = useState<Selection>(() => defaultSel(p));
  const [qty, setQty] = useState(1);
  const [idx, setIdx] = useState(0);
  const [acc, setAcc] = useState(0);
  const [sticky, setSticky] = useState(false);
  const atc = useRef<HTMLDivElement>(null);
  const accRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLElement>(null);

  const { price, compareAt, saving } = priceFor(p, sel);
  const stock = stockFor(p, sel);

  useSeo(`${p.title} — ${TYPE_LABEL[p.type]}`, p.description);
  useEffect(() => pushRecent(p.handle), [p.handle, pushRecent]);

  useEffect(() => {
    const el = atc.current;
    if (!el) return;
    // Show the sticky bar whenever the main add-to-bag row is off-screen (above or below).
    // …but step aside once the footer is in view so it never covers the legal links.
    const footer = document.querySelector("footer");
    let atcSeen = true;
    let footerSeen = false;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === el) atcSeen = e.isIntersecting;
        else footerSeen = e.isIntersecting;
      }
      setSticky(!atcSeen && !footerSeen);
    });
    io.observe(el);
    if (footer) io.observe(footer);
    return () => io.disconnect();
  }, []);

  const change = (next: Selection) => {
    const swap = (next.color !== sel.color && p.optionImages?.[next.color]) || (next.texture !== sel.texture && p.optionImages?.[next.texture]);
    if (swap) {
      const i = p.images.indexOf(swap as ImgKey);
      if (i >= 0) setIdx(i);
    }
    setSel(next);
    setQty(1);
  };

  const related = [...products.filter((x) => x.type === p.type && x.handle !== p.handle), ...products.filter((x) => x.type !== p.type && x.bestSeller)].slice(0, 6);
  const recents = recent.filter((h) => h !== p.handle).flatMap((h) => getProduct(h) ?? []);

  const openGuide = () => {
    setAcc(2);
    accRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const accordion = [
    {
      title: "Description",
      content: (
        <div className="space-y-3">
          <p>{p.description}</p>
          <p>Premium hair selected for its softness, shine and naturally seamless blend — crafted to look as incredible in real life as it does on camera.</p>
        </div>
      ),
    },
    {
      title: "Specifications",
      content: (
        <dl className="divide-y divide-line">
          {SPECS[p.type].map(([k, v]) => (
            <div key={k} className="flex gap-4 py-2.5">
              <dt className="w-28 shrink-0 text-black">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      ),
    },
    {
      title: "Length & Size Guide",
      content: (
        <div>
          <p className="mb-3">Lengths are measured straight, from the weft or lace to the ends. Wavy and curly textures sit 1–3″ shorter when dry.</p>
          <table className="w-full text-left">
            <caption className="sr-only">Where each length falls on the body</caption>
            <thead>
              <tr className="border-b border-black text-black">
                <th scope="col" className="py-2 font-medium">
                  Length
                </th>
                <th scope="col" className="py-2 font-medium">
                  Falls at
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {lengthGuide.map(([l, d]) => (
                <tr key={l}>
                  <td className="py-2 tabular-nums">{l}</td>
                  <td className="py-2">{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ),
    },
    {
      title: "Hair Care",
      content: (
        <ul className="space-y-2.5">
          {careSteps.slice(0, 4).map((s) => (
            <li key={s.title}>
              <span className="font-medium text-black">{s.title}.</span> {s.body}
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: "Shipping & Returns",
      content: (
        <div className="space-y-3">
          <p>Orders ship within 1–2 business days. Standard U.S. delivery takes 3–5 business days and is free over {money(settings.brand.freeShippingThreshold)}.</p>
          <p>Unopened hair can be returned or exchanged within 30 days of delivery.</p>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="wrap pt-4 md:pt-6">
        <Crumbs items={[{ label: "Home", to: "/" }, { label: TYPE_LABEL[p.type], to: `/collections/${p.type}` }, { label: p.title }]} />
      </div>

      <div className="wrap grid gap-7 pb-14 pt-4 md:grid-cols-2 md:gap-8 lg:gap-14 lg:pb-24 lg:pt-5">
        <div className="min-w-0 md:sticky md:top-24 md:self-start lg:static">
          <Gallery p={p} idx={idx} setIdx={setIdx} />
        </div>

        <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <p className="t-eyebrow text-muted">{p.subtitle}</p>
          <h1 className="mt-2 text-[2.1rem] md:text-[2.25rem] lg:text-[2.75rem]">{p.title}</h1>

          <button type="button" onClick={() => reviewsRef.current?.scrollIntoView({ behavior: "smooth" })} className="mt-3 flex items-center gap-2 text-[15px]">
            <Stars value={p.rating} size={15} />
            <span className="underline underline-offset-4">
              {p.rating} · {p.reviewCount} reviews
            </span>
          </button>

          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
            <p className="flex items-baseline gap-2.5">
              <span className="sr-only">{saving > 0 ? "Sale price" : "Price"}</span>
              <span className="text-[1.75rem] font-medium leading-none">{money(price)}</span>
              {saving > 0 && (
                <>
                  <span className="sr-only">Regular price</span>
                  <s className="text-lg text-muted">{money(compareAt)}</s>
                </>
              )}
            </p>
            {saving > 0 && (
              <span className="rounded-full bg-blush px-3 py-1.5 text-[13px] font-medium leading-none">
                Save {money(saving)} ({p.discount}%)
              </span>
            )}
          </div>

          <div className="mt-6 border-t border-line pt-6">
            <VariantPicker p={p} sel={sel} onChange={change} onGuide={openGuide} />
          </div>

          <div className="mt-6" aria-live="polite">
            <StockNote stock={stock} />
          </div>

          <div ref={atc} className="mt-5 flex gap-3">
            <Qty value={qty} max={Math.max(1, stock)} onChange={setQty} />
            <button type="button" className="btn btn-primary flex-1" disabled={stock === 0} onClick={() => add(p, sel, qty)}>
              {stock === 0 ? "Sold out" : "Add to bag"}
            </button>
          </div>
          <button
            type="button"
            className="btn btn-outline mt-3 w-full"
            disabled={stock === 0}
            onClick={() => {
              add(p, sel, qty);
              navigate("/checkout");
            }}
          >
            Buy it now
          </button>

          <ul className="mt-7 grid grid-cols-3 gap-2 rounded-2xl bg-blush-soft p-4 text-center text-[13px] leading-snug">
            {[
              [Truck, `Free U.S. shipping over ${money(settings.brand.freeShippingThreshold)}`],
              [RefreshCw, "30-day exchanges & returns"],
              [ShieldCheck, "100% human hair, guaranteed"],
            ].map(([Icon, label]) => {
              const I = Icon as typeof Truck;
              return (
                <li key={label as string} className="flex flex-col items-center gap-2">
                  <I size={22} strokeWidth={1.25} aria-hidden="true" />
                  {label as string}
                </li>
              );
            })}
          </ul>

          <div ref={accRef} className="mt-8">
            <Accordion items={accordion} open={acc} onChange={setAcc} />
          </div>
        </div>
      </div>

      <ReviewsSection p={p} innerRef={reviewsRef} />

      <section className="section overflow-hidden">
        <div className="wrap">
          <h2 className="t-h2 mb-8">You may also like</h2>
          <ProductCarousel items={related} label="Related products" />
        </div>
      </section>

      {recents.length > 0 && (
        <section className="overflow-hidden border-t border-line py-14 md:py-20">
          <div className="wrap">
            <h2 className="t-h2 mb-8">Recently viewed</h2>
            <ProductCarousel items={recents} label="Recently viewed products" />
          </div>
        </section>
      )}

      {/* Sticky add-to-cart (mobile) */}
      <div
        inert={!sticky}
        className={cn(
          "fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 px-4 pt-3 backdrop-blur transition-transform duration-300 ease-luxe lg:hidden",
          "pb-[max(0.75rem,env(safe-area-inset-bottom))]",
          sticky ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-medium leading-tight">{p.title}</p>
            <p className="truncate text-[13px] text-muted">{describeSel(sel)}</p>
          </div>
          <button type="button" className="btn btn-primary btn-sm shrink-0 !px-5" disabled={stock === 0} onClick={() => add(p, sel, qty)}>
            {stock === 0 ? "Sold out" : `Add · ${money(price * qty)}`}
          </button>
        </div>
      </div>
    </>
  );
}

/* ── Reviews (sample content; photo upload stored locally) ───────────────── */
interface LocalReview {
  name: string;
  rating: number;
  title: string;
  text: string;
  date: string;
  photo?: string;
}

const GENERIC: Omit<LocalReview, "photo">[] = [
  { name: "Tiana W.", rating: 5, title: "Soft from root to tip", text: "Full all the way to the ends and barely any shedding after two washes. True to length.", date: "2026-01-11" },
  { name: "Priya S.", rating: 5, title: "Blends like my own", text: "The texture matched my blow-dried hair perfectly. Shipping was quick and the packaging is gorgeous.", date: "2025-12-30" },
  { name: "Renee A.", rating: 4, title: "Beautiful quality", text: "Lovely hair with a natural shine — not that plastic gloss. I’d go one length longer next time.", date: "2025-12-12" },
];

function ReviewsSection({ p, innerRef }: { p: Product; innerRef: React.RefObject<HTMLElement | null> }) {
  const storeKey = `rep_reviews_${p.handle}`;
  const [mine, setMine] = useState<LocalReview[]>(() => load(storeKey, []));
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", title: "", text: "", rating: 5 });
  const [photo, setPhoto] = useState<string>();
  const [error, setError] = useState("");

  const own = siteReviews.filter((r) => r.product === p.handle);
  const dist = p.rating >= 4.9 ? [90, 8, 1, 1, 0] : p.rating >= 4.8 ? [84, 12, 3, 1, 0] : [78, 16, 4, 1, 1];

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(String(reader.result));
    reader.readAsDataURL(file);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.text.trim()) {
      setError("Please add your name and a few words about the hair.");
      return;
    }
    const next = [{ ...form, date: new Date().toISOString().slice(0, 10), photo }, ...mine];
    setMine(next);
    save(storeKey, next.map((r) => ({ ...r, photo: r.photo && r.photo.length < 400_000 ? r.photo : undefined })));
    setForm({ name: "", title: "", text: "", rating: 5 });
    setPhoto(undefined);
    setError("");
    setOpen(false);
  };

  return (
    <section ref={innerRef} id="reviews" className="section scroll-mt-20 bg-blush-soft" aria-labelledby="pdp-reviews">
      <div className="wrap grid gap-10 lg:grid-cols-[20rem_1fr] lg:gap-16">
        <div>
          <h2 id="pdp-reviews" className="t-h2">
            Reviews
          </h2>
          <div className="mt-5 flex items-center gap-4">
            <span className="font-display text-6xl leading-none">{p.rating}</span>
            <div>
              <Stars value={p.rating} size={18} />
              <p className="mt-1 text-[15px] text-muted">Based on {p.reviewCount} reviews</p>
            </div>
          </div>
          <ul className="mt-6 space-y-2" aria-label="Rating breakdown">
            {dist.map((pct, i) => (
              <li key={i} className="flex items-center gap-3 text-[15px]">
                <span className="w-8 tabular-nums">{5 - i} ★</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-blush">
                  <span className="block h-full rounded-full bg-black" style={{ width: `${pct}%` }} />
                </span>
                <span className="w-10 text-right tabular-nums text-muted">{pct}%</span>
              </li>
            ))}
          </ul>
          <button type="button" className="btn btn-outline mt-7 w-full" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            Write a review
          </button>
        </div>

        <div>
          {open && (
            <form onSubmit={submit} noValidate className="mb-8 animate-fade-up rounded-3xl bg-white p-6 md:p-8">
              <h3 className="t-h3">Share your experience</h3>
              <fieldset className="mt-5">
                <legend className="mb-2 text-[15px] font-medium">Your rating</legend>
                <div className="flex gap-1" role="radiogroup" aria-label="Rating">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} type="button" role="radio" aria-checked={form.rating === n} aria-label={`${n} star${n > 1 ? "s" : ""}`} onClick={() => setForm({ ...form, rating: n })} className="grid size-11 place-items-center">
                      <Star size={26} strokeWidth={1.25} fill={n <= form.rating ? "#000" : "none"} aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </fieldset>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="rv-name" className="mb-1.5 block text-[15px] font-medium">
                    Name
                  </label>
                  <input id="rv-name" className="field" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div>
                  <label htmlFor="rv-title" className="mb-1.5 block text-[15px] font-medium">
                    Headline
                  </label>
                  <input id="rv-title" className="field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="rv-text" className="mb-1.5 block text-[15px] font-medium">
                  Review
                </label>
                <textarea id="rv-text" className="field" value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} required />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <label htmlFor="rv-photo" className="btn btn-outline btn-sm">
                  {photo ? "Change photo" : "Add a photo"}
                </label>
                <input id="rv-photo" type="file" accept="image/*" onChange={onFile} className="sr-only" />
                {photo && <img src={photo} alt="Your uploaded photo preview" className="size-16 rounded-xl object-cover" />}
              </div>
              {error && (
                <p role="alert" className="mt-4 text-[15px] font-medium">
                  {error}
                </p>
              )}
              <button type="submit" className="btn btn-primary mt-6">
                Submit review
              </button>
            </form>
          )}

          <ul className="divide-y divide-line border-y border-line">
            {mine.map((r, i) => (
              <ReviewRow key={`m${i}`} r={r} tag="Your review" />
            ))}
            {own.map((r) => (
              <ReviewRow key={r.name} r={{ ...r, photo: IMG[r.photo] }} photoAlt={ALT[r.photo]} />
            ))}
            {GENERIC.slice(0, own.length ? 2 : 3).map((r) => (
              <ReviewRow key={r.name} r={r} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function ReviewRow({ r, tag, photoAlt }: { r: LocalReview; tag?: string; photoAlt?: string }) {
  return (
    <li className="flex gap-5 py-7">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <Stars value={r.rating} size={14} />
          {tag && <span className="rounded-full bg-blush px-2.5 py-1 text-[11px] font-medium uppercase leading-none tracking-wider">{tag}</span>}
        </div>
        {r.title && <p className="mt-2.5 font-display text-xl">{r.title}</p>}
        <p className="mt-1.5 text-muted">{r.text}</p>
        <p className="mt-3 text-sm">
          <span className="font-medium">{r.name}</span>
          <span className="text-muted">
            {" "}
            · <time dateTime={r.date}>{formatDate(r.date)}</time>
          </span>
        </p>
      </div>
      {r.photo && <img src={r.photo} alt={photoAlt ?? `Photo shared by ${r.name}`} loading="lazy" className="size-24 shrink-0 rounded-2xl object-cover object-top md:size-32" />}
    </li>
  );
}

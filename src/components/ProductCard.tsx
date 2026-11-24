import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import {
  COLORS,
  defaultSel,
  describeSel,
  fromPrice,
  imageFor,
  priceFor,
  stockFor,
  type Product,
  type Selection,
} from "@/data/products";
import { useStore } from "@/lib/store";
import { money } from "@/lib/utils";
import { cn } from "@/utils/cn";
import { Drawer, Img, Stars } from "@/components/ui";

/* ── Price ───────────────────────────────────────────────────────────────── */
export function Price({ price, compareAt, from, className }: { price: number; compareAt: number; from?: boolean; className?: string }) {
  const sale = compareAt > price;
  return (
    <p className={cn("flex flex-wrap items-baseline gap-x-2", className)}>
      <span className="sr-only">{sale ? "Sale price" : "Price"}</span>
      <span className="font-medium">
        {from && <span className="font-normal">From </span>}
        {money(price)}
      </span>
      {sale && (
        <>
          <span className="sr-only">Regular price</span>
          <s className="text-muted">{money(compareAt)}</s>
        </>
      )}
    </p>
  );
}

export function Badges({ p, className }: { p: Product; className?: string }) {
  const list: [string, string][] = [];
  if (p.soldOut) list.push(["Sold out", "bg-white text-black"]);
  else if (p.discount) list.push([`Save ${p.discount}%`, "bg-black text-white"]);
  if (p.bestSeller) list.push(["Best seller", "bg-blush text-black"]);
  else if (p.isNew) list.push(["New", "bg-white text-black"]);
  if (!list.length) return null;
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)}>
      {list.map(([label, cls]) => (
        <li key={label} className={cn("rounded-full px-2.5 py-1 text-[11px] font-medium uppercase leading-none tracking-[0.12em]", cls)}>
          {label}
        </li>
      ))}
    </ul>
  );
}

/* ── Product card ────────────────────────────────────────────────────────── */
export function ProductCard({ p }: { p: Product }) {
  const { setQuickAdd } = useStore();
  const { price, compareAt } = fromPrice(p);
  return (
    <article className="group relative">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-blush">
        <Link to={`/products/${p.handle}`} tabIndex={-1} className="block size-full">
          <Img k={p.images[0]} className="size-full object-cover transition-transform duration-700 ease-luxe group-hover:scale-[1.04]" />
          {p.images[1] && (
            <Img
              k={p.images[1]}
              alt=""
              className="absolute inset-0 hidden size-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 lg:block"
            />
          )}
        </Link>
        <Badges p={p} className="pointer-events-none absolute left-2.5 top-2.5 right-12" />
        {!p.soldOut && (
          <button type="button" className="quick-add" onClick={() => setQuickAdd(p)} aria-label={`Quick add ${p.title}`}>
            <Plus size={18} strokeWidth={1.75} className="qa-icon" aria-hidden="true" />
            <span className="qa-label">Quick add</span>
          </button>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="font-sans text-[15px] font-medium leading-snug tracking-normal md:text-base">
          <Link to={`/products/${p.handle}`} className="link-grow">
            {p.title}
          </Link>
        </h3>
        <div className="flex items-center gap-1.5 text-sm text-muted">
          <Stars value={p.rating} size={12} />
          <span aria-hidden="true">({p.reviewCount})</span>
          <span className="sr-only">{p.reviewCount} reviews</span>
        </div>
        <Price price={price} compareAt={compareAt} from className="text-[15px]" />
        <ul className="flex gap-1.5 pt-1" aria-label="Available colors">
          {p.colors.map((c) => (
            <li key={c} title={COLORS[c].name} className="size-3.5 rounded-full border border-black/15" style={{ background: COLORS[c].hex }}>
              <span className="sr-only">{COLORS[c].name}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

/* ── Product carousel (1.5-up peek on mobile · 4-up desktop) ─────────────── */
export function ProductCarousel({ items, label }: { items: Product[]; label: string }) {
  const ref = useRef<HTMLUListElement>(null);
  const scroll = (d: number) => ref.current?.scrollBy({ left: d * ref.current.clientWidth * 0.8, behavior: "smooth" });
  const arrow =
    "absolute top-[34%] z-10 hidden size-12 place-items-center rounded-full border border-line bg-white shadow-md transition-colors hover:bg-black hover:text-white lg:grid";
  return (
    <div className="relative">
      <ul
        ref={ref}
        aria-label={label}
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 md:-mx-10 md:gap-6 md:scroll-px-10 md:px-10"
      >
        {items.map((p) => (
          <li key={p.handle} className="w-[62%] shrink-0 snap-start sm:w-[38%] lg:w-[calc(25%-1.125rem)]">
            <ProductCard p={p} />
          </li>
        ))}
      </ul>
      {items.length > 4 && (
        <>
          <button type="button" className={cn(arrow, "-left-6")} onClick={() => scroll(-1)} aria-label="Scroll products left">
            <ChevronLeft size={20} strokeWidth={1.5} aria-hidden="true" />
          </button>
          <button type="button" className={cn(arrow, "-right-6")} onClick={() => scroll(1)} aria-label="Scroll products right">
            <ChevronRight size={20} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </>
      )}
    </div>
  );
}

/* ── Variant picker: color swatches · texture · length ───────────────────── */
export function VariantPicker({
  p,
  sel,
  onChange,
  onGuide,
}: {
  p: Product;
  sel: Selection;
  onChange: (s: Selection) => void;
  onGuide?: () => void;
}) {
  const pill = (on: boolean, off = false) =>
    cn(
      "min-h-11 rounded-full border px-4 text-[15px] transition-colors duration-200",
      on ? "border-black bg-black text-white" : "border-black/25 bg-white hover:border-black",
      off && !on && "border-dashed text-muted line-through",
      off && on && "line-through",
    );
  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="mb-3 text-[15px]">
          <span className="font-medium">Color:</span>{" "}
          <span className="text-muted">
            {COLORS[sel.color].name} · #{COLORS[sel.color].code}
          </span>
        </legend>
        <div className="-m-1 flex flex-wrap gap-1.5" role="radiogroup" aria-label="Color">
          {p.colors.map((c) => (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={sel.color === c}
              aria-label={`${COLORS[c].name} (#${COLORS[c].code})`}
              title={COLORS[c].name}
              onClick={() => onChange({ ...sel, color: c })}
              className={cn(
                "size-12 rounded-full border p-1 transition-colors duration-200",
                sel.color === c ? "border-black" : "border-transparent hover:border-black/30",
              )}
            >
              <span className="block size-full rounded-full border border-black/10" style={{ background: COLORS[c].hex }} />
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-[15px]">
          <span className="font-medium">Texture:</span> <span className="text-muted">{sel.texture}</span>
        </legend>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Texture">
          {p.textures.map((t) => (
            <button key={t} type="button" role="radio" aria-checked={sel.texture === t} onClick={() => onChange({ ...sel, texture: t })} className={pill(sel.texture === t)}>
              {t}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 flex w-full items-baseline justify-between text-[15px]">
          <span>
            <span className="font-medium">Length:</span> <span className="text-muted">{sel.length} inches</span>
          </span>
          {onGuide && (
            <button type="button" onClick={onGuide} className="text-sm underline underline-offset-4">
              Length guide
            </button>
          )}
        </legend>
        <div className="grid grid-cols-5 gap-2 lg:flex lg:flex-wrap" role="radiogroup" aria-label="Length">
          {p.lengths.map((l) => {
            const out = stockFor(p, { ...sel, length: l }) === 0;
            return (
              <button
                key={l}
                type="button"
                role="radio"
                aria-checked={sel.length === l}
                aria-label={`${l} inches${out ? ", sold out" : ""}`}
                onClick={() => onChange({ ...sel, length: l })}
                className={cn(pill(sel.length === l, out), "!px-0 tabular-nums lg:w-[3.35rem]")}
              >
                {l}″
              </button>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}

/* ── Stock message — only shown where inventory says so ──────────────────── */
export function StockNote({ stock }: { stock: number }) {
  if (stock === 0) return <p className="text-[15px] text-muted">This combination is sold out — try another length.</p>;
  if (stock <= 5)
    return (
      <p className="flex items-center gap-2 text-[15px] font-medium">
        <span className="size-2 rounded-full bg-black" aria-hidden="true" />
        Only {stock} left in this option
      </p>
    );
  return (
    <p className="flex items-center gap-2 text-[15px] text-muted">
      <span className="size-2 rounded-full bg-[#3f8f5b]" aria-hidden="true" />
      In stock, ready to ship
    </p>
  );
}

/* ── Quick add sheet ─────────────────────────────────────────────────────── */
export function QuickAdd() {
  const { quickAdd, setQuickAdd } = useStore();
  const [shown, setShown] = useState<Product | null>(null);
  useEffect(() => {
    if (quickAdd) setShown(quickAdd);
  }, [quickAdd]);
  return (
    <Drawer open={!!quickAdd} onClose={() => setQuickAdd(null)} side="sheet" label="Quick add">
      {shown && <QuickAddBody key={shown.handle} p={shown} onClose={() => setQuickAdd(null)} />}
    </Drawer>
  );
}

function QuickAddBody({ p, onClose }: { p: Product; onClose: () => void }) {
  const { add } = useStore();
  const [sel, setSel] = useState(() => defaultSel(p));
  const { price, compareAt } = priceFor(p, sel);
  const stock = stockFor(p, sel);
  return (
    <div className="grid min-h-0 flex-1 md:grid-cols-2">
      <div className="hidden bg-blush md:block">
        <Img k={imageFor(p, sel)} className="size-full max-h-[80dvh] object-cover" />
      </div>
      <div className="flex min-h-0 flex-col">
        <div className="flex items-start gap-4 border-b border-line p-5">
          <div className="h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-blush md:hidden">
            <Img k={imageFor(p, sel)} alt="" className="size-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl leading-tight md:text-2xl">{p.title}</h2>
            <Price price={price} compareAt={compareAt} className="mt-1.5" />
          </div>
          <button type="button" onClick={onClose} aria-label="Close quick add" className="-mr-2 -mt-2 grid size-11 shrink-0 place-items-center rounded-full hover:bg-blush">
            <X size={20} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <VariantPicker p={p} sel={sel} onChange={setSel} />
          <div className="mt-5">
            <StockNote stock={stock} />
          </div>
        </div>
        <div className="border-t border-line p-5">
          <button type="button" className="btn btn-primary w-full" disabled={stock === 0} onClick={() => add(p, sel, 1)}>
            {stock === 0 ? "Sold out" : `Add to bag · ${money(price)}`}
          </button>
          <Link to={`/products/${p.handle}`} onClick={onClose} className="mt-3 block text-center text-sm underline underline-offset-4">
            View full details
          </Link>
          <p className="sr-only" aria-live="polite">
            Selected: {describeSel(sel)}
          </p>
        </div>
      </div>
    </div>
  );
}

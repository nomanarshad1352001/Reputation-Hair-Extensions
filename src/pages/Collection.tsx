import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import {
  collections,
  COLORS,
  fromPrice,
  products,
  productsIn,
  searchProducts,
  TEXTURES,
  type ColorKey,
  type Product,
} from "@/data/products";
import { settings } from "@/theme/settings";
import { useSeo } from "@/lib/utils";
import { cn } from "@/utils/cn";
import { Crumbs, Drawer, Img } from "@/components/ui";
import { ProductCard, ProductCarousel } from "@/components/ProductCard";
import { NotFound } from "@/pages/Content";

const PRICE = [
  { id: "under-100", label: "Under $100", min: 0, max: 100 },
  { id: "100-200", label: "$100 – $200", min: 100, max: 200 },
  { id: "200-300", label: "$200 – $300", min: 200, max: 300 },
  { id: "300-plus", label: "$300 and up", min: 300, max: Infinity },
];
const SORTS: [string, string][] = [
  ["featured", "Featured"],
  ["best-selling", "Best selling"],
  ["price-asc", "Price: low to high"],
  ["price-desc", "Price: high to low"],
  ["newest", "Newest"],
];
const FILTER_KEYS = ["stock", "sale", "price", "color", "length", "texture"];
const PAGE = 8;

function useFilters() {
  const [sp, setSp] = useSearchParams();
  const list = (k: string) => sp.get(k)?.split(",").filter(Boolean) ?? [];
  const update = (fn: (n: URLSearchParams) => void) => {
    const n = new URLSearchParams(sp);
    fn(n);
    setSp(n, { replace: true });
  };
  const toggle = (k: string, v: string) =>
    update((n) => {
      const cur = new Set(list(k));
      if (cur.has(v)) cur.delete(v);
      else cur.add(v);
      if (cur.size) n.set(k, [...cur].join(","));
      else n.delete(k);
    });
  const setOne = (k: string, v: string) => update((n) => (v ? n.set(k, v) : n.delete(k)));
  const clear = () => update((n) => FILTER_KEYS.forEach((k) => n.delete(k)));
  return { sp, list, toggle, setOne, clear };
}
type Filters = ReturnType<typeof useFilters>;

/* ── Filter panel (sidebar on desktop, drawer on mobile) ─────────────────── */
function FilterPanel({ f, base }: { f: Filters; base: Product[] }) {
  const facets = useMemo(() => {
    const colors = (Object.keys(COLORS) as ColorKey[]).filter((c) => base.some((p) => p.colors.includes(c)));
    const lengths = [...new Set(base.flatMap((p) => p.lengths))].sort((a, b) => a - b);
    const textures = TEXTURES.filter((t) => base.some((p) => p.textures.includes(t)));
    return { colors, lengths, textures };
  }, [base]);

  const check = (k: string, v: string, label: string) => (
    <label key={v} className="flex min-h-11 cursor-pointer items-center gap-3 text-base">
      <input type="checkbox" checked={f.list(k).includes(v)} onChange={() => f.toggle(k, v)} className="size-5 shrink-0 rounded accent-black" />
      {label}
    </label>
  );
  // Note: fieldset padding-top renders *below* the legend, so spacing is done with margins.
  const group = "mb-6 border-b border-line pb-4";
  const legend = "t-eyebrow mb-2";

  return (
    <div>
      <fieldset className={group}>
        <legend className={legend}>Availability</legend>
        {check("stock", "1", "In stock only")}
        {check("sale", "1", "On sale")}
      </fieldset>
      <fieldset className={group}>
        <legend className={legend}>Price</legend>
        {PRICE.map((r) => check("price", r.id, r.label))}
      </fieldset>
      <fieldset className={group}>
        <legend className={legend}>Color</legend>
        <div className="grid grid-cols-1 gap-1">
          {facets.colors.map((c) => {
            const on = f.list("color").includes(c);
            return (
              <button key={c} type="button" aria-pressed={on} onClick={() => f.toggle("color", c)} className="flex min-h-11 items-center gap-3 text-left text-base">
                <span className={cn("grid size-8 shrink-0 place-items-center rounded-full border p-[3px] transition-colors", on ? "border-black" : "border-transparent")}>
                  <span className="size-full rounded-full border border-black/15" style={{ background: COLORS[c].hex }} />
                </span>
                <span className={cn(on && "font-medium")}>{COLORS[c].name}</span>
              </button>
            );
          })}
        </div>
      </fieldset>
      <fieldset className={group}>
        <legend className={legend}>Length</legend>
        <div className="grid grid-cols-5 gap-2 lg:grid-cols-4">
          {facets.lengths.map((l) => {
            const on = f.list("length").includes(String(l));
            return (
              <button
                key={l}
                type="button"
                aria-pressed={on}
                aria-label={`${l} inches`}
                onClick={() => f.toggle("length", String(l))}
                className={cn("min-h-11 rounded-full border text-[15px] tabular-nums transition-colors", on ? "border-black bg-black text-white" : "border-black/25 hover:border-black")}
              >
                {l}″
              </button>
            );
          })}
        </div>
      </fieldset>
      <fieldset className={cn(group, "mb-0 border-b-0")}>
        <legend className={legend}>Texture</legend>
        {facets.textures.map((t) => check("texture", t, t))}
      </fieldset>
    </div>
  );
}

/* ── Listing: toolbar + filters + grid + load more ───────────────────────── */
export function ProductListing({ base }: { base: Product[] }) {
  const f = useFilters();
  const [drawer, setDrawer] = useState(false);
  const [shown, setShown] = useState(PAGE);
  const key = f.sp.toString();
  useEffect(() => setShown(PAGE), [key]);

  const sort = f.sp.get("sort") ?? "featured";
  const filtered = useMemo(() => {
    const stock = f.list("stock").length > 0;
    const sale = f.list("sale").length > 0;
    const price = PRICE.filter((r) => f.list("price").includes(r.id));
    const color = f.list("color");
    const length = f.list("length");
    const texture = f.list("texture");
    const out = base.filter((p) => {
      const from = fromPrice(p).price;
      if (stock && p.soldOut) return false;
      if (sale && !p.discount) return false;
      if (price.length && !price.some((r) => from >= r.min && from < r.max)) return false;
      if (color.length && !p.colors.some((c) => color.includes(c))) return false;
      if (length.length && !p.lengths.some((l) => length.includes(String(l)))) return false;
      if (texture.length && !p.textures.some((t) => texture.includes(t))) return false;
      return true;
    });
    const by: Record<string, (a: Product, b: Product) => number> = {
      featured: (a, b) => a.id - b.id,
      "best-selling": (a, b) => a.salesRank - b.salesRank,
      "price-asc": (a, b) => fromPrice(a).price - fromPrice(b).price,
      "price-desc": (a, b) => fromPrice(b).price - fromPrice(a).price,
      newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
    };
    return [...out].sort(by[sort] ?? by.featured);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base, key]);

  const chips: { k: string; v: string; label: string }[] = [
    ...f.list("stock").map((v) => ({ k: "stock", v, label: "In stock" })),
    ...f.list("sale").map((v) => ({ k: "sale", v, label: "On sale" })),
    ...f.list("price").map((v) => ({ k: "price", v, label: PRICE.find((r) => r.id === v)?.label ?? v })),
    ...f.list("color").map((v) => ({ k: "color", v, label: COLORS[v as ColorKey]?.name ?? v })),
    ...f.list("length").map((v) => ({ k: "length", v, label: `${v}″` })),
    ...f.list("texture").map((v) => ({ k: "texture", v, label: v })),
  ];

  const sortSelect = (id: string) => (
    <div className="flex items-center gap-2">
      <label htmlFor={id} className="hidden text-[15px] text-muted sm:block">
        Sort by
      </label>
      <select
        id={id}
        aria-label="Sort products"
        value={sort}
        onChange={(e) => f.setOne("sort", e.target.value === "featured" ? "" : e.target.value)}
        className="h-11 rounded-full border border-black bg-white pl-4 pr-9 text-[15px]"
      >
        {SORTS.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="wrap pb-16 md:pb-24">
      {/* Toolbar */}
      <div className="sticky top-14 z-30 -mx-5 flex items-center justify-between gap-3 border-b border-line bg-white/95 px-5 py-3 backdrop-blur md:-mx-10 md:px-10 lg:static lg:mx-0 lg:border-0 lg:px-0 lg:py-6">
        <button type="button" onClick={() => setDrawer(true)} className="btn btn-outline btn-sm lg:hidden">
          <SlidersHorizontal size={16} aria-hidden="true" />
          Filter{chips.length > 0 && ` (${chips.length})`}
        </button>
        <p className="hidden text-[15px] text-muted lg:block" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "product" : "products"}
        </p>
        {sortSelect("sort")}
      </div>

      <div className="mt-5 grid gap-10 lg:mt-0 lg:grid-cols-[15rem_1fr]">
        <aside className="hidden lg:block" aria-label="Filters">
          <div className="sticky top-28 max-h-[calc(100dvh-8rem)] overflow-y-auto pr-3">
            <FilterPanel f={f} base={base} />
          </div>
        </aside>

        <div>
          {chips.length > 0 && (
            <ul className="mb-5 flex flex-wrap items-center gap-2" aria-label="Active filters">
              {chips.map((c) => (
                <li key={c.k + c.v}>
                  <button type="button" onClick={() => f.toggle(c.k, c.v)} aria-label={`Remove filter ${c.label}`} className="flex min-h-10 items-center gap-1.5 rounded-full bg-blush pl-4 pr-3 text-[15px] transition-colors hover:bg-blush-deep">
                    {c.label}
                    <X size={14} aria-hidden="true" />
                  </button>
                </li>
              ))}
              <li>
                <button type="button" onClick={f.clear} className="px-2 text-[15px] underline underline-offset-4">
                  Clear all
                </button>
              </li>
            </ul>
          )}

          <p className="mb-4 text-[15px] text-muted lg:hidden" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? "product" : "products"}
          </p>

          {filtered.length === 0 ? (
            <div className="rounded-3xl bg-blush-soft px-6 py-16 text-center">
              <p className="font-display text-3xl">No matches — yet.</p>
              <p className="mx-auto mt-3 max-w-sm text-muted">Try removing a filter or two. New lengths and shades are added regularly.</p>
              <button type="button" onClick={f.clear} className="btn btn-primary mt-6">
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <ul className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-6 md:gap-y-12 xl:grid-cols-4">
                {filtered.slice(0, shown).map((p) => (
                  <li key={p.handle} className="animate-fade-up">
                    <ProductCard p={p} />
                  </li>
                ))}
              </ul>
              <div className="mt-12 text-center">
                <p className="text-[15px] text-muted">
                  Showing {Math.min(shown, filtered.length)} of {filtered.length}
                </p>
                <div className="mx-auto mt-3 h-0.5 w-40 overflow-hidden rounded bg-line" aria-hidden="true">
                  <div className="h-full bg-black transition-[width] duration-500" style={{ width: `${(Math.min(shown, filtered.length) / filtered.length) * 100}%` }} />
                </div>
                {shown < filtered.length && (
                  <button type="button" className="btn btn-outline mt-6" onClick={() => setShown((s) => s + PAGE)}>
                    Load more
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <Drawer open={drawer} onClose={() => setDrawer(false)} side="left" label="Filters" className="lg:hidden">
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-line px-5">
          <span className="t-eyebrow">Filter</span>
          <button type="button" onClick={() => setDrawer(false)} aria-label="Close filters" className="-mr-2 grid size-11 place-items-center rounded-full hover:bg-blush">
            <X size={20} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          <FilterPanel f={f} base={base} />
        </div>
        <div className="flex shrink-0 gap-3 border-t border-line p-4">
          <button type="button" className="btn btn-outline btn-sm flex-1" onClick={f.clear} disabled={chips.length === 0}>
            Clear
          </button>
          <button type="button" className="btn btn-primary btn-sm flex-[2]" onClick={() => setDrawer(false)}>
            Show {filtered.length} {filtered.length === 1 ? "result" : "results"}
          </button>
        </div>
      </Drawer>
    </div>
  );
}

/* ── Collection template ─────────────────────────────────────────────────── */
export default function CollectionPage() {
  const { handle = "all" } = useParams();
  const col = collections[handle];
  useSeo(col ? col.title : "Collection not found", col?.seoDescription);
  const base = useMemo(() => productsIn(handle), [handle]);
  if (!col) return <NotFound />;

  return (
    <>
      <section className="bg-blush">
        <div className="wrap flex items-stretch gap-5 md:gap-10">
          <div className="flex-1 py-7 md:py-14">
            <Crumbs items={[{ label: "Home", to: "/" }, { label: col.title }]} />
            <h1 className="t-h1 mt-4">{col.title}</h1>
            <p className="t-lead mt-3 max-w-md">{col.intro}</p>
          </div>
          <div className="relative my-5 w-28 shrink-0 overflow-hidden rounded-2xl sm:w-40 md:my-0 md:w-[44%] md:rounded-none">
            <Img k={col.image} eager className="absolute inset-0 size-full object-cover object-[50%_8%]" />
          </div>
        </div>
      </section>
      <ProductListing key={handle} base={base} />
    </>
  );
}

/* ── Search template ─────────────────────────────────────────────────────── */
export function SearchPage() {
  const [sp, setSp] = useSearchParams();
  const q = sp.get("q") ?? "";
  const [val, setVal] = useState(q);
  useEffect(() => setVal(q), [q]);
  useSeo(q ? `Search: ${q}` : "Search");
  const results = useMemo(() => searchProducts(q), [q]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSp(val.trim() ? { q: val.trim() } : {});
  };

  return (
    <>
      <section className="bg-blush">
        <div className="wrap max-w-3xl py-10 text-center md:py-16">
          <h1 className="t-h1">{q ? <>Results for “{q}”</> : "Search"}</h1>
          <form role="search" onSubmit={submit} className="relative mx-auto mt-6 max-w-xl">
            <label htmlFor="search-page" className="sr-only">
              Search products
            </label>
            <input id="search-page" type="search" value={val} onChange={(e) => setVal(e.target.value)} placeholder="Search wefts, wigs, closures…" className="field pr-14" />
            <button type="submit" aria-label="Submit search" className="absolute right-1.5 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black text-white">
              <Search size={18} aria-hidden="true" />
            </button>
          </form>
        </div>
      </section>

      {results.length > 0 ? (
        <ProductListing key={q} base={results} />
      ) : (
        <div className="wrap section">
          <div className="mx-auto max-w-xl text-center">
            <p className="font-display text-3xl">{q ? "We couldn’t find a match." : "What are you looking for?"}</p>
            <p className="mt-3 text-muted">Try one of these popular searches.</p>
            <ul className="mt-5 flex flex-wrap justify-center gap-2">
              {settings.search.popular.map((s) => (
                <li key={s}>
                  <Link to={`/search?q=${encodeURIComponent(s)}`} className="inline-flex min-h-11 items-center rounded-full border border-black px-5 transition-colors hover:bg-black hover:text-white">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-16">
            <h2 className="t-h3 mb-6">Best sellers</h2>
            <ProductCarousel items={products.filter((p) => p.bestSeller)} label="Best sellers" />
          </div>
        </div>
      )}
    </>
  );
}

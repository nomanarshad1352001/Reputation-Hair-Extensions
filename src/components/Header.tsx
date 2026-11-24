import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { settings } from "@/theme/settings";
import { collections, fromPrice, products, searchProducts, TYPE_LABEL } from "@/data/products";
import { posts } from "@/data/content";
import { useStore } from "@/lib/store";
import { money } from "@/lib/utils";
import { cn } from "@/utils/cn";
import { Drawer, Img, SocialIcon } from "@/components/ui";

/* ── Logo (text wordmark — swap for the client's logo file in theme settings) ─ */
export function Logo({ compact, className }: { compact?: boolean; className?: string }) {
  return (
    <Link to="/" aria-label="Reputation Hair Extensions — home" className={cn("inline-flex flex-col items-center leading-none", className)}>
      <span
        className={cn(
          "pl-[0.22em] font-display font-medium tracking-[0.22em] transition-[font-size] duration-300",
          compact ? "text-[19px] lg:text-[22px]" : "text-[22px] lg:text-[26px]",
        )}
      >
        REPUTATION
      </span>
      <span className="mt-1.5 pl-[0.5em] text-[8px] font-medium uppercase tracking-[0.5em] lg:text-[9px]">Hair Extensions</span>
    </Link>
  );
}

/* ── Announcement bar: rotating + dismissible ────────────────────────────── */
export function AnnouncementBar() {
  const cfg = settings.announcement;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hidden, setHidden] = useState(() => {
    try {
      return sessionStorage.getItem("rep_announce") === "off";
    } catch {
      return false;
    }
  });
  const n = cfg.messages.length;

  useEffect(() => {
    if (paused || hidden || n < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % n), cfg.rotateMs);
    return () => clearInterval(t);
  }, [paused, hidden, n, cfg.rotateMs]);

  if (!cfg.visible || hidden) return null;
  const m = cfg.messages[i];
  const arrow = "grid size-9 shrink-0 place-items-center rounded-full opacity-80 transition-opacity hover:opacity-100";

  return (
    <div
      className="on-dark bg-black text-white"
      role="region"
      aria-label="Announcements"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="wrap flex min-h-10 items-center gap-1 !px-2 md:!px-6">
        <button type="button" className={arrow} aria-label="Previous announcement" onClick={() => setI((v) => (v - 1 + n) % n)}>
          <ChevronLeft size={16} aria-hidden="true" />
        </button>
        <p key={i} aria-live="polite" className="flex-1 animate-fade py-2 text-center text-[13px] leading-snug tracking-[0.06em] md:text-sm">
          <Link to={m.link} className="underline-offset-4 hover:underline">
            {m.text}
          </Link>
        </p>
        <button type="button" className={arrow} aria-label="Next announcement" onClick={() => setI((v) => (v + 1) % n)}>
          <ChevronRight size={16} aria-hidden="true" />
        </button>
        <button
          type="button"
          className={arrow}
          aria-label="Dismiss announcements"
          onClick={() => {
            setHidden(true);
            try {
              sessionStorage.setItem("rep_announce", "off");
            } catch {
              /* ignore */
            }
          }}
        >
          <X size={15} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

/* ── Header ──────────────────────────────────────────────────────────────── */
export function Header() {
  const { count, setCartOpen } = useStore();
  const loc = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setMenu(null);
    setMobileOpen(false);
    setSearchOpen(false);
  }, [loc.pathname, loc.search]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const active = menu !== null ? settings.nav[menu] : null;
  const icon = "relative grid size-11 place-items-center rounded-full transition-colors hover:bg-blush";

  return (
    <>
      <header
        className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur-md"
        onMouseLeave={() => setMenu(null)}
        onKeyDown={(e) => e.key === "Escape" && setMenu(null)}
      >
        <div
          className={cn(
            "wrap grid grid-cols-[1fr_auto_1fr] items-center gap-3 transition-[height] duration-300 ease-luxe lg:grid-cols-[auto_1fr_auto] lg:gap-8",
            scrolled ? "h-14 lg:h-[4.25rem]" : "h-[4.25rem] lg:h-[5.25rem]",
          )}
        >
          <div className="-ml-2 flex lg:hidden">
            <button type="button" className={icon} aria-label="Open menu" aria-expanded={mobileOpen} onClick={() => setMobileOpen(true)}>
              <Menu size={22} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>

          <Logo compact={scrolled} />

          <nav aria-label="Primary" className="hidden justify-center lg:flex">
            <ul className="flex items-center gap-6 xl:gap-9">
              {settings.nav.map((item, i) => (
                <li key={item.label} onMouseEnter={() => setMenu(item.columns ? i : null)}>
                  <Link
                    to={item.to}
                    onFocus={() => setMenu(item.columns ? i : null)}
                    aria-haspopup={item.columns ? "true" : undefined}
                    aria-expanded={item.columns ? menu === i : undefined}
                    className={cn(
                      "link-grow whitespace-nowrap py-2 text-[13px] font-medium uppercase tracking-[0.16em]",
                      menu === i && "!bg-[length:100%_1px]",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="-mr-2 flex items-center justify-end">
            <button type="button" className={icon} aria-label="Search" onClick={() => setSearchOpen(true)}>
              <Search size={21} strokeWidth={1.5} aria-hidden="true" />
            </button>
            <Link to="/account" className={cn(icon, "hidden sm:grid")} aria-label="Account">
              <User size={21} strokeWidth={1.5} aria-hidden="true" />
            </Link>
            <button type="button" className={icon} aria-label={`Open bag, ${count} ${count === 1 ? "item" : "items"}`} onClick={() => setCartOpen(true)}>
              <ShoppingBag size={21} strokeWidth={1.5} aria-hidden="true" />
              {count > 0 && (
                <span key={count} className="absolute right-0.5 top-0.5 grid min-w-[18px] animate-fade place-items-center rounded-full bg-black px-1 text-[10px] font-medium leading-[18px] text-white">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mega menu */}
        {active?.columns && (
          <div key={active.label} className="absolute inset-x-0 top-full hidden animate-fade border-b border-line bg-white shadow-[0_30px_40px_-30px_rgba(0,0,0,0.25)] lg:block">
            <div className="wrap grid grid-cols-12 gap-8 py-10">
              <div className="col-span-7 grid auto-cols-fr grid-flow-col gap-8">
                {active.columns.map((col) => (
                  <div key={col.title}>
                    <p className="t-eyebrow mb-4 text-muted">{col.title}</p>
                    <ul className="space-y-2.5">
                      {col.links.map((l) => (
                        <li key={l.label}>
                          <Link to={l.to} className="link-grow text-base">
                            {l.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="col-span-5 grid grid-cols-2 gap-5">
                {active.promos?.map((promo) => (
                  <Link key={promo.title} to={promo.to} className="group block">
                    <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-blush">
                      <Img k={promo.image} className="size-full object-cover transition-transform duration-700 ease-luxe group-hover:scale-105" />
                    </div>
                    <p className="mt-3 font-medium">{promo.title}</p>
                    <p className="text-sm text-muted">{promo.caption}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

/* ── Mobile drawer: two levels with back navigation ──────────────────────── */
function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [sub, setSub] = useState<number | null>(null);
  const last = useRef(0);
  if (sub !== null) last.current = sub;
  const item = settings.nav[last.current];

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => setSub(null), 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  const row = "flex min-h-14 w-full items-center justify-between border-b border-line px-5 text-left text-[17px]";

  return (
    <Drawer open={open} onClose={onClose} side="left" label="Menu">
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-line px-5">
        <span className="t-eyebrow">Menu</span>
        <button type="button" onClick={onClose} aria-label="Close menu" className="-mr-2 grid size-11 place-items-center rounded-full hover:bg-blush">
          <X size={20} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>
      <div className="relative flex-1 overflow-hidden">
        {/* Level 1 */}
        <div
          inert={sub !== null}
          className={cn("absolute inset-0 overflow-y-auto transition-transform duration-300 ease-luxe", sub !== null && "-translate-x-full")}
        >
          <ul>
            {settings.nav.map((n, i) => (
              <li key={n.label}>
                {n.columns ? (
                  <button type="button" className={row} onClick={() => setSub(i)}>
                    <span className="font-display text-xl">{n.label}</span>
                    <ChevronRight size={18} strokeWidth={1.5} aria-hidden="true" />
                  </button>
                ) : (
                  <Link to={n.to} className={row}>
                    <span className="font-display text-xl">{n.label}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <ul className="px-5 py-6 text-base">
            {[
              { label: "Hair Care Guide", to: "/pages/hair-care-guide" },
              { label: "Track Order", to: "/pages/track-order" },
              { label: "FAQ", to: "/pages/faq" },
              { label: "Contact", to: "/pages/contact" },
              { label: "Account", to: "/account" },
            ].map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="block py-2.5 text-muted">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex gap-2 px-4 pb-8">
            {settings.brand.social.map((s) => (
              <a key={s.name} href={s.url} target="_blank" rel="noreferrer" aria-label={s.name} className="grid size-11 place-items-center rounded-full hover:bg-blush">
                <SocialIcon name={s.name} />
              </a>
            ))}
          </div>
        </div>

        {/* Level 2 */}
        <div
          inert={sub === null}
          className={cn("absolute inset-0 overflow-y-auto bg-white transition-transform duration-300 ease-luxe", sub === null && "translate-x-full")}
        >
          <button type="button" onClick={() => setSub(null)} className="flex min-h-14 w-full items-center gap-3 border-b border-line bg-blush-soft px-5 text-left">
            <ArrowLeft size={18} strokeWidth={1.5} aria-hidden="true" />
            <span className="t-eyebrow">Back</span>
            <span className="ml-auto font-display text-lg">{item.label}</span>
          </button>
          <div className="px-5 py-6">
            <Link to={item.to} className="btn btn-primary w-full">
              Shop all {item.label.toLowerCase()}
            </Link>
            {item.columns?.map((col) => (
              <div key={col.title} className="mt-7">
                <p className="t-eyebrow mb-2 text-muted">{col.title}</p>
                <ul>
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link to={l.to} className="flex min-h-12 items-center border-b border-line text-[17px]">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="mt-7 grid grid-cols-2 gap-3">
              {item.promos?.map((promo) => (
                <Link key={promo.title} to={promo.to} className="block">
                  <div className="aspect-[4/5] overflow-hidden rounded-xl bg-blush">
                    <Img k={promo.image} className="size-full object-cover" />
                  </div>
                  <p className="mt-2 text-sm font-medium leading-tight">{promo.title}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
}

/* ── Predictive search ───────────────────────────────────────────────────── */
function SearchPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    setQ("");
    const t = setTimeout(() => input.current?.focus(), 80);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const term = q.trim();
  const results = useMemo(() => (term.length > 1 ? searchProducts(term) : []), [term]);
  const lower = term.toLowerCase();
  const cols = term.length > 1 ? Object.values(collections).filter((c) => c.title.toLowerCase().includes(lower)) : [];
  const articles = term.length > 1 ? posts.filter((p) => (p.title + p.tag).toLowerCase().includes(lower)).slice(0, 2) : [];
  const trending = products.filter((p) => p.bestSeller).slice(0, 4);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (term) navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <div className={cn("fixed inset-0 z-50", !open && "pointer-events-none")} inert={!open}>
      <div onClick={onClose} className={cn("absolute inset-0 bg-black/45 transition-opacity duration-300", open ? "opacity-100" : "opacity-0")} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        className={cn(
          "absolute inset-x-0 top-0 max-h-dvh overflow-y-auto bg-white shadow-2xl transition-[translate,opacity] duration-300 ease-luxe",
          open ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0",
        )}
      >
        <div className="wrap py-4 md:py-8">
          <form role="search" onSubmit={submit} className="flex items-center gap-2 border-b border-black pb-2">
            <Search size={20} strokeWidth={1.5} className="shrink-0" aria-hidden="true" />
            <label htmlFor="predictive-search" className="sr-only">
              Search products
            </label>
            <input
              ref={input}
              id="predictive-search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search wefts, wigs, closures…"
              autoComplete="off"
              className="h-12 min-w-0 flex-1 bg-transparent font-display text-xl outline-none placeholder:text-muted md:text-3xl"
            />
            <button type="button" onClick={onClose} aria-label="Close search" className="-mr-2 grid size-11 shrink-0 place-items-center rounded-full hover:bg-blush">
              <X size={20} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </form>

          <div aria-live="polite" className="pt-6 pb-4">
            {term.length < 2 ? (
              <div className="grid gap-8 md:grid-cols-[14rem_1fr]">
                <div>
                  <p className="t-eyebrow mb-3 text-muted">Popular searches</p>
                  <ul className="flex flex-wrap gap-2 md:flex-col md:gap-1">
                    {settings.search.popular.map((s) => (
                      <li key={s}>
                        <button type="button" onClick={() => setQ(s)} className="rounded-full border border-line px-4 py-2 text-[15px] transition-colors hover:border-black md:border-0 md:px-0 md:py-1 md:hover:underline">
                          {s}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="t-eyebrow mb-3 text-muted">Trending now</p>
                  <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {trending.map((p) => (
                      <li key={p.handle}>
                        <Link to={`/products/${p.handle}`} className="group block">
                          <div className="aspect-[4/5] overflow-hidden rounded-xl bg-blush">
                            <Img k={p.images[0]} alt="" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
                          </div>
                          <p className="mt-2 text-[15px] font-medium leading-snug">{p.title}</p>
                          <p className="text-sm text-muted">From {money(fromPrice(p).price)}</p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : results.length === 0 && cols.length === 0 ? (
              <div className="py-6">
                <p className="font-display text-2xl">No results for “{term}”</p>
                <p className="mt-2 text-muted">Check the spelling or try a broader term like “weft” or “wig”.</p>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-[1fr_16rem]">
                <div>
                  <p className="t-eyebrow mb-2 text-muted">Products</p>
                  <ul className="divide-y divide-line">
                    {results.slice(0, 5).map((p) => {
                      const { price, compareAt } = fromPrice(p);
                      return (
                        <li key={p.handle}>
                          <Link to={`/products/${p.handle}`} className="group flex items-center gap-4 py-3">
                            <div className="h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-blush">
                              <Img k={p.images[0]} alt="" className="size-full object-cover" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium leading-snug group-hover:underline">{p.title}</p>
                              <p className="text-sm text-muted">{TYPE_LABEL[p.type]}</p>
                            </div>
                            <p className="shrink-0 text-right text-[15px]">
                              From {money(price)}
                              {compareAt > price && <s className="ml-1.5 text-muted">{money(compareAt)}</s>}
                            </p>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                  {results.length > 0 && (
                    <Link to={`/search?q=${encodeURIComponent(term)}`} className="btn btn-primary mt-5 w-full sm:w-auto">
                      View all {results.length} {results.length === 1 ? "result" : "results"}
                      <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                  )}
                </div>
                <div className="space-y-6">
                  {cols.length > 0 && (
                    <div>
                      <p className="t-eyebrow mb-2 text-muted">Collections</p>
                      <ul className="space-y-2">
                        {cols.map((c) => (
                          <li key={c.handle}>
                            <Link to={`/collections/${c.handle}`} className="link-grow">
                              {c.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {articles.length > 0 && (
                    <div>
                      <p className="t-eyebrow mb-2 text-muted">From the Journal</p>
                      <ul className="space-y-2">
                        {articles.map((a) => (
                          <li key={a.slug}>
                            <Link to={`/blogs/journal/${a.slug}`} className="link-grow">
                              {a.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

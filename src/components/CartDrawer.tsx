import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Plus, ShoppingBag, Trash2, Truck, X } from "lucide-react";
import { settings } from "@/theme/settings";
import { COLORS, fromPrice, products, type Product } from "@/data/products";
import { useStore, type CartLine } from "@/lib/store";
import { load, money, save } from "@/lib/utils";
import { cn } from "@/utils/cn";
import { Drawer, EmailForm, Img, Qty } from "@/components/ui";

/* ── Free-shipping progress ──────────────────────────────────────────────── */
export function ShippingBar({ subtotal }: { subtotal: number }) {
  const goal = settings.brand.freeShippingThreshold;
  const left = Math.max(0, goal - subtotal);
  const pct = Math.min(100, (subtotal / goal) * 100);
  return (
    <div>
      <p className="flex items-center gap-2 text-[15px]">
        <Truck size={18} strokeWidth={1.5} aria-hidden="true" />
        {left > 0 ? (
          <span>
            You’re <strong className="font-medium">{money(left)}</strong> away from free U.S. shipping
          </span>
        ) : (
          <span>
            You’ve unlocked <strong className="font-medium">free U.S. shipping</strong>
          </span>
        )}
      </p>
      <div
        role="progressbar"
        aria-label="Progress toward free shipping"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
        className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-blush"
      >
        <div className="h-full rounded-full bg-black transition-[width] duration-700 ease-luxe" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/* ── Line item ───────────────────────────────────────────────────────────── */
export function LineItem({ line, onNavigate }: { line: CartLine; onNavigate?: () => void }) {
  const { setQty, remove } = useStore();
  const { product: p, sel } = line;
  return (
    <li className="flex gap-4 py-5">
      <Link to={`/products/${p.handle}`} onClick={onNavigate} className="h-28 w-[5.5rem] shrink-0 overflow-hidden rounded-xl bg-blush" tabIndex={-1}>
        <Img k={line.image} alt="" className="size-full object-cover" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <Link to={`/products/${p.handle}`} onClick={onNavigate} className="font-medium leading-snug hover:underline">
            {p.title}
          </Link>
          <p className="shrink-0 text-right">
            <span className="font-medium">{money(line.price * line.qty)}</span>
            {line.compareAt > line.price && <s className="block text-sm text-muted">{money(line.compareAt * line.qty)}</s>}
          </p>
        </div>
        <p className="mt-0.5 text-sm text-muted">
          {sel.length}″ · {sel.texture} · {COLORS[sel.color].name}
        </p>
        {line.stock <= 5 && <p className="mt-0.5 text-sm">Only {line.stock} left</p>}
        <div className="mt-auto flex items-center justify-between pt-2">
          <Qty small value={line.qty} max={line.stock} onChange={(n) => setQty(line.key, n)} label={`Quantity for ${p.title}`} />
          <button
            type="button"
            onClick={() => remove(line.key)}
            aria-label={`Remove ${p.title} from bag`}
            className="grid size-10 place-items-center rounded-full text-muted transition-colors hover:bg-blush hover:text-black"
          >
            <Trash2 size={17} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      </div>
    </li>
  );
}

/** Complementary products: wefts ↔ closures/frontals, else best sellers. */
export function crossSell(lines: CartLine[], limit = 4): Product[] {
  const inCart = new Set(lines.map((l) => l.product.handle));
  const types = new Set(lines.map((l) => l.product.type));
  const wants: string[] = [];
  if (types.has("weft-extensions") && !types.has("closures") && !types.has("frontals")) wants.push("closures", "frontals");
  if ((types.has("closures") || types.has("frontals")) && !types.has("weft-extensions")) wants.push("weft-extensions");
  const pool = products.filter((p) => !inCart.has(p.handle) && !p.soldOut);
  const first = pool.filter((p) => wants.includes(p.type));
  const rest = pool.filter((p) => !wants.includes(p.type) && p.bestSeller);
  return [...first, ...rest].slice(0, limit);
}

export function UpsellRow({ p }: { p: Product }) {
  const { setQuickAdd } = useStore();
  const { price, compareAt } = fromPrice(p);
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-blush-soft p-3">
      <div className="h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-blush">
        <Img k={p.images[0]} alt="" className="size-full object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-medium">{p.title}</p>
        <p className="text-sm text-muted">
          From {money(price)} {compareAt > price && <s>{money(compareAt)}</s>}
        </p>
      </div>
      <button type="button" onClick={() => setQuickAdd(p)} aria-label={`Add ${p.title}`} className="grid size-11 shrink-0 place-items-center rounded-full border border-black transition-colors hover:bg-black hover:text-white">
        <Plus size={18} strokeWidth={1.5} aria-hidden="true" />
      </button>
    </div>
  );
}

/* ── Cart drawer ─────────────────────────────────────────────────────────── */
export function CartDrawer() {
  const { lines, count, subtotal, savings, cartOpen, setCartOpen } = useStore();
  const close = () => setCartOpen(false);
  const loc = useLocation();
  useEffect(() => setCartOpen(false), [loc.pathname, setCartOpen]);
  const suggestions = crossSell(lines, 2);

  return (
    <Drawer open={cartOpen} onClose={close} side="right" label="Shopping bag">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5">
        <h2 className="text-2xl">
          Your bag <span className="font-sans text-base text-muted">({count})</span>
        </h2>
        <button type="button" onClick={close} aria-label="Close bag" className="-mr-2 grid size-11 place-items-center rounded-full hover:bg-blush">
          <X size={20} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>

      {lines.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-blush">
            <ShoppingBag size={24} strokeWidth={1.5} aria-hidden="true" />
          </span>
          <p className="mt-5 font-display text-2xl">Your bag is empty</p>
          <p className="mt-2 text-muted">Good hair is a few taps away.</p>
          <div className="mt-6 grid w-full gap-2.5">
            {settings.home.categories.tiles.map((t) => (
              <Link key={t.title} to={t.to} className="btn btn-outline btn-sm w-full">
                {t.title}
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="min-h-0 flex-1 overflow-y-auto px-5">
            <div className="border-b border-line py-4">
              <ShippingBar subtotal={subtotal} />
            </div>
            <ul className="divide-y divide-line">
              {lines.map((l) => (
                <LineItem key={l.key} line={l} onNavigate={close} />
              ))}
            </ul>
            {suggestions.length > 0 && (
              <div className="border-t border-line py-5">
                <p className="t-eyebrow mb-3 text-muted">Complete your install</p>
                <div className="space-y-2.5">
                  {suggestions.map((p) => (
                    <UpsellRow key={p.handle} p={p} />
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="shrink-0 border-t border-line p-5">
            {savings > 0 && (
              <p className="mb-1 flex justify-between text-[15px] text-muted">
                <span>You’re saving</span>
                <span>−{money(savings)}</span>
              </p>
            )}
            <p className="flex justify-between text-lg font-medium">
              <span>Subtotal</span>
              <span>{money(subtotal)}</span>
            </p>
            <p className="mt-1 text-sm text-muted">Shipping and taxes calculated at checkout.</p>
            <Link to="/checkout" className="btn btn-primary mt-4 w-full">
              Checkout
            </Link>
            <Link to="/cart" className="mt-3 block text-center text-sm underline underline-offset-4">
              View bag
            </Link>
          </div>
        </>
      )}
    </Drawer>
  );
}

/* ── Newsletter popup: non-blocking card, once per visitor ───────────────── */
export function NewsletterPopup() {
  const cfg = settings.popup;
  const [open, setOpen] = useState(false);
  const { cartOpen, quickAdd } = useStore();

  useEffect(() => {
    if (!cfg.visible || load("rep_popup", false)) return;
    const t = setTimeout(() => setOpen(true), cfg.delayMs);
    return () => clearTimeout(t);
  }, [cfg.visible, cfg.delayMs]);

  const dismiss = () => {
    setOpen(false);
    save("rep_popup", true);
  };

  // Never interrupt purchase intent: stay hidden on product, cart and checkout pages.
  const { pathname } = useLocation();
  const blocked = /^\/(products|cart|checkout)/.test(pathname);
  const visible = open && !blocked && !cartOpen && !quickAdd;
  return (
    <aside
      role="dialog"
      aria-label="Newsletter sign-up"
      inert={!visible}
      className={cn(
        "fixed inset-x-3 bottom-3 z-[45] overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_-10px_rgba(0,0,0,0.35)] transition-[translate,opacity] duration-500 ease-luxe sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-[25rem]",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-8 opacity-0",
      )}
    >
      <div className="relative bg-blush px-6 pb-5 pt-6">
        <button type="button" onClick={dismiss} aria-label="Close sign-up" className="absolute right-2 top-2 grid size-11 place-items-center rounded-full hover:bg-white/60">
          <X size={18} strokeWidth={1.5} aria-hidden="true" />
        </button>
        <p className="t-eyebrow">Welcome</p>
        <p className="mt-2 pr-8 font-display text-[1.7rem] leading-tight">{cfg.heading}</p>
      </div>
      <div className="px-6 pb-6 pt-5">
        <p className="mb-4 text-[15px] text-muted">{cfg.body}</p>
        <EmailForm source="popup" cta={cfg.cta} onDone={() => save("rep_popup", true)} />
        <button type="button" onClick={dismiss} className="mt-3 text-sm text-muted underline underline-offset-4">
          No thanks
        </button>
      </div>
    </aside>
  );
}

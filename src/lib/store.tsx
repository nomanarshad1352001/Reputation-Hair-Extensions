import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  getProduct,
  imageFor,
  priceFor,
  stockFor,
  variantKey,
  type Product,
  type Selection,
} from "@/data/products";
import type { ImgKey } from "@/data/images";
import { load, save } from "@/lib/utils";

interface StoredItem {
  handle: string;
  sel: Selection;
  qty: number;
}

export interface CartLine {
  key: string;
  product: Product;
  sel: Selection;
  qty: number;
  price: number;
  compareAt: number;
  stock: number;
  image: ImgKey;
}

interface Store {
  lines: CartLine[];
  count: number;
  subtotal: number;
  savings: number;
  add: (p: Product, sel: Selection, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  quickAdd: Product | null;
  setQuickAdd: (p: Product | null) => void;
  recent: string[];
  pushRecent: (handle: string) => void;
}

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<StoredItem[]>(() => load("rep_cart", []));
  const [cartOpen, setCartOpen] = useState(false);
  const [quickAdd, setQuickAdd] = useState<Product | null>(null);
  const [recent, setRecent] = useState<string[]>(() => load("rep_recent", []));

  useEffect(() => save("rep_cart", items), [items]);
  useEffect(() => save("rep_recent", recent), [recent]);

  const lines = useMemo<CartLine[]>(
    () =>
      items.flatMap((it) => {
        const product = getProduct(it.handle);
        if (!product) return [];
        const { price, compareAt } = priceFor(product, it.sel);
        return [
          {
            key: variantKey(product, it.sel),
            product,
            sel: it.sel,
            qty: it.qty,
            price,
            compareAt,
            stock: stockFor(product, it.sel),
            image: imageFor(product, it.sel),
          },
        ];
      }),
    [items],
  );

  const add = useCallback((p: Product, sel: Selection, qty = 1) => {
    const max = stockFor(p, sel);
    if (max <= 0) return;
    setItems((prev) => {
      const key = variantKey(p, sel);
      const found = prev.find((it) => `${it.handle}|${it.sel.length}|${it.sel.texture}|${it.sel.color}` === key);
      if (found) {
        return prev.map((it) => (it === found ? { ...it, qty: Math.min(max, it.qty + qty) } : it));
      }
      return [...prev, { handle: p.handle, sel, qty: Math.min(max, qty) }];
    });
    setQuickAdd(null);
    setCartOpen(true);
  }, []);

  const keyOf = (it: StoredItem) => `${it.handle}|${it.sel.length}|${it.sel.texture}|${it.sel.color}`;

  const setQty = useCallback((key: string, qty: number) => {
    setItems((prev) =>
      prev.flatMap((it) => {
        if (keyOf(it) !== key) return [it];
        const p = getProduct(it.handle);
        const max = p ? stockFor(p, it.sel) : 1;
        const next = Math.max(0, Math.min(max, qty));
        return next === 0 ? [] : [{ ...it, qty: next }];
      }),
    );
  }, []);

  const remove = useCallback((key: string) => setItems((prev) => prev.filter((it) => keyOf(it) !== key)), []);

  const pushRecent = useCallback(
    (handle: string) => setRecent((prev) => [handle, ...prev.filter((h) => h !== handle)].slice(0, 8)),
    [],
  );

  const value = useMemo<Store>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = lines.reduce((n, l) => n + l.qty * l.price, 0);
    const savings = lines.reduce((n, l) => n + l.qty * (l.compareAt - l.price), 0);
    return { lines, count, subtotal, savings, add, setQty, remove, cartOpen, setCartOpen, quickAdd, setQuickAdd, recent, pushRecent };
  }, [lines, add, setQty, remove, cartOpen, quickAdd, recent, pushRecent]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

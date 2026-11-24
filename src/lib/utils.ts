import { useEffect } from "react";

export const money = (n: number) => `$${Number.isInteger(n) ? n : n.toFixed(2)}`;

export const formatDate = (iso: string) =>
  new Date(iso + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — fail silently */
  }
}

const SITE = "Reputation Hair Extensions";

/** Per-template SEO: sets <title> and meta description (Shopify: page_title / page_description). */
export function useSeo(title: string, description?: string) {
  useEffect(() => {
    document.title = title.includes(SITE) ? title : `${title} | ${SITE}`;
    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    }
  }, [title, description]);
}

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

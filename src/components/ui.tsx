import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Check, Plus, Star } from "lucide-react";
import { ALT, IMG, type ImgKey } from "@/data/images";
import { cn } from "@/utils/cn";
import { isEmail, load, save } from "@/lib/utils";

/* ── Image ───────────────────────────────────────────────────────────────── */
export function Img({ k, alt, className, eager }: { k: ImgKey; alt?: string; className?: string; eager?: boolean }) {
  return (
    <img
      src={IMG[k]}
      alt={alt ?? ALT[k]}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      draggable={false}
      className={className}
    />
  );
}

/* ── Stars ───────────────────────────────────────────────────────────────── */
export function Stars({ value, size = 14, className }: { value: number; size?: number; className?: string }) {
  const row = (cls: string) => (
    <span className={cn("flex gap-0.5", cls)} aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} size={size} fill="currentColor" strokeWidth={0} className="shrink-0" />
      ))}
    </span>
  );
  return (
    <span className={cn("relative inline-flex", className)} role="img" aria-label={`Rated ${value} out of 5`}>
      {row("text-black/15")}
      <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${(value / 5) * 100}%` }}>
        {row("text-black")}
      </span>
    </span>
  );
}

/* ── Section heading ─────────────────────────────────────────────────────── */
export function SectionHead({
  eyebrow,
  heading,
  body,
  align = "center",
  action,
}: {
  eyebrow?: string;
  heading: string;
  body?: string;
  align?: "center" | "left";
  action?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "mb-8 md:mb-12",
        align === "center" ? "text-center" : "flex items-end justify-between gap-6",
      )}
    >
      <div>
        {eyebrow && <p className="t-eyebrow mb-3 text-muted">{eyebrow}</p>}
        <h2 className="t-h2">{heading}</h2>
        {body && <p className={cn("mt-3 text-muted", align === "center" && "mx-auto max-w-xl")}>{body}</p>}
      </div>
      {action}
    </div>
  );
}

/* ── Accordion ───────────────────────────────────────────────────────────── */
export function Accordion({
  items,
  open: controlled,
  onChange,
  defaultOpen = -1,
}: {
  items: { title: string; content: ReactNode }[];
  open?: number;
  onChange?: (i: number) => void;
  defaultOpen?: number;
}) {
  const [inner, setInner] = useState(defaultOpen);
  const open = controlled ?? inner;
  const set = onChange ?? setInner;
  const id = useId();
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.title}>
            <h3 className="font-sans tracking-normal">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`${id}-${i}`}
                id={`${id}-b-${i}`}
                onClick={() => set(isOpen ? -1 : i)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left text-base font-medium"
              >
                {it.title}
                <Plus
                  size={18}
                  strokeWidth={1.5}
                  className={cn("shrink-0 transition-transform duration-300", isOpen && "rotate-45")}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <div
              id={`${id}-${i}`}
              role="region"
              aria-labelledby={`${id}-b-${i}`}
              inert={!isOpen}
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-luxe",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <div className="pb-6 pr-6 text-muted">{it.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Drawer / sheet ──────────────────────────────────────────────────────── */
const SIDES = {
  left: ["inset-y-0 left-0 w-[88%] max-w-sm", "-translate-x-full"],
  right: ["inset-y-0 right-0 w-[92%] max-w-md", "translate-x-full"],
  sheet: [
    "inset-x-0 bottom-0 max-h-[92dvh] rounded-t-3xl md:inset-x-auto md:bottom-auto md:left-1/2 md:top-1/2 md:w-[min(92vw,54rem)] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl",
    "translate-y-full md:-translate-y-[46%] md:opacity-0",
  ],
} as const;

export function Drawer({
  open,
  onClose,
  side = "right",
  label,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  side?: keyof typeof SIDES;
  label: string;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab" || !ref.current) return;
      // Focus trap: keep Tab / Shift+Tab inside the open dialog.
      const items = ref.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const focusable = [...items].filter((el) => !el.closest("[inert]") && el.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const lastEl = focusable[focusable.length - 1];
      const activeEl = document.activeElement;
      if (e.shiftKey && (activeEl === first || activeEl === ref.current)) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && activeEl === lastEl) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const last = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      last?.focus?.();
    };
  }, [open, onClose]);

  const [base, closed] = SIDES[side];
  return (
    <div className={cn("fixed inset-0 z-50", !open && "pointer-events-none")} inert={!open}>
      <div
        onClick={onClose}
        className={cn("absolute inset-0 bg-black/45 transition-opacity duration-300", open ? "opacity-100" : "opacity-0")}
      />
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={cn(
          "absolute flex flex-col overflow-hidden bg-white shadow-2xl outline-none transition-[translate,opacity] duration-[380ms] ease-luxe",
          base,
          !open && closed,
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

/* ── Email capture (stores locally — maps to Shopify customer form / Klaviyo) ─ */
export function EmailForm({
  source,
  cta,
  dark,
  withPhone,
  success = "You’re on the list. Check your inbox for your welcome offer.",
  onDone,
}: {
  source: string;
  cta: string;
  dark?: boolean;
  withPhone?: boolean;
  success?: string;
  onDone?: () => void;
}) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!isEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    const list = load<{ email: string; phone?: string; source: string }[]>("rep_subscribers", []);
    save("rep_subscribers", [...list, { email: email.trim(), phone: phone.trim() || undefined, source }]);
    setError("");
    setDone(true);
    onDone?.();
  };

  if (done) {
    return (
      <p role="status" className={cn("flex items-start gap-3 text-base", dark ? "text-white" : "text-black")}>
        <span className={cn("mt-0.5 grid size-6 shrink-0 place-items-center rounded-full", dark ? "bg-blush text-black" : "bg-black text-white")}>
          <Check size={14} strokeWidth={2.5} aria-hidden="true" />
        </span>
        {success}
      </p>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="w-full">
      <div className={cn("flex flex-col gap-3", !withPhone && "sm:flex-row")}>
        <div className="flex-1">
          <label htmlFor={`${id}-e`} className="sr-only">
            Email address
          </label>
          <input
            id={`${id}-e`}
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-err` : undefined}
            className={cn("field", dark && "border-white")}
          />
        </div>
        {withPhone && (
          <div>
            <label htmlFor={`${id}-p`} className="sr-only">
              Mobile number (optional)
            </label>
            <input
              id={`${id}-p`}
              type="tel"
              autoComplete="tel"
              placeholder="Mobile number (optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={cn("field", dark && "border-white")}
            />
          </div>
        )}
        <button type="submit" className={cn("btn shrink-0", dark ? "btn-blush" : "btn-primary")}>
          {cta}
        </button>
      </div>
      {error && (
        <p id={`${id}-err`} role="alert" className={cn("mt-2 pl-5 text-sm", dark ? "text-blush" : "text-black")}>
          {error}
        </p>
      )}
    </form>
  );
}

/* ── Quantity stepper ────────────────────────────────────────────────────── */
export function Qty({
  value,
  max,
  onChange,
  small,
  label = "Quantity",
}: {
  value: number;
  max: number;
  onChange: (n: number) => void;
  small?: boolean;
  label?: string;
}) {
  const b = cn("grid place-items-center transition-colors hover:bg-blush disabled:opacity-30 disabled:hover:bg-transparent", small ? "size-9" : "size-12");
  return (
    <div className="inline-flex items-center rounded-full border border-black" role="group" aria-label={label}>
      <button type="button" className={cn(b, "rounded-l-full")} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Decrease quantity">
        −
      </button>
      <span className={cn("text-center tabular-nums", small ? "w-7 text-sm" : "w-9")} aria-live="polite">
        {value}
      </span>
      <button type="button" className={cn(b, "rounded-r-full")} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Increase quantity">
        +
      </button>
    </div>
  );
}

/* ── Breadcrumbs ─────────────────────────────────────────────────────────── */
export function Crumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((c, i) => (
          <li key={c.label} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {c.to ? (
              <Link to={c.to} className="link-grow">
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-black">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ── Social icons (one consistent 1.5px stroke set) ──────────────────────── */
export function SocialIcon({ name, size = 20 }: { name: string; size?: number }) {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  switch (name) {
    case "Instagram":
      return (
        <svg {...p}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.4" cy="6.6" r="0.7" fill="currentColor" stroke="none" />
        </svg>
      );
    case "TikTok":
      return (
        <svg {...p}>
          <path d="M14 3v11.6a3.6 3.6 0 1 1-3.6-3.6" />
          <path d="M14 3c.4 2.8 2.2 4.6 5 5" />
        </svg>
      );
    case "Facebook":
      return (
        <svg {...p}>
          <path d="M14 21v-8h2.7l.5-3.2H14V7.9c0-1 .4-1.7 1.8-1.7h1.6V3.4c-.4-.1-1.4-.2-2.5-.2-2.4 0-4 1.5-4 4.1v2.5H8.2V13h2.7v8" />
        </svg>
      );
    default:
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9" />
          <path d="M10.2 19.6 12 12" />
          <path d="M11.3 14.6c.5.7 1.3 1.1 2.2 1.1 2 0 3.4-1.8 3.4-4s-1.8-3.9-4.3-3.9c-2.8 0-4.5 1.9-4.5 4 0 1 .4 1.8 1.1 2.3" />
        </svg>
      );
  }
}

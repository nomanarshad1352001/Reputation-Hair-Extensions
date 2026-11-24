import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Check, Timer } from "lucide-react";
import { settings } from "@/theme/settings";

function parts(ms: number) {
  const s = Math.floor(ms / 1000);
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

export function SaleStrip() {
  const cfg = settings.sale;
  const end = new Date(cfg.endsAt).getTime();
  const [now, setNow] = useState(() => Date.now());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!cfg.visible || !(end > now)) return null;
  const t = parts(end - now);
  const unit = (v: number, l: string) => (
    <span className="flex flex-col items-center">
      <span className="font-display text-2xl tabular-nums leading-none md:text-3xl">{String(v).padStart(2, "0")}</span>
      <span className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted">{l}</span>
    </span>
  );

  return (
    <section aria-label="Sale offer" className="border-b border-line bg-blush-soft">
      <div className="wrap flex flex-col items-center justify-between gap-5 py-5 md:flex-row">
        <div className="flex items-center gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-black text-white">
            <Timer size={18} strokeWidth={1.5} aria-hidden="true" />
          </span>
          <div>
            <p className="text-[15px] font-medium">{cfg.offer}</p>
            <p className="text-sm text-muted">{cfg.headline}</p>
          </div>
        </div>
        <div className="flex items-end gap-3" role="timer" aria-label={`${t.d} days ${t.h} hours ${t.m} minutes left`}>
          {unit(t.d, "days")}
          <span className="pb-4 font-display text-xl" aria-hidden="true">:</span>
          {unit(t.h, "hrs")}
          <span className="pb-4 font-display text-xl" aria-hidden="true">:</span>
          {unit(t.m, "min")}
          <span className="pb-4 font-display text-xl" aria-hidden="true">:</span>
          {unit(t.s, "sec")}
        </div>
        <div className="flex flex-col items-center gap-2 text-center md:items-end md:text-right">
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(cfg.code).catch(() => {});
              setCopied(true);
              setTimeout(() => setCopied(false), 1800);
            }}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-black bg-white px-5 text-[13px] font-medium tracking-[0.14em] transition-colors hover:bg-black hover:text-white"
            aria-label={`Copy code ${cfg.code}`}
          >
            {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
            {copied ? "Copied" : cfg.code}
          </button>
          <p className="max-w-xs text-xs text-muted">
            {cfg.codeNote}{" "}
            <Link to="/collections/all?sale=1" className="text-black underline underline-offset-2">
              Shop sale
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

import type { ReactNode } from "react";
// Brand-accurate social glyphs and payment marks, used in the footer.
// Icons are simplified brand marks in each network's own colour treatment.

export function SocialGlyph({ name, size = 20 }: { name: string; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", "aria-hidden": true as const };
  switch (name) {
    case "Instagram":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth={2}>
          <rect x="3" y="3" width="18" height="18" rx="5.2" />
          <circle cx="12" cy="12" r="4.1" />
          <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "TikTok":
      return (
        <svg {...common} fill="currentColor">
          <path d="M16.6 2h-3.3v13.4a2.9 2.9 0 1 1-2.9-2.9c.3 0 .5 0 .8.1V9.2a6.2 6.2 0 1 0 5.4 6.1V8.9a7.6 7.6 0 0 0 4.4 1.4V7a4.4 4.4 0 0 1-4.4-4.4z" />
        </svg>
      );
    case "Facebook":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="11" fill="currentColor" />
          <path d="M13.4 19v-5.9h2l.3-2.4h-2.3V9.2c0-.7.2-1.1 1.2-1.1h1.2V6c-.2 0-1-.1-1.9-.1-1.9 0-3.1 1.1-3.1 3.2v1.8H9.8v2.4h2.1V19z" fill="var(--fb-cut, #fff)" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="11" fill="currentColor" />
          <path d="M12.6 5.4c-3.6 0-5.5 2.4-5.5 4.9 0 1.2.5 2.2 1.5 2.6.2.1.4 0 .4-.2l.2-.7c0-.2 0-.3-.1-.4-.3-.4-.5-.9-.5-1.6 0-2.1 1.6-4 4.1-4 2.2 0 3.5 1.3 3.5 3.1 0 2.3-1 4.3-2.6 4.3-.9 0-1.5-.7-1.3-1.6.2-1.1.8-2.2.8-3 0-.7-.4-1.2-1.1-1.2-.9 0-1.6.9-1.6 2.2 0 .8.3 1.4.3 1.4l-1.1 4.8c-.3 1.4 0 3.1 0 3.3h.2c.1-.1 1.1-1.4 1.5-2.7l.6-2.3c.3.6 1.1 1 2 1 2.7 0 4.5-2.4 4.5-5.7 0-2.5-2.1-4.8-5.3-4.8z" fill="var(--pin-cut, #000)" />
        </svg>
      );
  }
}

const CHIP = "flex h-8 min-w-[3.4rem] items-center justify-center rounded-md bg-white px-2";

export function PayChip({ name }: { name: string }) {
  let inner: ReactNode;
  switch (name) {
    case "Visa":
      inner = <span className="font-sans text-[15px] font-black italic tracking-tight" style={{ color: "#1A1F71" }}>VISA</span>;
      break;
    case "Mastercard":
      inner = (
        <svg width="30" height="19" viewBox="0 0 30 19" aria-hidden="true">
          <circle cx="10" cy="9.5" r="9" fill="#EB001B" />
          <circle cx="20" cy="9.5" r="9" fill="#F79E1B" />
          <path d="M15 2.6a9 9 0 0 1 0 13.8 9 9 0 0 1 0-13.8z" fill="#FF5F00" />
        </svg>
      );
      break;
    case "Amex":
      inner = <span className="rounded-sm px-1 text-[10px] font-bold tracking-wider text-white" style={{ background: "#2E77BC" }}>AMEX</span>;
      break;
    case "PayPal":
      inner = (
        <span className="text-[14px] font-bold italic">
          <span style={{ color: "#003087" }}>Pay</span>
          <span style={{ color: "#009CDE" }}>Pal</span>
        </span>
      );
      break;
    case "Apple Pay":
      inner = (
        <span className="flex items-center gap-0.5 text-[13px] font-semibold text-black">
          <svg width="11" height="13" viewBox="0 0 24 24" aria-hidden="true" fill="#000">
            <path d="M16.4 12.6c0-2.4 2-3.6 2-3.7-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9-.7 0-1.8-.8-3-.8-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 6.9 1.2 9.2.8 1.1 1.7 2.3 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.3 0 2.1-1.1 2.8-2.2.9-1.3 1.3-2.6 1.3-2.7 0 0-2.5-1-2.5-3.9zM14.1 5.8c.6-.8 1.1-1.8 1-2.8-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.8-1 2.8 1 .1 2-.5 2.7-1.4z" />
          </svg>
          Pay
        </span>
      );
      break;
    case "Shop Pay":
      inner = <span className="text-[14px] font-bold" style={{ color: "#5A31F4" }}>shop</span>;
      break;
    default:
      inner = <span className="text-[12px] font-medium text-black">{name}</span>;
  }
  return (
    <li className={CHIP} title={name}>
      {inner}
      <span className="sr-only">{name}</span>
    </li>
  );
}

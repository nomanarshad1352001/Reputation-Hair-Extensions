import { Link } from "react-router-dom";
import { settings } from "@/theme/settings";
import { EmailForm } from "@/components/ui";
import { PayChip, SocialGlyph } from "@/components/brand";
import { Logo } from "@/components/Header";

export function Footer() {
  const f = settings.footer;
  return (
    <footer className="on-dark bg-black text-white">
      <div className="wrap py-14 md:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Newsletter + social */}
          <div className="lg:col-span-5">
            <Logo className="!items-start" />
            <h2 className="mt-8 max-w-sm text-[1.6rem] leading-tight md:text-3xl">{f.newsletterHeading}</h2>
            <div className="mt-5 max-w-md">
              <EmailForm source="footer" cta="Sign up" dark />
            </div>
            <ul className="-ml-3 mt-7 flex gap-1" aria-label="Social media">
              {settings.brand.social.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${s.name} (opens in a new tab)`}
                    className="grid size-11 place-items-center rounded-full transition-colors hover:bg-blush hover:text-black"
                  >
                    <SocialGlyph name={s.name} size={22} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-span-7">
            {f.columns.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h3 className="t-eyebrow mb-4 text-blush">{col.title}</h3>
                <ul className="space-y-1">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link to={l.to} className="link-grow inline-block py-1.5 text-base text-white/85 hover:text-white">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-white/15 pt-8 md:flex-row md:items-center md:justify-between">
          <ul className="flex flex-wrap gap-2" aria-label="Accepted payment methods">
            {f.payments.map((p) => (
              <PayChip key={p} name={p} />
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/70">
            <span>
              © {new Date().getFullYear()} {settings.brand.legalName}
            </span>
            {f.legal.map((l) => (
              <Link key={l.label} to={l.to} className="hover:text-white hover:underline">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

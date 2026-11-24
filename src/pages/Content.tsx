import { useState, type FormEvent, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, Check, Clock, Mail, MapPin } from "lucide-react";
import { settings } from "@/theme/settings";
import { careSteps, faqs, policies, posts } from "@/data/content";
import { products } from "@/data/products";
import type { ImgKey } from "@/data/images";
import { formatDate, isEmail, load, save, useSeo } from "@/lib/utils";
import { Accordion, Crumbs, Img } from "@/components/ui";
import { ProductCarousel } from "@/components/ProductCard";
import { PostCard } from "@/sections/home";

/* ── Shared page banner ──────────────────────────────────────────────────── */
function PageHero({ title, intro, crumbs, eyebrow }: { title: string; intro?: string; crumbs: { label: string; to?: string }[]; eyebrow?: string }) {
  return (
    <section className="bg-blush">
      <div className="wrap py-9 md:py-16">
        <Crumbs items={[{ label: "Home", to: "/" }, ...crumbs]} />
        {eyebrow && <p className="t-eyebrow mt-6">{eyebrow}</p>}
        <h1 className="t-h1 mt-4 max-w-3xl">{title}</h1>
        {intro && <p className="t-lead mt-4 max-w-xl">{intro}</p>}
      </div>
    </section>
  );
}

function Success({ children }: { children: ReactNode }) {
  return (
    <div role="status" className="flex items-start gap-4 rounded-3xl bg-blush p-6 md:p-8">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-black text-white">
        <Check size={18} aria-hidden="true" />
      </span>
      <div>{children}</div>
    </div>
  );
}

/* ── About ───────────────────────────────────────────────────────────────── */
export function AboutPage() {
  useSeo("About Us — Created Behind the Chair", "Reputation was built by a mother-daughter team of extension specialists who knew there had to be a better option.");
  const pillars = [
    ["Uncompromising quality", "Premium hair selected for its softness, shine, and naturally seamless blend."],
    ["Designed by professionals", "Created by expert extension specialists who understand what exceptional hair should look and feel like."],
    ["Effortless luxury", "Beautiful hair that moves naturally, styles with ease, and complements every part of your lifestyle."],
  ];
  return (
    <>
      <section className="bg-blush">
        <div className="wrap grid items-center gap-8 py-9 md:grid-cols-2 md:gap-14 md:py-16">
          <div>
            <Crumbs items={[{ label: "Home", to: "/" }, { label: "About us" }]} />
            <p className="t-eyebrow mt-6">Our story</p>
            <h1 className="t-display mt-4">
              Created behind <em className="font-normal">the chair.</em>
            </h1>
          </div>
          <div className="aspect-[5/4] overflow-hidden rounded-[2rem] bg-blush">
            <Img k="owners" eager className="size-full object-cover object-[50%_30%]" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid gap-10 md:grid-cols-[1fr_1.2fr] md:gap-20">
          <h2 className="t-h2">We knew there had to be a better option.</h2>
          <div className="t-lead space-y-5 text-muted">
            <p>We built Reputation Extensions because we knew there had to be a better option.</p>
            <p>
              After years of working with inconsistent hair quality, we created a collection that delivers the softness, durability, and natural blend
              we always wanted for our own clients.
            </p>
            <p>Today, Reputation is trusted by professional stylists and women who refuse to compromise on quality.</p>
            <p className="text-black">Mother, daughter. Built with love.</p>
            <p className="font-display text-3xl italic text-black">Xx, Liv &amp; Kathy</p>
          </div>
        </div>
      </section>

      <section className="section bg-blush-soft">
        <div className="wrap">
          <div className="mb-10 text-center md:mb-14">
            <p className="t-eyebrow mb-3 text-muted">Why Reputation</p>
            <h2 className="t-h2">The Reputation difference</h2>
          </div>
          <ol className="grid gap-5 md:grid-cols-3 md:gap-8">
            {pillars.map(([t, b], i) => (
              <li key={t} className="rounded-3xl bg-white p-7 md:p-9">
                <span className="font-display text-5xl italic text-blush-deep" aria-hidden="true">
                  0{i + 1}
                </span>
                <h3 className="t-h3 mt-5">{t}</h3>
                <p className="mt-3 text-muted">{b}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid items-center gap-9 md:grid-cols-2 md:gap-16">
          <div className="aspect-[4/5] overflow-hidden rounded-[2rem] bg-blush md:order-2">
            <Img k="catClosures" className="size-full object-cover" />
          </div>
          <div>
            <p className="t-eyebrow mb-4 text-muted">Our promise</p>
            <h2 className="t-h1">Confidence in every strand.</h2>
            <p className="t-lead mt-5 max-w-lg text-muted">
              From the first install to every wear after, our extensions are crafted to look as incredible in real life as they do on camera.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/collections/all" className="btn btn-primary">
                Shop the collection
              </Link>
              <Link to="/pages/hair-care-guide" className="btn btn-outline">
                Hair care guide
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ── Contact (form + map) ────────────────────────────────────────────────── */
export function ContactPage() {
  useSeo("Contact Us", "Questions about an order, an install, or which piece is right for you? Send us a note.");
  const [f, setF] = useState({ name: "", email: "", order: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!f.name.trim()) er.name = "Please tell us your name.";
    if (!isEmail(f.email)) er.email = "Please enter a valid email address.";
    if (f.message.trim().length < 10) er.message = "Please add a little more detail so we can help.";
    setErrors(er);
    if (Object.keys(er).length) return;
    save("rep_messages", [...load<unknown[]>("rep_messages", []), { ...f, at: new Date().toISOString() }]);
    setDone(true);
  };

  const input = (id: keyof typeof f, label: string, props: Record<string, string> = {}) => (
    <div>
      <label htmlFor={`c-${id}`} className="mb-1.5 block text-[15px] font-medium">
        {label}
      </label>
      <input
        id={`c-${id}`}
        className="field"
        value={f[id]}
        onChange={(e) => setF({ ...f, [id]: e.target.value })}
        aria-invalid={!!errors[id]}
        aria-describedby={errors[id] ? `c-${id}-err` : undefined}
        {...props}
      />
      {errors[id] && (
        <p id={`c-${id}-err`} role="alert" className="mt-1.5 pl-5 text-sm font-medium">
          {errors[id]}
        </p>
      )}
    </div>
  );

  return (
    <>
      <PageHero title="We’d love to hear from you." intro="Questions about an order, an install, or which piece is right for you? Send a note — it goes straight to our team." crumbs={[{ label: "Contact" }]} eyebrow="Contact" />
      <section className="section">
        <div className="wrap grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <div>
            {done ? (
              <Success>
                <p className="font-display text-2xl">Message sent.</p>
                <p className="mt-1">Thank you, {f.name.split(" ")[0]}. We’ll reply to {f.email} as soon as we can.</p>
              </Success>
            ) : (
              <form onSubmit={submit} noValidate className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  {input("name", "Name", { autoComplete: "name" })}
                  {input("email", "Email", { type: "email", autoComplete: "email", inputMode: "email" })}
                </div>
                {input("order", "Order number (optional)", { placeholder: "#1001" })}
                <div>
                  <label htmlFor="c-message" className="mb-1.5 block text-[15px] font-medium">
                    How can we help?
                  </label>
                  <textarea
                    id="c-message"
                    className="field"
                    value={f.message}
                    onChange={(e) => setF({ ...f, message: e.target.value })}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "c-message-err" : undefined}
                  />
                  {errors.message && (
                    <p id="c-message-err" role="alert" className="mt-1.5 pl-5 text-sm font-medium">
                      {errors.message}
                    </p>
                  )}
                </div>
                <button type="submit" className="btn btn-primary w-full sm:w-auto">
                  Send message
                </button>
              </form>
            )}
          </div>

          <div>
            <ul className="space-y-6">
              {[
                [Mail, "Email", settings.brand.email],
                [Clock, "Hours", "Monday – Friday, 9am – 5pm"],
                [MapPin, "Shipping from", "United States — delivering nationwide"],
              ].map(([Icon, label, value]) => {
                const I = Icon as typeof Mail;
                return (
                  <li key={label as string} className="flex gap-4">
                    <span className="grid size-12 shrink-0 place-items-center rounded-full bg-blush">
                      <I size={20} strokeWidth={1.5} aria-hidden="true" />
                    </span>
                    <div>
                      <p className="t-eyebrow text-muted">{label as string}</p>
                      <p className="mt-1 text-lg">{value as string}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="mt-8 overflow-hidden rounded-3xl border border-line">
              <iframe
                title="Map of the United States, where Reputation ships"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-125.5%2C24.0%2C-66.5%2C50.0&layer=mapnik"
                loading="lazy"
                className="block h-72 w-full grayscale"
              />
            </div>
            <p className="mt-4 text-muted">
              Looking for a quick answer?{" "}
              <Link to="/pages/faq" className="text-black underline underline-offset-4">
                Visit the FAQ
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

/* ── FAQ ─────────────────────────────────────────────────────────────────── */
export function FaqPage() {
  useSeo("FAQ", "Answers to common questions about Reputation hair, shipping, returns and payments.");
  return (
    <>
      <PageHero title="Frequently asked questions" intro="Everything you need to know before, during and after your install." crumbs={[{ label: "FAQ" }]} eyebrow="Help" />
      <section className="section">
        <div className="wrap max-w-3xl space-y-12">
          {faqs.map((g) => (
            <div key={g.group}>
              <h2 className="t-h3 mb-4">{g.group}</h2>
              <Accordion items={g.items.map((i) => ({ title: i.q, content: <p>{i.a}</p> }))} />
            </div>
          ))}
          <div className="rounded-3xl bg-blush p-7 text-center md:p-10">
            <p className="font-display text-2xl md:text-3xl">Still have a question?</p>
            <Link to="/pages/contact" className="btn btn-primary mt-5">
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

/* ── Hair care guide ─────────────────────────────────────────────────────── */
export function CareGuidePage() {
  useSeo("Hair Care Guide", "How to wash, dry, style, sleep in and store your Reputation extensions so they last 12 months or more.");
  return (
    <>
      <section className="bg-blush">
        <div className="wrap grid items-center gap-8 py-9 md:grid-cols-2 md:gap-14 md:py-16">
          <div>
            <Crumbs items={[{ label: "Home", to: "/" }, { label: "Hair care guide" }]} />
            <p className="t-eyebrow mt-6">The guide</p>
            <h1 className="t-h1 mt-4">Care for it well, wear it for a year.</h1>
            <p className="t-lead mt-4 max-w-md">Six simple habits, written by the stylists who install our hair every day.</p>
          </div>
          <div className="aspect-[5/4] overflow-hidden rounded-[2rem]">
            <Img k="edCare" eager className="size-full object-cover" />
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap max-w-4xl">
          <ol className="divide-y divide-line border-y border-line">
            {careSteps.map((s, i) => (
              <li key={s.title} className="grid gap-2 py-8 md:grid-cols-[7rem_12rem_1fr] md:items-baseline md:gap-8 md:py-10">
                <span className="font-display text-5xl italic text-blush-deep" aria-hidden="true">
                  0{i + 1}
                </span>
                <h2 className="t-h3">{s.title}</h2>
                <p className="text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-12 flex flex-col items-center gap-4 rounded-3xl bg-blush-soft p-8 text-center md:p-12">
            <p className="font-display text-2xl md:text-3xl">Ready for hair worth looking after?</p>
            <Link to="/collections/best-sellers" className="btn btn-primary">
              Shop best sellers
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

/* ── Journal list + article ──────────────────────────────────────────────── */
export function BlogPage() {
  useSeo("The Journal", "Guides, care routines and stories from behind the chair.");
  const [lead, ...rest] = posts;
  return (
    <>
      <PageHero title="Notes from behind the chair" intro="Guides, care routines and stories from the Reputation team." crumbs={[{ label: "Journal" }]} eyebrow="The Journal" />
      <section className="section">
        <div className="wrap">
          <article className="group mb-14 md:mb-20">
            <Link to={`/blogs/journal/${lead.slug}`} className="grid items-center gap-6 md:grid-cols-2 md:gap-12">
              <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-blush">
                <Img k={lead.image} eager className="size-full object-cover transition-transform duration-700 ease-luxe group-hover:scale-105" />
              </div>
              <div>
                <p className="text-sm text-muted">
                  <span className="t-eyebrow text-black">{lead.tag}</span> <span aria-hidden="true">·</span> <time dateTime={lead.date}>{formatDate(lead.date)}</time>
                </p>
                <h2 className="t-h1 mt-3">{lead.title}</h2>
                <p className="t-lead mt-4 text-muted">{lead.excerpt}</p>
                <span className="t-eyebrow link-line mt-6 inline-block">Read the story</span>
              </div>
            </Link>
          </article>
          <ul className="grid gap-12 md:grid-cols-3 md:gap-8">
            {rest.map((p) => (
              <li key={p.slug}>
                <PostCard post={p} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

export function ArticlePage() {
  const { slug } = useParams();
  const post = posts.find((p) => p.slug === slug);
  useSeo(post ? post.title : "Article not found", post?.excerpt);
  if (!post) return <NotFound />;
  const more = posts.filter((p) => p.slug !== post.slug).slice(0, 3);
  return (
    <>
      <article>
        <header className="bg-blush">
          <div className="wrap max-w-4xl py-9 text-center md:py-16">
            <div className="flex justify-center">
              <Crumbs items={[{ label: "Home", to: "/" }, { label: "Journal", to: "/blogs/journal" }, { label: post.tag }]} />
            </div>
            <h1 className="t-h1 mt-6">{post.title}</h1>
            <p className="mt-5 text-[15px]">
              <time dateTime={post.date}>{formatDate(post.date)}</time> <span aria-hidden="true">·</span> {post.readMins} min read
            </p>
          </div>
        </header>
        <div className="wrap max-w-4xl">
          <div className="-mt-6 aspect-[16/10] overflow-hidden rounded-3xl bg-blush md:-mt-10">
            <Img k={post.image} eager className="size-full object-cover" />
          </div>
        </div>
        <div className="wrap prose-rep t-lead max-w-2xl py-10 md:py-16">
          {post.body.map((b, i) => (
            <div key={i} className="prose-rep">
              {b.h && <h2>{b.h}</h2>}
              <p className="text-muted">{b.p}</p>
            </div>
          ))}
          <div className="!mt-12 flex flex-wrap gap-3 border-t border-line pt-8">
            <Link to="/collections/all" className="btn btn-primary !no-underline">
              Shop the collection
            </Link>
            <Link to="/pages/contact" className="btn btn-outline !no-underline">
              Get in touch
            </Link>
          </div>
        </div>
      </article>
      <section className="section border-t border-line">
        <div className="wrap">
          <h2 className="t-h2 mb-8">Keep reading</h2>
          <ul className="grid gap-12 md:grid-cols-3 md:gap-8">
            {more.map((p) => (
              <li key={p.slug}>
                <PostCard post={p} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

/* ── Policies (incl. Accessibility Statement) ────────────────────────────── */
export function PolicyPage() {
  const { handle = "" } = useParams();
  const policy = policies[handle];
  useSeo(policy ? policy.title : "Page not found", policy?.intro);
  if (!policy) return <NotFound />;
  return (
    <>
      <PageHero title={policy.title} intro={policy.intro} crumbs={[{ label: policy.title }]} eyebrow="Policies" />
      <section className="section">
        <div className="wrap grid gap-10 lg:grid-cols-[15rem_1fr] lg:gap-16">
          <nav aria-label="Policies" className="lg:sticky lg:top-28 lg:self-start">
            <ul className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-col lg:gap-0 lg:px-0">
              {Object.entries(policies).map(([h, pol]) => (
                <li key={h} className="shrink-0">
                  <Link
                    to={`/policies/${h}`}
                    aria-current={h === handle ? "page" : undefined}
                    className={
                      h === handle
                        ? "inline-flex min-h-11 items-center rounded-full bg-black px-4 text-[15px] text-white lg:px-5"
                        : "inline-flex min-h-11 items-center rounded-full border border-line px-4 text-[15px] hover:border-black lg:border-0 lg:px-5 lg:hover:bg-blush"
                    }
                  >
                    {pol.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="prose-rep max-w-2xl">
            {policy.sections.map((s) => (
              <div key={s.h} className="prose-rep">
                <h2>{s.h}</h2>
                {s.p.map((p) => (
                  <p key={p.slice(0, 24)} className="text-muted">
                    {p}
                  </p>
                ))}
              </div>
            ))}
            <p className="!mt-10 border-t border-line pt-6">
              Questions? <Link to="/pages/contact">Contact us</Link> — we’re happy to help.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

/* ── Track order ─────────────────────────────────────────────────────────── */
export function TrackOrderPage() {
  useSeo("Track Your Order");
  const [order, setOrder] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<"" | "error" | "sent">("");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setMsg(order.trim() && isEmail(email) ? "sent" : "error");
  };
  return (
    <>
      <PageHero title="Track your order" intro="Enter your order number and the email you checked out with." crumbs={[{ label: "Track order" }]} eyebrow="Help" />
      <section className="section">
        <div className="wrap max-w-xl">
          <form onSubmit={submit} noValidate className="space-y-5">
            <div>
              <label htmlFor="t-order" className="mb-1.5 block text-[15px] font-medium">
                Order number
              </label>
              <input id="t-order" className="field" placeholder="#1001" value={order} onChange={(e) => setOrder(e.target.value)} />
            </div>
            <div>
              <label htmlFor="t-email" className="mb-1.5 block text-[15px] font-medium">
                Email
              </label>
              <input id="t-email" type="email" autoComplete="email" className="field" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary w-full">
              Track order
            </button>
          </form>
          <div aria-live="polite" className="mt-6">
            {msg === "error" && <p className="font-medium">Please enter your order number and a valid email address.</p>}
            {msg === "sent" && (
              <Success>
                <p className="font-medium">Preview mode</p>
                <p className="mt-1 text-[15px]">
                  On the live store this opens your Shopify order status page with real-time carrier tracking. Tracking links are also emailed as soon as
                  an order ships.
                </p>
              </Success>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

/* ── Account (Shopify customer accounts on the live store) ───────────────── */
export function AccountPage() {
  useSeo("Account");
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const [err, setErr] = useState(false);
  return (
    <section className="section">
      <div className="wrap max-w-md text-center">
        <p className="t-eyebrow mb-3 text-muted">Account</p>
        <h1 className="t-h1">Welcome back</h1>
        <p className="mt-3 text-muted">Sign in with a one-time code sent to your email — no password needed.</p>
        {sent ? (
          <div className="mt-8 text-left">
            <Success>
              <p className="font-medium">Preview mode</p>
              <p className="mt-1 text-[15px]">On the live store, Shopify customer accounts email a secure sign-in code to {email}.</p>
            </Success>
          </div>
        ) : (
          <form
            noValidate
            className="mt-8 space-y-4 text-left"
            onSubmit={(e) => {
              e.preventDefault();
              if (isEmail(email)) setSent(true);
              else setErr(true);
            }}
          >
            <div>
              <label htmlFor="a-email" className="mb-1.5 block text-[15px] font-medium">
                Email
              </label>
              <input id="a-email" type="email" autoComplete="email" className="field" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={err} />
              {err && (
                <p role="alert" className="mt-1.5 pl-5 text-sm font-medium">
                  Please enter a valid email address.
                </p>
              )}
            </div>
            <button type="submit" className="btn btn-primary w-full">
              Continue
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

/* ── 404 ─────────────────────────────────────────────────────────────────── */
export function NotFound() {
  useSeo("Page not found");
  const tiles: [string, string, ImgKey][] = settings.home.categories.tiles.map((t) => [t.title, t.to, t.image]);
  return (
    <>
      <section className="bg-blush">
        <div className="wrap py-16 text-center md:py-24">
          <p className="t-eyebrow">Error 404</p>
          <h1 className="t-display mt-4">
            Not a hair <em className="font-normal">in sight.</em>
          </h1>
          <p className="t-lead mx-auto mt-5 max-w-md">The page you’re looking for has moved or no longer exists. Let’s get you back to the good stuff.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/" className="btn btn-primary">
              Back to home
            </Link>
            <Link to="/collections/all" className="btn btn-outline">
              Shop all <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <ul className="mx-auto mt-10 flex max-w-xl flex-wrap justify-center gap-x-6 gap-y-2">
            {tiles.map(([title, to]) => (
              <li key={title}>
                <Link to={to} className="link-line">
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="section overflow-hidden">
        <div className="wrap">
          <h2 className="t-h2 mb-8">Best sellers</h2>
          <ProductCarousel items={products.filter((p) => p.bestSeller)} label="Best sellers" />
        </div>
      </section>
    </>
  );
}

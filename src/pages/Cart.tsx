import { Link } from "react-router-dom";
import { ArrowRight, Lock, ShoppingBag } from "lucide-react";
import { settings } from "@/theme/settings";
import { products } from "@/data/products";
import { useStore } from "@/lib/store";
import { money, useSeo } from "@/lib/utils";
import { Crumbs, Img } from "@/components/ui";
import { crossSell, LineItem, ShippingBar, UpsellRow } from "@/components/CartDrawer";
import { ProductCarousel } from "@/components/ProductCard";

function Summary({ cta }: { cta?: boolean }) {
  const { subtotal, savings } = useStore();
  const goal = settings.brand.freeShippingThreshold;
  return (
    <div className="rounded-3xl bg-blush-soft p-6 md:p-8">
      <h2 className="t-h3">Order summary</h2>
      <dl className="mt-5 space-y-2.5">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd>{money(subtotal + savings)}</dd>
        </div>
        {savings > 0 && (
          <div className="flex justify-between">
            <dt>Sale savings</dt>
            <dd>−{money(savings)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt>Shipping</dt>
          <dd>{subtotal >= goal ? "Free" : "Calculated at checkout"}</dd>
        </div>
        <div className="flex justify-between border-t border-black/15 pt-4 text-xl font-medium">
          <dt>Total</dt>
          <dd>{money(subtotal)}</dd>
        </div>
      </dl>
      <p className="mt-2 text-sm text-muted">Taxes calculated at checkout.</p>
      {cta && (
        <>
          <Link to="/checkout" className="btn btn-primary mt-6 w-full">
            <Lock size={15} aria-hidden="true" />
            Secure checkout
          </Link>
          <ul className="mt-5 flex flex-wrap justify-center gap-1.5" aria-label="Accepted payment methods">
            {settings.footer.payments.map((p) => (
              <li key={p} className="rounded-md border border-black/20 bg-white px-2 py-1 text-[11px] font-medium">
                {p}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default function CartPage() {
  const { lines, count, subtotal } = useStore();
  useSeo("Your bag");
  const upsell = crossSell(lines, 2);
  const also = crossSell(lines, 8);

  return (
    <div className="wrap py-8 md:py-14">
      <Crumbs items={[{ label: "Home", to: "/" }, { label: "Bag" }]} />
      <h1 className="t-h1 mt-4">
        Your bag {count > 0 && <span className="font-sans text-lg text-muted">({count})</span>}
      </h1>

      {lines.length === 0 ? (
        <div className="mt-8 rounded-3xl bg-blush-soft px-6 py-16 text-center">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-blush">
            <ShoppingBag size={24} strokeWidth={1.5} aria-hidden="true" />
          </span>
          <p className="mt-5 font-display text-3xl">Nothing here yet</p>
          <p className="mt-2 text-muted">Start with the pieces everyone’s reordering.</p>
          <Link to="/collections/best-sellers" className="btn btn-primary mt-6">
            Shop best sellers
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_24rem] lg:gap-14">
          <div>
            <div className="rounded-2xl border border-line p-4 md:p-5">
              <ShippingBar subtotal={subtotal} />
            </div>
            <ul className="mt-2 divide-y divide-line border-b border-line">
              {lines.map((l) => (
                <LineItem key={l.key} line={l} />
              ))}
            </ul>
            {upsell.length > 0 && (
              <div className="mt-8">
                <h2 className="t-eyebrow mb-3 text-muted">Complete your install</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {upsell.map((p) => (
                    <UpsellRow key={p.handle} p={p} />
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Summary cta />
            <Link to="/collections/all" className="mt-5 flex items-center justify-center gap-2 text-[15px] underline underline-offset-4">
              Continue shopping <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      )}

      <section className="mt-16 overflow-hidden md:mt-24">
        <h2 className="t-h2 mb-8">You may also like</h2>
        <ProductCarousel items={also.length ? also : products.filter((p) => p.bestSeller)} label="Recommended products" />
      </section>
    </div>
  );
}

/* Checkout hand-off. On the live store this is Shopify's hosted checkout. */
export function CheckoutPage() {
  const { lines } = useStore();
  useSeo("Checkout");
  return (
    <div className="wrap py-8 md:py-14">
      <Crumbs items={[{ label: "Home", to: "/" }, { label: "Bag", to: "/cart" }, { label: "Checkout" }]} />
      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_24rem] lg:gap-14">
        <div>
          <h1 className="t-h1">Checkout</h1>
          <div className="mt-6 rounded-3xl border border-line p-6 md:p-8">
            <p className="flex items-center gap-2 font-medium">
              <Lock size={17} aria-hidden="true" />
              This is where Shopify takes over.
            </p>
            <p className="mt-3 text-muted">
              You’re viewing a storefront preview, so no payment is taken here. On the live store, this button hands off to Shopify’s secure hosted
              checkout with express options (Shop Pay, Apple Pay, PayPal), live shipping rates and tax calculation.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/cart" className="btn btn-outline">
                Back to bag
              </Link>
              <Link to="/collections/all" className="btn btn-primary">
                Continue shopping
              </Link>
            </div>
          </div>
          {lines.length > 0 && (
            <ul className="mt-8 divide-y divide-line border-y border-line">
              {lines.map((l) => (
                <li key={l.key} className="flex items-center gap-4 py-4">
                  <div className="h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-blush">
                    <Img k={l.image} alt="" className="size-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{l.product.title}</p>
                    <p className="text-sm text-muted">
                      {l.sel.length}″ · {l.sel.texture} · Qty {l.qty}
                    </p>
                  </div>
                  <p className="font-medium">{money(l.price * l.qty)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Summary />
        </div>
      </div>
    </div>
  );
}

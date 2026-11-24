import { useEffect } from "react";
import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
import { StoreProvider } from "@/lib/store";
import { useSeo } from "@/lib/utils";
import { AnnouncementBar, Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SaleStrip } from "@/components/SaleStrip";
import { CartDrawer, NewsletterPopup } from "@/components/CartDrawer";
import { QuickAdd } from "@/components/ProductCard";
import {
  BestSellers,
  BlogTeaser,
  Categories,
  Hero,
  InstagramFeed,
  Mission,
  NewsletterCta,
  PressStrip,
  Reviews,
  VipOffer,
} from "@/sections/home";
import CollectionPage, { SearchPage } from "@/pages/Collection";
import ProductPage from "@/pages/Product";
import CartPage, { CheckoutPage } from "@/pages/Cart";
import {
  AboutPage,
  AccountPage,
  ArticlePage,
  BlogPage,
  CareGuidePage,
  ContactPage,
  FaqPage,
  NotFound,
  PolicyPage,
  TrackOrderPage,
} from "@/pages/Content";

/* Homepage — section order matches the brief; each section has a visibility toggle in theme/settings.ts */
function Home() {
  useSeo(
    "Reputation Hair Extensions | Premium Wefts, Wigs, Closures & Frontals",
    "Premium human hair weft extensions, wigs, closures and frontals — created behind the chair by professional extension specialists.",
  );
  return (
    <>
      <Hero />
      <SaleStrip />
      <PressStrip />
      <Categories />
      <VipOffer />
      <BestSellers />
      <Reviews />
      <Mission />
      <BlogTeaser />
      <InstagramFeed />
      <NewsletterCta />
    </>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Shell() {
  return (
    <>
      <a
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main")?.focus();
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[70] focus:rounded-full focus:bg-black focus:px-5 focus:py-3 focus:text-white"
      >
        Skip to content
      </a>
      <ScrollToTop />
      <AnnouncementBar />
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collections/:handle" element={<CollectionPage />} />
          <Route path="/products/:handle" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/blogs/journal" element={<BlogPage />} />
          <Route path="/blogs/journal/:slug" element={<ArticlePage />} />
          <Route path="/pages/about" element={<AboutPage />} />
          <Route path="/pages/contact" element={<ContactPage />} />
          <Route path="/pages/faq" element={<FaqPage />} />
          <Route path="/pages/hair-care-guide" element={<CareGuidePage />} />
          <Route path="/pages/track-order" element={<TrackOrderPage />} />
          <Route path="/policies/:handle" element={<PolicyPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer />
      <QuickAdd />
      <NewsletterPopup />
    </>
  );
}

export default function App() {
  return (
    <HashRouter>
      <StoreProvider>
        <Shell />
      </StoreProvider>
    </HashRouter>
  );
}

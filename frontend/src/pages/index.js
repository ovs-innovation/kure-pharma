import { useState, useRef } from "react";
import Link from "next/link";
import Layout from "@layout/Layout";
import ProductServices from "@services/ProductServices";
import BrandServices from "@services/BrandServices";
import SettingServices from "@services/SettingServices";
import ProductEnquiryModal from "@components/modal/ProductEnquiryModal";
import { getProductImageSrc } from "@utils/productImage";
import { renderHomepageIcon } from "@utils/homepageIcons";
import kureHomepageDefaults, {
  fallbackBrands,
} from "@utils/kureHomepageDefaults";
import SectionHeader from "@components/ui/SectionHeader";
import FeaturedBrands from "@components/home/FeaturedBrands";
import HomeHero from "@components/home/HomeHero";
import PromoBanners from "@components/home/PromoBanners";
import PopularCategories from "@components/home/PopularCategories";
import TherapeuticsSection from "@components/home/TherapeuticsSection";
import BreakthroughDrugs from "@components/home/BreakthroughDrugs";
import SupplyBanners from "@components/home/SupplyBanners";
import TherapyAccessGrid from "@components/home/TherapyAccessGrid";
import SpecialtyTrust from "@components/home/SpecialtyTrust";
import CredentialsStrip from "@components/home/CredentialsStrip";
import CatalogProductImage from "@components/ui/CatalogProductImage";
import CatalogReadMore from "@components/ui/CatalogReadMore";
import {
  FiArrowRight,
  FiChevronRight,
  FiSend,
  FiChevronLeft,
  FiAward,
  FiGlobe,
  FiTruck,
  FiShield,
  FiHeadphones,
  FiActivity,
  FiHeart,
  FiUsers,
  FiPackage,
} from "react-icons/fi";

const getTitleString = (titleObj) => {
  if (!titleObj) return "";
  if (typeof titleObj === "string") return titleObj;
  if (titleObj.en) return titleObj.en;
  const keys = Object.keys(titleObj);
  if (keys.length > 0) return titleObj[keys[0]];
  return "";
};

/* ─────────────────────────────────────────────
   PRODUCT CARD (reusable)
───────────────────────────────────────────── */
const catBgMap = {
  "Oncology Medicines": {
    light: "#F3EEFF",
    badge: "#7C3AED",
    accent: "#EDE9FE",
  },
  "Anti Cancer Drugs": {
    light: "#FFF0F0",
    badge: "#DC2626",
    accent: "#FEE2E2",
  },
  "Critical Care": { light: "#FFF0F5", badge: "#BE185D", accent: "#FCE7F3" },
  Immunotherapy: { light: "#EFF7FF", badge: "#1D4ED8", accent: "#DBEAFE" },
  "Targeted Therapy": { light: "#EDFFF5", badge: "#059669", accent: "#D1FAE5" },
  "Lifesaving Medicines": {
    light: "#FFFBEA",
    badge: "#D97706",
    accent: "#FDE68A",
  },
};

const ProductCard = ({ prod, onEnquire, style = "default" }) => {
  const imageUrl = getProductImageSrc(prod);
  const title = getTitleString(prod.title) || prod.name || "";

  const cardShell =
    "flex flex-col h-full border-2 border-[#c9a066]/55 rounded-sm bg-white overflow-hidden hover:border-[#b8860b]/80 hover:shadow-[0_6px_20px_rgba(184,134,11,0.12)] transition-all duration-300 group text-center";

  const imageBlock = (
    <CatalogProductImage src={imageUrl} alt={title} />
  );

  const titleBlock = (
    <h3 className="kure-catalog-card-title">{title}</h3>
  );

  const readMore = <CatalogReadMore href={`/product/${prod.slug}`} />;

  if (style === "deal") {
    return (
      <div className={`${cardShell} flex-shrink-0 kure-catalog-deal-card snap-start`} style={{ width: 232, minWidth: 232 }}>
        {imageBlock}
        <div className="kure-catalog-card-body">
          {titleBlock}
          {readMore}
        </div>
      </div>
    );
  }

  return (
    <div className={cardShell}>
      {imageBlock}
      <div className="kure-catalog-card-body">
        {titleBlock}
        {readMore}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   PAGE COMPONENT
───────────────────────────────────────────── */
const Home = ({ featuredProducts, allProducts, homepageSettings, brands }) => {
  const slides = homepageSettings?.hero?.slides || [];
  const popularCategories = homepageSettings?.popularCategories?.items || [];
  const promoBanners = homepageSettings?.promoBanners?.items || [];
  const therapeutics = homepageSettings?.therapeutics || {};
  const featuredBrands = brands || [];

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [genericEnquiryOpen, setGenericEnquiryOpen] = useState(false);
  const [activeCatFilter, setActiveCatFilter] = useState("");
  const [showAllTrending, setShowAllTrending] = useState(false);
  const dealScrollRef = useRef(null);

  const handleEnquireClick = (product) => {
    setSelectedProduct(product);
    setEnquiryModalOpen(true);
  };

  const generalProductPlaceholder = {
    _id: "general",
    name: "General Sourcing Enquiry",
    shortDescription:
      "Inquire about customized packaging or general bulk drug sourcing.",
  };

  const scroll = (ref, dir) => {
    if (ref.current)
      ref.current.scrollBy({ left: dir * 220, behavior: "smooth" });
  };

  return (
    <Layout
      title={homepageSettings?.seo?.title}
      description={homepageSettings?.seo?.description}
    >
      {homepageSettings?.hero?.enabled !== false && slides.length > 0 && (
        <HomeHero
          slides={slides}
          ctaPrimary={homepageSettings?.hero?.ctaPrimary}
          ctaSecondary={homepageSettings?.hero?.ctaSecondary}
          onEnquiry={() => setGenericEnquiryOpen(true)}
          phone={homepageSettings?.hero?.phone}
          whatsapp={homepageSettings?.hero?.whatsapp}
        />
      )}

      {homepageSettings?.popularCategories?.enabled !== false &&
        popularCategories.length > 0 && (
          <PopularCategories
            title={homepageSettings?.popularCategories?.title}
            items={popularCategories}
          />
        )}

      <BreakthroughDrugs onEnquire={() => setGenericEnquiryOpen(true)} />

      {homepageSettings?.bestDeals?.enabled !== false &&
        featuredProducts?.length > 0 && (
          <section className="kure-section kure-section-cream">
            <div className="kure-container">
              <div className="flex items-end justify-between gap-4 mb-8">
                <SectionHeader
                  eyebrow="Featured"
                  title={
                    homepageSettings?.bestDeals?.title ||
                    "Today's Best Deals For You!"
                  }
                  align="left"
                />
                <div className="flex items-center gap-3 flex-shrink-0 pb-2">
                  <div className="hidden sm:flex gap-1.5">
                    <button
                      onClick={() => scroll(dealScrollRef, -1)}
                      className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                      aria-label="Scroll left"
                    >
                      <FiChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => scroll(dealScrollRef, 1)}
                      className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                      aria-label="Scroll right"
                    >
                      <FiChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <Link
                    href={homepageSettings?.bestDeals?.linkUrl || "/products"}
                    className="text-sm font-extrabold text-[#1A2E5B] hover:text-[#8B1A2E] flex items-center gap-1 transition-colors whitespace-nowrap"
                  >
                    {homepageSettings?.bestDeals?.linkText || "See all"}{" "}
                    <FiArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              {/* Scrollable row */}
              <div
                ref={dealScrollRef}
                className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory"
              >
                {featuredProducts.map((prod) => (
                  <ProductCard
                    key={prod._id}
                    prod={prod}
                    onEnquire={handleEnquireClick}
                    style="deal"
                  />
                ))}
              </div>
            </div>
          </section>
        )}

      {homepageSettings?.promoBanners?.enabled !== false &&
        promoBanners.length > 0 && (
          <PromoBanners items={promoBanners} />
        )}

      <SupplyBanners onEnquire={() => setGenericEnquiryOpen(true)} />

      {homepageSettings?.therapeutics?.enabled !== false && (
        <TherapeuticsSection therapeutics={therapeutics} />
      )}

      <TherapyAccessGrid />

      <SpecialtyTrust onEnquire={() => setGenericEnquiryOpen(true)} />

      {homepageSettings?.featuredBrands?.enabled !== false &&
        featuredBrands.length > 0 && (
          <section className="kure-section kure-section-white">
            <div className="kure-container text-center">
              <SectionHeader
                eyebrow="Partners"
                title={
                  homepageSettings?.featuredBrands?.title ||
                  "Our Featured Brands"
                }
                subtitle="Trusted pharmaceutical manufacturers across India & globally"
              />
              <FeaturedBrands brands={featuredBrands} />
            </div>
          </section>
        )}

      {homepageSettings?.trendingProducts?.enabled !== false &&
        allProducts?.length > 0 && (
          <section className="kure-section kure-section-cream">
            <div className="kure-container">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-8">
                <SectionHeader
                  eyebrow="Trending"
                  title={
                    homepageSettings?.trendingProducts?.title ||
                    "Our Trending Products"
                  }
                  subtitle={
                    homepageSettings?.trendingProducts?.subtitle ||
                    "Premium medicines trusted across Bharat."
                  }
                  align="left"
                />
                <Link
                  href={
                    homepageSettings?.trendingProducts?.linkUrl || "/products"
                  }
                  className="text-sm font-extrabold text-[#1A2E5B] hover:text-[#8B1A2E] flex items-center gap-1 transition-colors whitespace-nowrap pb-2"
                >
                  {homepageSettings?.trendingProducts?.linkText ||
                    "See all products"}{" "}
                  <FiArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x mb-8 w-full">
                {[
                  { label: "All", key: "" },
                  ...popularCategories.map((c) => ({
                    label: c.name,
                    key: c.category,
                  })),
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveCatFilter(tab.key)}
                    className={`px-5 py-2 rounded-full text-[13px] font-extrabold border transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                      activeCatFilter === tab.key
                        ? "bg-[#1A2E5B] text-white border-[#1A2E5B]"
                        : "bg-white text-gray-500 border-gray-200 hover:border-[#1A2E5B] hover:text-[#1A2E5B]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Product Grid */}
              <div className="kure-catalog-grid grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allProducts
                  .filter(
                    (p) =>
                      !activeCatFilter ||
                      getTitleString(p.category?.name || p.category) ===
                        activeCatFilter,
                  )
                  .slice(0, showAllTrending ? undefined : 10)
                  .map((prod) => (
                    <ProductCard
                      key={prod._id}
                      prod={prod}
                      onEnquire={handleEnquireClick}
                      style="default"
                    />
                  ))}
              </div>

              {/* CTA */}
              {allProducts.filter(
                (p) =>
                  !activeCatFilter ||
                  getTitleString(p.category?.name || p.category) ===
                    activeCatFilter,
              ).length > 10 && (
                <div className="text-center mt-10">
                  <button
                    onClick={() => setShowAllTrending(!showAllTrending)}
                    className="kure-btn kure-btn-maroon !text-sm"
                  >
                    {showAllTrending ? "Show Less" : "Show More Products"}{" "}
                    <FiArrowRight
                      className={`w-4 h-4 transition-transform duration-200 ${showAllTrending ? "-rotate-90" : ""}`}
                    />
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

      <CredentialsStrip />

      {homepageSettings?.bottomCta?.enabled !== false && (
        <section className="kure-section-navy py-12">
          <div className="kure-container flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {homepageSettings?.bottomCta?.title}
              </h2>
              <p className="text-white/70 text-base font-medium mt-1">
                {homepageSettings?.bottomCta?.subtitle}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <a
                href={
                  homepageSettings?.bottomCta?.phoneHref || "tel:+919911972234"
                }
                className="kure-btn bg-white text-[#1A2E5B] hover:bg-[#FFF9F0]"
              >
                📞 {homepageSettings?.bottomCta?.phone}
              </a>
              <button
                onClick={() => setGenericEnquiryOpen(true)}
                className="kure-btn kure-btn-primary cursor-pointer"
              >
                <FiSend className="w-4 h-4 rotate-45" />{" "}
                {homepageSettings?.bottomCta?.enquiryButtonText ||
                  "Send Enquiry"}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── Modals ── */}
      {selectedProduct && (
        <ProductEnquiryModal
          modalOpen={enquiryModalOpen}
          setModalOpen={setEnquiryModalOpen}
          product={selectedProduct}
        />
      )}
      <ProductEnquiryModal
        modalOpen={genericEnquiryOpen}
        setModalOpen={setGenericEnquiryOpen}
        product={generalProductPlaceholder}
      />
    </Layout>
  );
};

/* ─────────────────────────────────────────────
   SSR
───────────────────────────────────────────── */
export const getServerSideProps = async () => {
  const [featuredResult, allResult, homepageResult, brandsResult] =
    await Promise.allSettled([
      ProductServices.getAllProducts({ featured: "true", limit: 12 }),
      ProductServices.getAllProducts({ limit: 40 }),
      SettingServices.getKureHomepageSetting(),
      BrandServices.getFeaturedBrands(),
    ]);

  const featuredRes =
    featuredResult.status === "fulfilled" ? featuredResult.value : null;
  const allRes = allResult.status === "fulfilled" ? allResult.value : null;
  const homepageSettings =
    homepageResult.status === "fulfilled" && homepageResult.value
      ? homepageResult.value
      : kureHomepageDefaults;

  let brands =
    brandsResult.status === "fulfilled" && Array.isArray(brandsResult.value)
      ? brandsResult.value
      : [];

  if (!brands.length) {
    try {
      const fallback = await BrandServices.getShowingBrands();
      brands = Array.isArray(fallback) ? fallback : fallbackBrands;
    } catch {
      brands = fallbackBrands;
    }
  }

  let featured = featuredRes?.products || [];
  if (!featured.length) featured = allRes?.products?.slice(0, 12) || [];

  if (featuredResult.status === "rejected" || allResult.status === "rejected") {
    console.warn(
      "Homepage API partially unavailable — using defaults where needed.",
      featuredResult.reason?.message || allResult.reason?.message,
    );
  }

  return {
    props: {
      featuredProducts: featured,
      allProducts: allRes?.products || [],
      homepageSettings,
      brands,
    },
  };
};

export default Home;

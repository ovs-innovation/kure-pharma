import { useState, useRef, useEffect } from "react";
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
import {
  FiArrowRight,
  FiChevronRight,
  FiCheckCircle,
  FiArrowUpRight,
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
   BRAND LOGO COMPONENT
───────────────────────────────────────────── */
const BrandLogo = ({ logo, name }) => {
  const [imgError, setImgError] = useState(false);

  if (imgError || !logo) {
    return (
      <span className="text-xs sm:text-sm font-black tracking-tight text-center leading-tight text-gray-500">
        {name}
      </span>
    );
  }

  return (
    <img
      src={logo}
      alt={name}
      className="w-full h-full object-contain filter hover:brightness-105 transition-all"
      onError={() => setImgError(true)}
    />
  );
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
  const cat =
    getTitleString(prod.category?.name || prod.category) || "Medicine";
  const colors = catBgMap[cat] || {
    light: "#FAF6F0",
    badge: "#0A5C36",
    accent: "#C39A3D",
  };
  const imageUrl = getProductImageSrc(prod);
  const title = getTitleString(prod.title) || prod.name || "";

  if (style === "deal") {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300 flex-shrink-0 snap-start group p-3.5 text-left flex flex-col justify-between relative overflow-hidden w-[185px] sm:w-[232px]">
        {/* Category Pill Tag */}
        <span
          className="absolute top-2.5 left-2.5 text-[8px] sm:text-[9px] font-bold px-2 py-0.5 rounded-md border tracking-wider uppercase z-10"
          style={{
            background: colors.light,
            color: colors.badge,
            borderColor: colors.accent,
          }}
        >
          {cat}
        </span>
        {/* Image area */}
        <div className="relative h-[180px] sm:h-[240px] w-full flex items-center justify-center bg-slate-50/50 border-b border-slate-100/40 mb-3 overflow-hidden rounded-xl">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-contain p-2 sm:p-3 transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        {/* Info */}
        <div className="flex flex-col flex-grow justify-between">
          <div className="w-full">
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 leading-snug line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] mb-1 group-hover:text-[#0F4C81] transition-colors duration-200">
              {title}
            </h3>
            <p className="text-[10px] sm:text-xs text-slate-400 font-semibold truncate mt-1 mb-3">
              {prod.composition || "Specialty Formulation"}
            </p>
          </div>
          <div className="mt-auto w-full flex flex-col gap-1.5 pb-0.5">
            <Link
              href={`/product/${prod.slug}`}
              className="inline-flex items-center justify-center w-full text-[10px] sm:text-[11px] font-black text-[#0F4C81] bg-[#0F4C81]/5 hover:bg-[#0F4C81] hover:text-white py-1.5 px-3 rounded-xl transition-all duration-300 uppercase tracking-widest"
            >
              Details
            </Link>
            {onEnquire && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEnquire(prod);
                }}
                className="inline-flex items-center justify-center w-full text-[10px] sm:text-[11px] font-black text-white bg-[#0F4C81] hover:bg-[#0a3560] py-2 px-3 rounded-xl transition-all duration-300 uppercase tracking-widest shadow-sm shadow-[#0F4C81]/15 cursor-pointer"
              >
                Enquire
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Trending / default grid card
  return (
    <div className="bg-white rounded-2xl border border-slate-100 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col group p-3.5 sm:p-4 text-left relative overflow-hidden">
      {/* Category Pill Tag */}
      <div className="absolute top-3 left-3 z-10">
        <span
          className="text-[8px] sm:text-[9px] font-bold px-2 py-0.5 rounded-md border tracking-wider uppercase"
          style={{
            background: colors.light,
            color: colors.badge,
            borderColor: colors.accent,
          }}
        >
          {cat}
        </span>
      </div>
      {/* Image */}
      <div className="relative h-[200px] sm:h-[260px] w-full flex items-center justify-center bg-slate-50/50 border-b border-slate-100/40 mb-3 overflow-hidden rounded-xl">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-contain p-2 sm:p-3 transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      {/* Info */}
      <div className="flex flex-col flex-grow justify-between">
        <div className="w-full">
          <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 leading-snug line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] mb-1 group-hover:text-[#0F4C81] transition-colors duration-200">
            {title}
          </h3>
          <p className="text-[10px] sm:text-xs text-slate-400 font-semibold truncate mb-4">
            {prod.composition || "Specialty Formulation"}
          </p>
        </div>
        <div className="mt-auto w-full flex flex-col sm:flex-row gap-1.5 sm:gap-2">
          <Link
            href={`/product/${prod.slug}`}
            className="inline-flex items-center justify-center w-full sm:flex-1 text-[10px] sm:text-[11px] font-black text-[#0F4C81] bg-[#0F4C81]/5 hover:bg-[#0F4C81] hover:text-white py-1.5 sm:py-2 rounded-xl transition-all duration-300 uppercase tracking-widest"
          >
            Details
          </Link>
          {onEnquire && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEnquire(prod);
              }}
              className="inline-flex items-center justify-center w-full sm:flex-1 text-[10px] sm:text-[11px] font-black text-white bg-[#0F4C81] hover:bg-[#0a3560] py-2 sm:py-2.5 rounded-xl transition-all duration-300 uppercase tracking-widest shadow-sm shadow-[#0F4C81]/15 cursor-pointer"
            >
              Enquire
            </button>
          )}
        </div>
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
  const qualityItems = homepageSettings?.qualityBar?.items || [];
  const promoBanners = homepageSettings?.promoBanners?.items || [];
  const therapeutics = homepageSettings?.therapeutics || {};
  const featuredBrands = brands || [];
  const heroBadges = homepageSettings?.hero?.trustBadges || [];

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [genericEnquiryOpen, setGenericEnquiryOpen] = useState(false);
  const [activeCatFilter, setActiveCatFilter] = useState("");
  const [showAllTrending, setShowAllTrending] = useState(false);
  const dealScrollRef = useRef(null);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!slides.length) return undefined;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    if (!slides.length) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };
  const prevSlide = () => {
    if (!slides.length) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

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
        <section className="relative w-full overflow-hidden bg-gradient-to-r from-[#fff4e6] via-[#f6f7ee] to-[#e8f4ff] h-[500px] md:h-[530px] flex items-center select-none group/hero mt-4">
          {/* Background image anchored to the right with smooth transition */}
          <div
            className="absolute inset-0 bg-cover bg-right bg-no-repeat transition-all duration-700 z-0"
            style={{
              backgroundImage: `url(${slides[currentSlide].bgImage || slides[currentSlide].bg})`,
            }}
          ></div>

          {/* Left White Overlay Panel */}
          <div
            className="relative z-10 w-full md:w-[54%] lg:w-[48%] h-auto md:h-full mt-auto md:mt-0 bg-white/95 md:bg-white backdrop-blur-sm md:backdrop-blur-none flex flex-col justify-center pl-6 pr-6 sm:pl-12 md:pl-16 lg:pl-24 xl:pl-32 md:pr-20 py-8 md:py-8 rounded-t-3xl md:rounded-none transition-all duration-500"
            style={{
              clipPath:
                isMounted && typeof window !== "undefined" && window.innerWidth >= 768
                  ? "polygon(0 0, 88% 0, 100% 100%, 0 100%)"
                  : "none",
              filter: "drop-shadow(8px 0 16px rgba(0,0,0,0.06))",
            }}
          >
            <div className="max-w-md space-y-4">
              <span className="text-[#0F4C81] text-[10px] md:text-xs font-black uppercase tracking-wider block">
                {slides[currentSlide].tagline}
              </span>

              <h1 className="text-2xl md:text-[38px] font-black leading-[1.2] md:leading-[1.12] text-[#0A1D37] tracking-tight transition-all duration-300">
                {slides[currentSlide].titleLine1 ||
                  slides[currentSlide].titleText}
                {slides[currentSlide].titleLine1 ? (
                  <>
                    <br />
                    <span className="text-[#C1272D]">
                      {slides[currentSlide].titleHighlight}
                    </span>
                    <br />
                    {slides[currentSlide].titleLine2}
                  </>
                ) : null}
              </h1>

              <p className="text-gray-500 text-xs md:text-[13px] font-semibold leading-relaxed max-w-sm transition-all duration-300">
                {slides[currentSlide].subtitle ||
                  "Trusted solutions built for India’s healthcare, energy and industrial markets."}
              </p>

              {/* Trust Badges Bar */}
              <div className="hidden sm:flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 pb-2 border-t border-slate-100">
                {heroBadges.map((badge, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-[#EAF2FB] flex items-center justify-center flex-shrink-0">
                      {renderHomepageIcon(badge.icon, "w-5 h-5 text-[#0F4C81]")}
                    </div>
                    <div>
                      <div className="text-[10px] font-extrabold text-slate-800 leading-tight">
                        {badge.title}
                      </div>
                      <div className="text-[8px] font-medium text-slate-400 mt-0.5 leading-tight">
                        {badge.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2">
                <Link
                  href={homepageSettings?.hero?.ctaPrimary?.link || "/products"}
                  className="flex items-center justify-center gap-1.5 bg-[#d35400] text-white text-[11px] font-extrabold px-5 py-3 rounded-lg hover:bg-[#c03f00] transition-all shadow-sm uppercase tracking-wide w-full sm:w-auto"
                >
                  {homepageSettings?.hero?.ctaPrimary?.text ||
                    "Explore Products"}{" "}
                  <span className="text-[9px]">↗</span>
                </Link>
                <button
                  onClick={() => setGenericEnquiryOpen(true)}
                  className="flex items-center justify-center gap-1.5 border border-[#059669]/20 text-[#059669] text-[11px] font-extrabold px-5 py-3 rounded-lg hover:bg-slate-50 transition-all cursor-pointer uppercase tracking-wide w-full sm:w-auto"
                >
                  {homepageSettings?.hero?.ctaSecondary?.text || "Send Enquiry"}{" "}
                  <span className="text-[9px]">↗</span>
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Arrows (Visible on Hover of the Hero section) */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 text-slate-800 flex items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover/hero:opacity-100 cursor-pointer shadow-sm"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 text-slate-800 flex items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover/hero:opacity-100 cursor-pointer shadow-sm"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>

          {/* Active Slide Indicators (Dots) */}
          <div className="absolute bottom-5 right-8 z-20 flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${currentSlide === idx ? "bg-[#0F4C81] w-5" : "bg-slate-400/40"}`}
              />
            ))}
          </div>
        </section>
      )}

      {homepageSettings?.qualityBar?.enabled !== false &&
        qualityItems.length > 0 && (
          <section className="bg-[#0A1D37] py-6 relative overflow-hidden select-none border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 lg:divide-x divide-white/5">
                {qualityItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 px-4 py-2 lg:first:pl-0"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10 shadow-inner">
                      {renderHomepageIcon(item.icon)}
                    </div>
                    <div>
                      <h4 className="text-white text-[15px] font-black tracking-wide leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-blue-200/70 text-[12.5px] font-semibold mt-0.5 leading-snug">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

      {homepageSettings?.popularCategories?.enabled !== false &&
        popularCategories.length > 0 && (
          <section className="py-14 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-black text-gray-900 text-center mb-10 tracking-tight">
                {homepageSettings?.popularCategories?.title ||
                  "Most Loved Categories Across India"}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
                {popularCategories.map((cat, idx) => (
                  <Link
                    key={idx}
                    href={`/products?category=${cat.category}`}
                    className="flex flex-col items-center group cursor-pointer"
                  >
                    <div
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-lg hover:scale-105 transition-all duration-300 overflow-hidden p-5"
                      style={{
                        backgroundColor: cat.bgColor,
                        border: `1px solid ${cat.textColor}15`,
                      }}
                    >
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <span className="mt-4 text-[15px] font-bold text-gray-700 group-hover:text-blue-600 transition-colors duration-200 text-center">
                      {cat.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

      {homepageSettings?.bestDeals?.enabled !== false &&
        featuredProducts?.length > 0 && (
          <section className="py-14 bg-[#F8FBFF] border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                  {homepageSettings?.bestDeals?.title ||
                    "Today's Best Deals For You!"}
                </h2>
                <div className="flex items-center gap-4">
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
                    className="text-base font-extrabold text-[#0F4C81] hover:text-[#C1272D] flex items-center gap-1 transition-colors"
                  >
                    {homepageSettings?.bestDeals?.linkText || "See all"}{" "}
                    <FiArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              {/* Scrollable row */}
              <div
                ref={dealScrollRef}
                className="flex gap-4 overflow-x-auto pb-3"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
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
          <section className="py-14 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {promoBanners.map((banner, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl p-7 flex flex-col justify-between min-h-[160px] relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${banner.gradientFrom} 0%, ${banner.gradientTo} 100%)`,
                    }}
                  >
                    <div className="absolute top-3 right-3 text-5xl opacity-20">
                      {banner.emoji}
                    </div>
                    <div>
                      <p
                        className="text-[13px] font-extrabold uppercase tracking-wider mb-2"
                        style={{ color: banner.labelColor }}
                      >
                        {banner.label}
                      </p>
                      <h3
                        className="text-3xl font-black leading-tight"
                        style={{ color: banner.titleColor }}
                      >
                        {banner.title}
                        <br />
                        {banner.titleLine2}
                      </h3>
                    </div>
                    <Link
                      href={banner.linkUrl}
                      className="inline-flex items-center gap-1 mt-4 text-[14px] font-extrabold hover:underline"
                      style={{ color: banner.linkColor }}
                    >
                      {banner.linkText} <FiArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

      {homepageSettings?.therapeutics?.enabled !== false && (
        <section className="py-16 bg-[#F5F8FC] border-t border-gray-100 relative overflow-hidden">
          {/* Subtle decorative background gradients */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-100/40 rounded-full filter blur-3xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-100/30 rounded-full filter blur-3xl -z-10"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left: Premium Typography Layout */}
              <div className="lg:col-span-4 space-y-4">
                <span className="text-[13px] font-extrabold text-[#0F4C81] uppercase tracking-widest bg-blue-50 px-3.5 py-1.5 rounded-full inline-block">
                  {therapeutics.badge}
                </span>
                <h2 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight tracking-tight">
                  {therapeutics.title}{" "}
                  <span className="text-[#0F4C81]">
                    {therapeutics.titleHighlight}
                  </span>{" "}
                  {therapeutics.titleSuffix}
                </h2>
                <p className="text-gray-500 text-base font-medium leading-relaxed">
                  {therapeutics.description}
                </p>
              </div>

              {/* Center: Premium Glassmorphic Showcase */}
              <div className="lg:col-span-4 flex justify-center">
                <div className="w-64 h-64 rounded-3xl bg-gradient-to-br from-white/90 to-white/40 backdrop-blur-md flex flex-col items-center justify-center border border-white/60 shadow-[0_12px_36px_rgba(15,76,129,0.08)] relative p-6 group transition-all duration-300 hover:shadow-[0_16px_44px_rgba(15,76,129,0.12)] hover:-translate-y-1">
                  {/* Accent glow on hover */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-50/0 to-blue-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="w-40 h-40 flex items-center justify-center relative z-10 mb-4 transition-transform duration-500 group-hover:scale-105">
                    <img
                      src={therapeutics.image || "/products/specialty.png"}
                      alt={therapeutics.imageLabel || "Specialty Medicine"}
                      className="w-full h-full object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.06)]"
                    />
                  </div>
                  <span className="relative z-10 text-[12px] font-black text-[#0F4C81] uppercase tracking-widest bg-blue-50/80 border border-blue-100 px-3 py-1 rounded-full">
                    {therapeutics.imageLabel}
                  </span>
                </div>
              </div>

              {/* Right: Bullet points */}
              <div className="lg:col-span-4 space-y-3">
                {(therapeutics.bullets || []).map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-4 py-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-[#0F4C81]/20 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <FiCheckCircle className="text-[#0F4C81] w-4 h-4 flex-shrink-0" />
                      <span className="text-[14px] font-bold text-gray-700">
                        {item}
                      </span>
                    </div>
                    <FiArrowUpRight className="text-gray-300 w-3.5 h-3.5" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {homepageSettings?.featuredBrands?.enabled !== false &&
        featuredBrands.length > 0 && (
          <section className="py-14 bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
              <h2 className="text-2xl font-black text-gray-700 uppercase tracking-widest">
                {homepageSettings?.featuredBrands?.title ||
                  "Our Featured Brands"}
              </h2>
              <div className="flex flex-nowrap md:flex-wrap items-center justify-start md:justify-center gap-4 overflow-x-auto pb-4 scrollbar-hide select-none">
                {featuredBrands.map((brand, idx) => (
                  <div
                    key={brand._id || idx}
                    className="w-28 h-28 sm:w-32 sm:h-32 bg-white border border-orange-300/60 rounded-xl flex flex-col items-center justify-center p-4 shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:shadow-md hover:scale-102 transition-all duration-300 relative flex-shrink-0"
                  >
                    <BrandLogo logo={brand.logo} name={brand.name} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

      {homepageSettings?.trendingProducts?.enabled !== false &&
        allProducts?.length > 0 && (
          <section className="py-14 bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-8">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                    {homepageSettings?.trendingProducts?.title ||
                      "Our Trending Products"}
                  </h2>
                  <p className="text-base text-gray-400 font-medium mt-1">
                    {homepageSettings?.trendingProducts?.subtitle ||
                      "Premium products trusted across India."}
                  </p>
                </div>
                <Link
                  href={
                    homepageSettings?.trendingProducts?.linkUrl || "/products"
                  }
                  className="text-sm font-extrabold text-[#0F4C81] hover:text-[#C1272D] flex items-center gap-1 transition-colors whitespace-nowrap"
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
                        ? "bg-[#0F4C81] text-white border-[#0F4C81]"
                        : "bg-white text-gray-500 border-gray-200 hover:border-[#0F4C81] hover:text-[#0F4C81]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                    className="inline-flex items-center gap-2 bg-[#0F4C81] text-white font-extrabold text-sm px-8 py-3.5 rounded-xl hover:bg-[#0a3460] transition-colors shadow-md cursor-pointer"
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

      {homepageSettings?.bottomCta?.enabled !== false && (
        <section className="py-14 bg-[#0F4C81]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {homepageSettings?.bottomCta?.title}
              </h2>
              <p className="text-blue-200 text-base font-medium mt-1">
                {homepageSettings?.bottomCta?.subtitle}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <a
                href={
                  homepageSettings?.bottomCta?.phoneHref || "tel:+919910768201"
                }
                className="inline-flex items-center justify-center gap-2 bg-white text-[#0F4C81] px-7 py-3.5 rounded-lg font-extrabold text-base hover:bg-blue-50 transition-all shadow"
              >
                📞 {homepageSettings?.bottomCta?.phone}
              </a>
              <button
                onClick={() => setGenericEnquiryOpen(true)}
                className="inline-flex items-center justify-center gap-2 bg-[#C1272D] text-white px-7 py-3.5 rounded-lg font-extrabold text-base hover:bg-red-700 transition-all shadow cursor-pointer"
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
      ProductServices.getAllProducts({ limit: 20 }),
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

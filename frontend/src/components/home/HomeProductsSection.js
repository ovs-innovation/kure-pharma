import React, { useState, useEffect, useRef } from "react";
import {
  FiArrowRight,
  FiTrendingUp,
  FiShield,
  FiTruck,
  FiTag,
  FiHeadphones,
  FiLock,
  FiClock,
  FiAward,
} from "react-icons/fi";
import { FaFireFlameCurved } from "react-icons/fa6";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import ProductServices from "@services/ProductServices";
import ProductEnquiryModal from "@components/modal/ProductEnquiryModal";
import {
  HomePremiumProductCard,
  HomeTrendingProductCard,
} from "@components/home/HomeProductCards";
import "swiper/css";
import "swiper/css/navigation";

const ROW_LIMIT = 5;

const TRUST_ITEMS = [
  {
    icon: FiShield,
    title: "100% Original Products",
    sub: "Quality you can trust",
  },
  {
    icon: FiTruck,
    title: "Fast & Safe Delivery",
    sub: "Pan India delivery",
  },
  {
    icon: FiTag,
    title: "Best Price Guarantee",
    sub: "Competitive pricing",
  },
  {
    icon: FiHeadphones,
    title: "Expert Support",
    sub: "24/7 customer support",
  },
  {
    icon: FiLock,
    title: "Secure Payments",
    sub: "Safe & encrypted",
  },
];

const pickProducts = (primary, fallback = []) => {
  if (Array.isArray(primary) && primary.length > 0) return primary;
  return Array.isArray(fallback) ? fallback : [];
};

const SectionHeader = ({
  eyebrow,
  title,
  subtitle,
  icon,
  viewAllHref = "/search",
  showViewAll = true,
}) => (
  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 sm:mb-8">
    <div className="flex items-start gap-3 sm:gap-4 min-w-0">
      {icon ? (
        <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-[#fff0f0] flex items-center justify-center text-[#ED1C24] shadow-sm">
          {icon}
        </div>
      ) : null}
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.22em] text-[#ED1C24] mb-1">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-xl sm:text-2xl lg:text-[1.65rem] font-black text-[#0b1d3d] tracking-tight leading-tight">
          {title}
        </h2>
        {subtitle ? (
          <p className="text-sm text-gray-500 font-medium mt-1.5 max-w-xl">{subtitle}</p>
        ) : null}
      </div>
    </div>

    {showViewAll ? (
      <Link
        href={viewAllHref}
        className="flex-shrink-0 inline-flex items-center gap-1.5 text-sm font-bold text-[#0b1d3d] hover:text-[#ED1C24] transition-colors group"
      >
        View All Products
        <FiArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    ) : null}
  </div>
);

const PremiumGridSection = ({
  eyebrow,
  title,
  subtitle,
  icon,
  products,
  onEnquire,
  viewAllHref,
}) => {
  if (!products?.length) return null;

  const visible = products.slice(0, ROW_LIMIT);

  return (
    <div className="mb-14 sm:mb-16 lg:mb-20">
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
        icon={icon}
        viewAllHref={viewAllHref}
        showViewAll={products.length > ROW_LIMIT}
      />

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {visible.map((product) => (
          <div key={product._id} className="min-w-0 h-full">
            <HomePremiumProductCard product={product} onEnquire={onEnquire} />
          </div>
        ))}
      </div>
    </div>
  );
};

const TrendingCarouselSection = ({ products, onEnquire, viewAllHref = "/search" }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  if (!products?.length) return null;

  return (
    <div className="mb-14 sm:mb-16 lg:mb-20">
      <SectionHeader
        eyebrow="Trending Now"
        title="Trending Products"
        icon={<FiTrendingUp className="w-5 h-5" strokeWidth={2.5} />}
        viewAllHref={viewAllHref}
        showViewAll={products.length > 3}
      />

      <div className="relative">
        <button
          ref={prevRef}
          type="button"
          className="home-trending-nav home-trending-nav-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 -translate-x-1/2 hidden sm:flex"
          aria-label="Previous trending products"
        >
          <FiArrowRight className="w-4 h-4 rotate-180" />
        </button>

        <button
          ref={nextRef}
          type="button"
          className="home-trending-nav home-trending-nav-next absolute right-0 top-1/2 -translate-y-1/2 z-10 translate-x-1/2 hidden sm:flex"
          aria-label="Next trending products"
        >
          <FiArrowRight className="w-4 h-4" />
        </button>

        <Swiper
          modules={[Autoplay, Navigation]}
          onInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          spaceBetween={16}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 16 },
            1024: { slidesPerView: 3, spaceBetween: 20 },
          }}
          className="home-trending-swiper !px-0 sm:!px-6"
        >
          {products.map((product) => (
            <SwiperSlide key={product._id} className="!h-auto">
              <HomeTrendingProductCard product={product} onEnquire={onEnquire} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

const ProductTrustBar = () => (
  <div className="bg-[#f3f5f8] border-t border-gray-100">
    <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-12 py-6 sm:py-8">
      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {TRUST_ITEMS.map(({ icon: Icon, title, sub }) => (
          <li key={title} className="flex items-start gap-3 min-w-0">
            <span className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-white text-[#0b1d3d] shadow-sm">
              <Icon className="w-[18px] h-[18px]" strokeWidth={1.8} aria-hidden />
            </span>
            <span className="min-w-0 pt-0.5">
              <span className="block text-[11px] sm:text-xs font-bold text-[#0b1d3d] leading-snug">
                {title}
              </span>
              <span className="block text-[10px] sm:text-[11px] text-gray-500 mt-0.5 leading-snug">
                {sub}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const LoadingSkeleton = () => (
  <section className="bg-white py-10 sm:py-12 lg:py-16">
    <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-12">
      <div className="mb-14">
        <div className="h-4 w-28 bg-gray-100 rounded animate-pulse mb-3" />
        <div className="h-8 w-56 bg-gray-100 rounded animate-pulse mb-2" />
        <div className="h-4 w-72 bg-gray-50 rounded animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-8">
          {Array.from({ length: ROW_LIMIT }).map((_, i) => (
            <div key={i} className="rounded-xl bg-gray-50 animate-pulse min-h-[340px]" />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl bg-gray-50 animate-pulse h-[120px]" />
        ))}
      </div>
    </div>
  </section>
);

const HomeProductsSection = () => {
  const [popularProducts, setPopularProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [discountProducts, setDiscountProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleEnquire = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const [
          typedPopular,
          typedTrending,
          typedNew,
          taggedFeatured,
          storePayload,
        ] = await Promise.all([
          ProductServices.getProductsByType("popular").catch(() => []),
          ProductServices.getProductsByType("trending").catch(() => []),
          ProductServices.getProductsByType("new").catch(() => []),
          ProductServices.getProductsByTag("featured").catch(() => []),
          ProductServices.getShowingStoreProducts({}).catch(() => ({})),
        ]);

        const storeAll = storePayload?.products || storePayload?.popularProducts || [];
        const storePopular = storePayload?.popularProducts || storeAll;
        const storeNew = storePayload?.newArrivalsProducts || [];
        const storeDiscount = storePayload?.discountedProducts || [];

        setPopularProducts(pickProducts(typedPopular, storePopular));
        setTrendingProducts(
          pickProducts(
            typedTrending,
            typedPopular?.length ? typedPopular : storePopular.slice().reverse()
          )
        );
        setLatestProducts(
          pickProducts(typedNew, storeNew.length ? storeNew : storeAll.slice(0, 40))
        );
        setFeaturedProducts(
          pickProducts(taggedFeatured, typedPopular.length ? typedPopular : storePopular)
        );
        setDiscountProducts(storeDiscount);
      } catch (err) {
        console.error("Error fetching homepage products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const hasAnyProducts =
    popularProducts.length > 0 ||
    trendingProducts.length > 0 ||
    latestProducts.length > 0 ||
    featuredProducts.length > 0 ||
    discountProducts.length > 0;

  if (!loading && !hasAnyProducts) return null;

  if (loading) return <LoadingSkeleton />;

  return (
    <>
      <section className="bg-white py-10 sm:py-12 lg:py-16 pb-8 sm:pb-10">
        <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-12">
          <PremiumGridSection
            eyebrow="Our Products"
            title="Popular Products"
            subtitle="High quality BMS, Battery Components & Accessories"
            icon={<FaFireFlameCurved className="w-5 h-5" />}
            products={popularProducts}
            onEnquire={handleEnquire}
            viewAllHref="/search"
          />

          <TrendingCarouselSection
            products={trendingProducts}
            onEnquire={handleEnquire}
            viewAllHref="/search"
          />

          <PremiumGridSection
            eyebrow="New Arrivals"
            title="Latest Products"
            subtitle="Fresh stock added regularly for EV, solar & industrial use"
            icon={<FiClock className="w-5 h-5" strokeWidth={2.5} />}
            products={latestProducts}
            onEnquire={handleEnquire}
            viewAllHref="/search"
          />

          <PremiumGridSection
            eyebrow="Handpicked"
            title="Featured Products"
            subtitle="Top picks curated by the Kure Pharma team"
            icon={<FiAward className="w-5 h-5" strokeWidth={2.5} />}
            products={featuredProducts}
            onEnquire={handleEnquire}
            viewAllHref="/search"
          />

          {discountProducts.length > 0 ? (
            <PremiumGridSection
              eyebrow="Special Offers"
              title="Latest Discounts"
              subtitle="Best deals on battery components & accessories"
              icon={<FiTag className="w-5 h-5" strokeWidth={2.5} />}
              products={discountProducts}
              onEnquire={handleEnquire}
              viewAllHref="/search"
            />
          ) : null}
        </div>
      </section>

      <ProductTrustBar />

      <ProductEnquiryModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        product={selectedProduct}
        selectedVariant={selectedProduct?.variants?.[0]}
      />

      <style>{`
        .home-trending-nav {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 9999px;
          align-items: center;
          justify-content: center;
          background: #fff;
          border: 1px solid #e5e7eb;
          color: #0b1d3d;
          box-shadow: 0 4px 14px rgba(11, 29, 61, 0.08);
          transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
        }

        .home-trending-nav:hover {
          background: #0b1d3d;
          color: #fff;
          border-color: #0b1d3d;
        }

        .home-trending-swiper .swiper-slide {
          height: auto;
        }
      `}</style>
    </>
  );
};

export default HomeProductsSection;

import React, { useState, useEffect } from "react";
import {
  FiStar,
  FiTrendingUp,
  FiArrowRight,
  FiClock,
  FiTag,
  FiAward,
} from "react-icons/fi";
import Link from "next/link";
import ProductServices from "@services/ProductServices";
import ProductCard from "@components/product/ProductCard";
import ProductEnquiryModal from "@components/modal/ProductEnquiryModal";
import { PRODUCT_GRID_CLASS, PRODUCT_GRID_ITEM_CLASS } from "@utils/productGrid";

const DEFAULT_VISIBLE = 18;

const pickProducts = (primary, fallback = []) => {
  if (Array.isArray(primary) && primary.length > 0) return primary;
  return Array.isArray(fallback) ? fallback : [];
};

const GridSection = ({ title, icon, accent, products, onEnquire }) => {
  const [showAll, setShowAll] = useState(false);

  if (!products || products.length === 0) return null;

  const visible = showAll ? products : products.slice(0, DEFAULT_VISIBLE);

  return (
    <div className="mb-12 last:mb-0">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md"
            style={{ background: accent }}
          >
            {icon}
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">{title}</h2>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5">
              {products.length} product{products.length === 1 ? "" : "s"}
            </p>
            <div className="h-0.5 w-8 rounded-full mt-1" style={{ background: accent }} />
          </div>
        </div>

        <Link
          href="/search"
          className="hidden sm:flex items-center gap-1.5 text-[11px] font-black text-gray-400 hover:text-[#0b1d3d] uppercase tracking-widest transition-colors"
        >
          View All <FiArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className={PRODUCT_GRID_CLASS}>
        {visible.map((product) => (
          <div key={product._id} className={PRODUCT_GRID_ITEM_CLASS}>
            <ProductCard product={product} onEnquire={onEnquire} />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-5">
        {products.length > DEFAULT_VISIBLE && (
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="text-[11px] font-black text-gray-400 hover:text-[#0b1d3d] uppercase tracking-widest transition-colors"
          >
            {showAll
              ? "Show Less ↑"
              : `Show All ${products.length} Products ↓`}
          </button>
        )}
        <Link
          href="/search"
          className="sm:hidden ml-auto flex items-center gap-1.5 text-[11px] font-black text-gray-400 hover:text-[#0b1d3d] uppercase tracking-widest transition-colors"
        >
          View All <FiArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};

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
          pickProducts(
            typedNew,
            storeNew.length ? storeNew : storeAll.slice(0, 40)
          )
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

  if (loading) {
    return (
      <section className="bg-white py-8 sm:py-10 lg:py-14 pb-24 sm:pb-14">
        <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-12">
          {[0, 1, 2].map((s) => (
            <div key={s} className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-gray-100 rounded-xl animate-pulse" />
                <div className="h-5 bg-gray-100 rounded w-40 animate-pulse" />
              </div>
              <div className={PRODUCT_GRID_CLASS}>
                {Array.from({ length: DEFAULT_VISIBLE }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-50 rounded-2xl animate-pulse min-h-[360px] sm:min-h-[320px]"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-white py-8 sm:py-10 lg:py-14 pb-24 sm:pb-14">
        <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-12">
          <GridSection
            title="Popular Products"
            icon={<FiStar className="w-4 h-4" />}
            accent="#0b1d3d"
            products={popularProducts}
            onEnquire={handleEnquire}
          />
          <GridSection
            title="Trending Products"
            icon={<FiTrendingUp className="w-4 h-4" />}
            accent="#ED1C24"
            products={trendingProducts}
            onEnquire={handleEnquire}
          />
          <GridSection
            title="Latest Products"
            icon={<FiClock className="w-4 h-4" />}
            accent="#2563eb"
            products={latestProducts}
            onEnquire={handleEnquire}
          />
          <GridSection
            title="Featured Products"
            icon={<FiAward className="w-4 h-4" />}
            accent="#7c3aed"
            products={featuredProducts}
            onEnquire={handleEnquire}
          />
          <GridSection
            title="Latest Discounts"
            icon={<FiTag className="w-4 h-4" />}
            accent="#ea580c"
            products={discountProducts}
            onEnquire={handleEnquire}
          />
        </div>
      </section>

      <ProductEnquiryModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        product={selectedProduct}
        selectedVariant={selectedProduct?.variants?.[0]}
      />
    </>
  );
};

export default HomeProductsSection;

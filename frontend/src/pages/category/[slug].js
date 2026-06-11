import React, { useMemo } from "react";
import Image from "next/image";
import useTranslation from "next-translate/useTranslation";

import Layout from "@layout/Layout";
import useFilter from "@hooks/useFilter";
import CardSlider from "@components/cta-card/CardSlider";
import ProductServices from "@services/ProductServices";
import ProductCard from "@components/product/ProductCard";
import ProductEnquiryModal from "@components/modal/ProductEnquiryModal";
import { PRODUCT_GRID_CLASS, PRODUCT_GRID_ITEM_CLASS } from "@utils/productGrid";
import AttributeServices from "@services/AttributeServices";
import CategoryCarousel from "@components/carousel/CategoryCarousel";
import useUtilsFunction from "@hooks/useUtilsFunction";
import { sanitizeData } from "@utils/dataSanitizer";

const SORT_OPTIONS = [
  { value: "", label: "Default" },
  { value: "Newest", label: "Newest" },
  { value: "Featured", label: "Featured" },
  { value: "Low", label: "Price: Low to High" },
  { value: "High", label: "Price: High to Low" },
];

const CategoryPage = ({ products, attributes, category, slug }) => {
  const { t } = useTranslation();
  const { showingTranslateValue } = useUtilsFunction();
  const [visibleProduct, setVisibleProduct] = React.useState(18);
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [modalOpen, setModalOpen] = React.useState(false);

  const categoryTitle = useMemo(() => {
    if (category?.name) return showingTranslateValue(category.name);
    if (slug) {
      return slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    }
    return "All Products";
  }, [category, slug, showingTranslateValue]);

  const { productData, setSortedField, sortedField } = useFilter(products);

  React.useEffect(() => {
    setVisibleProduct(18);
  }, [sortedField, slug]);

  const handleEnquire = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  return (
    <Layout
      title={categoryTitle}
      description={`Browse ${categoryTitle} products at Elecmoon`}
    >
      <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
        <div className="flex flex-col py-6 lg:py-8">
          <div className="w-full mb-6">
            <CardSlider />
          </div>

          <div className="relative mb-10">
            <CategoryCarousel activeSlug={slug} />
          </div>

          <div className="w-full mb-8">
            {category?.icon ? (
              <div className="relative w-full h-40 sm:h-48 md:h-56 rounded-2xl overflow-hidden mb-6 border border-gray-100 bg-gray-50">
                <Image
                  src={category.icon}
                  alt={categoryTitle}
                  fill
                  sizes="100vw"
                  priority
                  className="object-contain p-4 sm:p-6"
                />
              </div>
            ) : null}

            <h1 className="text-3xl md:text-4xl font-black text-[#0b1d3d] mb-2 tracking-tight">
              {categoryTitle}
            </h1>
            <div className="h-1 w-20 bg-[#ED1C24] rounded-full mb-3" />
            <p className="text-sm text-gray-500 font-medium mb-2">
              {productData?.length || 0} product{(productData?.length || 0) === 1 ? "" : "s"} in this category
            </p>
            {category?.description ? (
              <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">
                {showingTranslateValue(category.description)}
              </p>
            ) : null}
          </div>

          {productData?.length === 0 ? (
            <div className="mx-auto p-5 my-5">
              <Image
                className="my-4 mx-auto"
                src="/no-result.svg"
                alt="no-result"
                width={400}
                height={380}
              />
              <h2 className="text-lg md:text-xl lg:text-2xl xl:text-2xl text-center mt-2 font-medium font-serif text-gray-600">
                {t("common:sorryText")} 😞
              </h2>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                <h6 className="text-sm font-medium text-gray-600">
                  {t("common:totalI")}{" "}
                  <span className="font-bold text-[#0b1d3d]">{productData?.length}</span>{" "}
                  {t("common:itemsFound")}
                </h6>

                <div className="flex items-center gap-2">
                  <label htmlFor="category-sort" className="text-xs font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    Sort By
                  </label>
                  <select
                    id="category-sort"
                    value={sortedField}
                    onChange={(e) => setSortedField(e.target.value)}
                    className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#0b1d3d]/20 focus:border-[#0b1d3d] min-w-[180px]"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value || "default"} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={PRODUCT_GRID_CLASS}>
                {productData?.slice(0, visibleProduct).map((product, i) => (
                  <div key={product._id || i + 1} className={PRODUCT_GRID_ITEM_CLASS}>
                    <ProductCard
                      product={product}
                      attributes={attributes}
                      onEnquire={handleEnquire}
                    />
                  </div>
                ))}
              </div>

              {productData?.length > visibleProduct && (
                <div className="flex justify-center mt-12 pb-10">
                  <button
                    type="button"
                    onClick={() => setVisibleProduct((pre) => pre + 10)}
                    className="bg-white border-2 border-[#0b1d3d] text-[#0b1d3d] hover:bg-[#0b1d3d] hover:text-white px-8 py-3 rounded-full font-bold transition-all duration-300 text-sm active:scale-95 shadow-lg"
                  >
                    {t("common:loadMoreBtn")}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <ProductEnquiryModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        product={selectedProduct}
        selectedVariant={selectedProduct?.variants?.[0]}
      />
    </Layout>
  );
};

export default CategoryPage;

export const getServerSideProps = async (context) => {
  const slug = String(context.params?.slug || "").toLowerCase();

  if (!slug) {
    return { notFound: true };
  }

  try {
    const CategoryServices = (await import("@services/CategoryServices")).default;
    const category = await CategoryServices.getCategoryBySlug(slug);

    if (!category?._id) {
      return { notFound: true };
    }

    const [data, attributes] = await Promise.all([
      ProductServices.getShowingStoreProducts({
        category: category._id,
        page: "1",
        limit: "60",
      }),
      AttributeServices.getShowingAttributes({}),
    ]);

    return {
      props: {
        category: sanitizeData(category),
        slug,
        attributes: sanitizeData(attributes) || [],
        products: sanitizeData(data?.products) || [],
      },
    };
  } catch (error) {
    console.error("Category page error:", error);
    return { notFound: true };
  }
};

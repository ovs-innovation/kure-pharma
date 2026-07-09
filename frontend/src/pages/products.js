import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "@layout/Layout";
import PageHero from "@components/ui/PageHero";
import ProductServices from "@services/ProductServices";
import CategoryServices from "@services/CategoryServices";
import ProductEnquiryModal from "@components/modal/ProductEnquiryModal";
import ProductCard from "@components/product/ProductCard";
import { filterStorefrontProducts } from "@utils/storefrontProducts";
import { FiSearch, FiChevronRight, FiChevronLeft } from "react-icons/fi";

const DOSAGE_FORMS = ["Tablets", "Capsules", "Injections", "Liquid", "Others"];

const catBgMap = {
  "Oncology Medicines": {
    light: "#F3EEFF",
    badge: "#7C3AED",
    accent: "#EDE9FE",
  },
  "Anti Cancer Drugs": {
    light: "#F3EEFF",
    badge: "#7C3AED",
    accent: "#EDE9FE",
  },
  "Critical Care": { light: "#FFF0F0", badge: "#DC2626", accent: "#FEE2E2" },
  Immunotherapy: { light: "#FFF0F5", badge: "#BE185D", accent: "#FCE7F3" },
  "Targeted Therapy": { light: "#EFF7FF", badge: "#1D4ED8", accent: "#DBEAFE" },
  Hematology: { light: "#EFF7FF", badge: "#1D4ED8", accent: "#DBEAFE" },
  "Bone Health": { light: "#EDFFF5", badge: "#059669", accent: "#D1FAE5" },
  "Injectable Medicines": {
    light: "#FFFBEA",
    badge: "#D97706",
    accent: "#FDE68A",
  },
  "Oral Medicines": { light: "#FFFBEA", badge: "#D97706", accent: "#FDE68A" },
  "Imported Medicines": {
    light: "#EDFFF5",
    badge: "#059669",
    accent: "#D1FAE5",
  },
  "HIV Medicines": { light: "#FFF0F5", badge: "#BE185D", accent: "#FCE7F3" },
  "Nephrology Medicines": {
    light: "#EFF7FF",
    badge: "#1D4ED8",
    accent: "#DBEAFE",
  },
  "Lifesaving Medicines": {
    light: "#FFF0F0",
    badge: "#DC2626",
    accent: "#FEE2E2",
  },
};

const getTitleString = (titleObj) => {
  if (!titleObj) return "";
  if (typeof titleObj === "string") return titleObj;
  if (typeof titleObj === "object") {
    return titleObj.en || titleObj[Object.keys(titleObj)[0]] || "";
  }
  return "";
};

const Products = ({ initialProducts, categories }) => {
  const router = useRouter();
  const [products, setProducts] = useState(
    filterStorefrontProducts(initialProducts),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDosage, setSelectedDosage] = useState("");
  const [sortBy, setSortBy] = useState("A-Z");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [genericEnquiryOpen, setGenericEnquiryOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  /* ── Sync URL query → state ── */
  useEffect(() => {
    if (router.query.category) {
      const found = categories.find(
        (c) =>
          getTitleString(c.name).toLowerCase() ===
            router.query.category.toLowerCase() ||
          c._id === router.query.category,
      );
      setSelectedCategory(found ? found._id : "");
    } else {
      setSelectedCategory("");
    }
  }, [router.query.category, categories]);

  useEffect(() => {
    if (router.query.name) {
      setSearchQuery(String(router.query.name));
    }
  }, [router.query.name]);

  /* ── Fetch on filter change ── */
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const res = await ProductServices.getAllProducts({
          category: selectedCategory,
          name: searchQuery,
        });
        setProducts(filterStorefrontProducts(res.products || []));
        setCurrentPage(1);
      } catch (err) {
        console.error(err);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery]);

  const handleEnquireClick = (product) => {
    setSelectedProduct(product);
    setEnquiryModalOpen(true);
  };

  /* ── Category filter handler ── */
  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    router.push(
      catId
        ? { pathname: "/products", query: { category: catId } }
        : { pathname: "/products" },
      undefined,
      { shallow: true },
    );
  };

  /* ── Dosage client-side filter ── */
  const getProductTitle = (prod) => {
    return getTitleString(prod.title) || prod.name || "";
  };
  const getProductDesc = (prod) => {
    return getTitleString(prod.description) || "";
  };

  const filteredProducts = products.filter((prod) => {
    if (!selectedDosage) return true;
    const name = getProductTitle(prod).toLowerCase();
    const desc = getProductDesc(prod).toLowerCase();
    const d = selectedDosage.toLowerCase();
    if (d === "tablets" && (name.includes("tablet") || desc.includes("tablet")))
      return true;
    if (
      d === "capsules" &&
      (name.includes("capsule") || desc.includes("capsule"))
    )
      return true;
    if (
      d === "injections" &&
      (name.includes("injection") ||
        name.includes("vial") ||
        name.includes("ampoule") ||
        desc.includes("inject"))
    )
      return true;
    if (d === "liquid" && (name.includes("liquid") || name.includes("syrup")))
      return true;
    if (
      d === "others" &&
      !name.includes("tablet") &&
      !name.includes("capsule") &&
      !name.includes("injection") &&
      !name.includes("liquid")
    )
      return true;
    return false;
  });

  /* ── Sort ── */
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const nameA = getProductTitle(a);
    const nameB = getProductTitle(b);
    return sortBy === "A-Z"
      ? nameA.localeCompare(nameB)
      : nameB.localeCompare(nameA);
  });

  /* ── Pagination ── */
  const totalPages = Math.max(
    1,
    Math.ceil(sortedProducts.length / itemsPerPage),
  );
  const indexOfFirst = (currentPage - 1) * itemsPerPage;
  const indexOfLast = indexOfFirst + itemsPerPage;
  const currentItems = sortedProducts.slice(indexOfFirst, indexOfLast);

  const generalProductPlaceholder = {
    _id: "general",
    name: "General Sourcing Enquiry",
    shortDescription:
      "Inquire about customized packaging or general bulk drug sourcing.",
  };

  /* ── Visible page buttons ── */
  const getPageButtons = () => {
    if (totalPages <= 7) return [...Array(totalPages)].map((_, i) => i + 1);
    const pages = [1];
    if (currentPage > 3) pages.push("...");
    for (
      let p = Math.max(2, currentPage - 1);
      p <= Math.min(totalPages - 1, currentPage + 1);
      p++
    ) {
      pages.push(p);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  return (
    <Layout
      title="Products - Specialty Medicine Directory | Kure Pharma"
      description="Browse Kure Pharma's oncology, critical care, HIV, nephrology, and specialty pharmaceutical product range."
    >
      <PageHero
        breadcrumb="Products"
        title="Specialty Medicine"
        highlight="Directory"
        subtitle="Browse oncology, critical care, HIV, nephrology & imported specialty pharmaceuticals — sourced for hospitals across India."
        bgImage="/hero-indian-pharma.png"
      />
      <div className="kure-section-cream min-h-screen kure-products-page">
        <div className="kure-container py-8">
          {/* ── Breadcrumb ── */}
          <nav className="flex items-center gap-1.5 text-[12px] font-medium text-gray-500 mb-6">
            <Link href="/" className="hover:text-[#1A2E5B] transition-colors">
              Home
            </Link>
            <FiChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-800 font-semibold">Products</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* ══════════════════════════════
                SIDEBAR (Desktop Only)
            ══════════════════════════════ */}
            <aside className="hidden lg:block lg:col-span-3 space-y-4">
              {/* Therapeutic Areas Filter */}
              <div className="kure-card overflow-hidden">
                <div className="bg-transparent text-slate-800 border-b border-slate-100 px-5 py-4 text-xs font-extrabold uppercase tracking-wider">
                  Therapeutic Areas
                </div>
                <div className="p-4 space-y-3">
                  {/* All Categories */}
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        selectedCategory === ""
                          ? "bg-[#1A2E5B] border-[#1A2E5B]"
                          : "border-gray-300 group-hover:border-[#1A2E5B]"
                      }`}
                    >
                      {selectedCategory === "" && (
                        <svg
                          viewBox="0 0 10 10"
                          fill="none"
                          className="w-2.5 h-2.5"
                        >
                          <path
                            d="M2 5l2.5 2.5 4-4"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <span
                      className={`text-[13px] font-semibold transition-colors ${
                        selectedCategory === ""
                          ? "text-[#1A2E5B] font-bold"
                          : "text-gray-600 group-hover:text-gray-800"
                      }`}
                    >
                      All Categories
                    </span>
                  </label>
                  <input
                    type="hidden"
                    checked={selectedCategory === ""}
                    onChange={() => handleCategoryChange("")}
                  />

                  {categories.map((cat) => (
                    <label
                      key={cat._id}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <div
                        onClick={() =>
                          handleCategoryChange(
                            selectedCategory === cat._id ? "" : cat._id,
                          )
                        }
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer ${
                          selectedCategory === cat._id
                            ? "bg-[#1A2E5B] border-[#1A2E5B]"
                            : "border-gray-300 group-hover:border-[#1A2E5B]"
                        }`}
                      >
                        {selectedCategory === cat._id && (
                          <svg
                            viewBox="0 0 10 10"
                            fill="none"
                            className="w-2.5 h-2.5"
                          >
                            <path
                              d="M2 5l2.5 2.5 4-4"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                      <span
                        onClick={() =>
                          handleCategoryChange(
                            selectedCategory === cat._id ? "" : cat._id,
                          )
                        }
                        className={`text-[13px] font-semibold cursor-pointer transition-colors ${
                          selectedCategory === cat._id
                            ? "text-[#1A2E5B] font-bold"
                            : "text-gray-600 group-hover:text-gray-800"
                        }`}
                      >
                        {getTitleString(cat.name)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Dosage Form Filter */}
              <div className="kure-card overflow-hidden">
                <div className="bg-transparent text-slate-800 border-b border-slate-100 px-5 py-4 text-xs font-extrabold uppercase tracking-wider">
                  Dosage Form
                </div>
                <div className="p-4 space-y-3">
                  {DOSAGE_FORMS.map((dosage) => (
                    <label
                      key={dosage}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <div
                        onClick={() =>
                          setSelectedDosage(
                            selectedDosage === dosage ? "" : dosage,
                          )
                        }
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer ${
                          selectedDosage === dosage
                            ? "bg-[#1A2E5B] border-[#1A2E5B]"
                            : "border-gray-300 group-hover:border-[#1A2E5B]"
                        }`}
                      >
                        {selectedDosage === dosage && (
                          <svg
                            viewBox="0 0 10 10"
                            fill="none"
                            className="w-2.5 h-2.5"
                          >
                            <path
                              d="M2 5l2.5 2.5 4-4"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                      <span
                        onClick={() =>
                          setSelectedDosage(
                            selectedDosage === dosage ? "" : dosage,
                          )
                        }
                        className={`text-[13px] font-semibold cursor-pointer transition-colors ${
                          selectedDosage === dosage
                            ? "text-[#1A2E5B] font-bold"
                            : "text-gray-600 group-hover:text-gray-800"
                        }`}
                      >
                        {dosage}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </aside>

            {/* ══════════════════════════════
                MAIN CONTENT
            ══════════════════════════════ */}
            <main className="lg:col-span-9 space-y-5">
              {/* Page heading + search */}
              <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-black text-[#1A2E5B] tracking-tight">
                      Our Products
                    </h1>
                    <p className="text-[13px] text-gray-500 font-medium mt-1 max-w-lg">
                      A wide range of oncology, critical care, HIV, nephrology
                      and specialty medicines from trusted global manufacturers.
                    </p>
                  </div>
                  <div className="relative flex-shrink-0 w-full sm:w-56">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search medicines..."
                      className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-1 focus:ring-[#1A2E5B] focus:border-[#1A2E5B] bg-gray-50 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Toolbar */}
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold text-gray-500">
                  Showing {sortedProducts.length > 0 ? indexOfFirst + 1 : 0} -{" "}
                  {Math.min(indexOfLast, sortedProducts.length)} of{" "}
                  {sortedProducts.length} products
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-semibold text-gray-500">
                    Sort by:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-200 rounded-lg text-[12px] font-semibold text-gray-700 py-1.5 px-3 bg-white focus:outline-none focus:ring-1 focus:ring-[#1A2E5B] cursor-pointer"
                  >
                    <option value="A-Z">A - Z</option>
                    <option value="Z-A">Z - A</option>
                  </select>
                </div>
              </div>

              {/* Mobile & Tablet Horizontal Filters (Hidden on Desktop) */}
              <div className="lg:hidden space-y-4 mb-6">
                {/* Therapeutic Areas */}
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-2 px-1">Therapeutic Areas</span>
                  <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-hide snap-x">
                    <button
                      onClick={() => handleCategoryChange("")}
                      className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border whitespace-nowrap ${
                        selectedCategory === ""
                          ? "bg-[#0F4C81] text-white border-[#0F4C81]"
                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map((cat) => {
                      const title = getTitleString(cat.name);
                      const isActive = selectedCategory === cat._id;
                      return (
                        <button
                          key={cat._id}
                          onClick={() => handleCategoryChange(isActive ? "" : cat._id)}
                          className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border whitespace-nowrap ${
                            isActive
                              ? "bg-[#0F4C81] text-white border-[#0F4C81]"
                              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {title}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Dosage Form */}
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-2 px-1">Dosage Form</span>
                  <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-hide snap-x">
                    <button
                      onClick={() => setSelectedDosage("")}
                      className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border whitespace-nowrap ${
                        selectedDosage === ""
                          ? "bg-[#0F4C81] text-white border-[#0F4C81]"
                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      All Dosages
                    </button>
                    {DOSAGE_FORMS.map((dosage) => {
                      const isActive = selectedDosage === dosage;
                      return (
                        <button
                          key={dosage}
                          onClick={() => setSelectedDosage(isActive ? "" : dosage)}
                          className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border whitespace-nowrap ${
                            isActive
                              ? "bg-[#0F4C81] text-white border-[#0F4C81]"
                              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {dosage}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="kure-catalog-grid grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                {currentItems.length > 0 ? (
                  currentItems.map((prod) => (
                    <ProductCard
                      key={prod._id}
                      product={prod}
                      onEnquire={handleEnquireClick}
                      largeImage
                      overrideCategoryName={getTitleString(
                        prod.category?.name || prod.category,
                      )}
                    />
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center text-gray-400 text-sm font-semibold">
                    No products found.
                  </div>
                )}
              </div>

              {/* ── Pagination ── */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-1 pt-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-8 h-8 rounded border border-gray-200 bg-white text-gray-600 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <FiChevronLeft className="w-4 h-4" />
                  </button>

                  {getPageButtons().map((page, i) =>
                    page === "..." ? (
                      <span
                        key={`dot-${i}`}
                        className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded border text-[13px] font-bold transition-colors ${
                          currentPage === page
                            ? "bg-[#1A2E5B] border-[#1A2E5B] text-white"
                            : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 rounded border border-gray-200 bg-white text-gray-600 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <FiChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* ── CTA Banner ── */}
              <div className="mt-8 bg-[#1A2E5B] rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-md">
                <div className="flex items-center gap-4 text-center sm:text-left">
                  <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="w-6 h-6 text-white"
                    >
                      <rect
                        x="3"
                        y="4"
                        width="18"
                        height="16"
                        rx="2"
                        stroke="white"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M7 9h10M7 13h6"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <circle
                        cx="18"
                        cy="16"
                        r="3"
                        fill="white"
                        opacity="0.3"
                      />
                      <path
                        d="M17 16l1 1 1.5-1.5"
                        stroke="white"
                        strokeWidth="1"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-extrabold text-base">
                      Need Product Information?
                    </h3>
                    <p className="text-blue-200 text-[12px] font-medium mt-0.5">
                      Our team is ready to assist you with product availability,
                      information and business enquiries.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setGenericEnquiryOpen(true)}
                  className="bg-[#B8860B] hover:bg-[#d17a09] text-white font-extrabold text-sm px-6 py-3 rounded-lg transition-colors cursor-pointer flex-shrink-0 shadow"
                >
                  Send Enquiry Now
                </button>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Modals */}
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

export const getServerSideProps = async (context) => {
  const { category = "" } = context.query;
  try {
    const productsRes = await ProductServices.getAllProducts({ category });
    const categoriesRes = await CategoryServices.getAllCategories();

    // /products/store returns { products: [...], ... } in all cases
    const initialProducts = filterStorefrontProducts(
      productsRes?.products || [],
    );

    // /categories/show returns a direct array
    const categories = Array.isArray(categoriesRes)
      ? categoriesRes
      : categoriesRes?.value || categoriesRes?.categories || [];

    return {
      props: {
        initialProducts,
        categories,
      },
    };
  } catch (error) {
    console.error("Products SSR error:", error);
    return { props: { initialProducts: [], categories: [] } };
  }
};

export default Products;

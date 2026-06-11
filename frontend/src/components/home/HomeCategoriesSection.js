import React, { useContext } from "react";
import Link from "next/link";
import { FiArrowRight, FiGrid } from "react-icons/fi";
import { SidebarContext } from "@context/SidebarContext";
import useUtilsFunction from "@hooks/useUtilsFunction";
import { getCategorySearchUrl } from "@utils/categoryUrl";
import CategoryImage from "@components/common/CategoryImage";

const HomeCategoriesSection = () => {
  const { categories, isCategoriesLoading } = useContext(SidebarContext);
  const { showingTranslateValue } = useUtilsFunction();

  if (isCategoriesLoading) {
    return (
      <section className="bg-gray-50 py-10 lg:py-14">
        <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-12">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-8" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 bg-white rounded-2xl animate-pulse border border-gray-100" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!categories?.length) return null;

  return (
    <section className="bg-gray-50 py-10 lg:py-14 border-y border-gray-100">
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-[#0b1d3d]/5 text-[10px] font-black text-[#0b1d3d] uppercase tracking-[0.2em]">
              <FiGrid className="w-3 h-3" />
              Shop by Category
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Browse Our Product Categories
            </h2>
            <p className="text-gray-500 text-sm mt-2 max-w-xl">
              Electronics, batteries, components and industrial supplies — explore by category.
            </p>
          </div>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 text-[11px] font-black text-[#0b1d3d] hover:text-[#ED1C24] uppercase tracking-widest transition-colors whitespace-nowrap"
          >
            View All Products <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const name = showingTranslateValue(cat.name);
            if (!name) return null;
            const href = getCategorySearchUrl(cat._id, name, cat.slug);

            return (
              <Link
                key={cat._id}
                href={href}
                className="group flex flex-col h-full min-h-[190px] sm:min-h-[210px] bg-white rounded-2xl border border-gray-100 p-3 sm:p-4 text-center hover:shadow-[0_16px_48px_rgba(11,29,61,0.10)] sm:hover:-translate-y-1 hover:border-[#0b1d3d]/15 transition-all duration-300 min-w-0"
              >
                <CategoryImage
                  src={cat.icon}
                  alt={name}
                  className="mb-3 w-full mx-auto"
                />
                <h3 className="text-[11px] sm:text-xs font-black text-gray-800 group-hover:text-[#0b1d3d] leading-snug line-clamp-2 uppercase tracking-wide mt-auto">
                  {name}
                </h3>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default React.memo(HomeCategoriesSection);

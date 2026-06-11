import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";

//internal import
import CategoryServices from "@services/CategoryServices";
import useUtilsFunction from "@hooks/useUtilsFunction";
import { getCategorySearchUrl } from "@utils/categoryUrl";
import useGetSetting from "@hooks/useGetSetting";

const TopProductsCollage = () => {
  const router = useRouter();
  const { showingTranslateValue } = useUtilsFunction();
  const { storeCustomizationSetting } = useGetSetting();

  const {
    data: categoryData,
    error,
    isLoading: loading,
  } = useQuery({
    queryKey: ["category"],
    queryFn: async () => await CategoryServices.getShowingCategory(),
  });

  const handleCategoryClick = (category) => {
    const name = showingTranslateValue(category?.name);
    router.push(getCategorySearchUrl(category._id, name, category.slug));
  };

  // Robust category filtering logic
  const findMainCategories = (list) => {
    if (list?.length === 1) {
      const name = showingTranslateValue(list[0].name)?.toLowerCase()?.trim();
      if (name === "home" || name === "all categories" || name === "all departments" || !list[0].parentId) {
        if (list[0].children && list[0].children.length > 0) {
          return findMainCategories(list[0].children);
        }
      }
    }
    return list || [];
  };

  const filteredCategories = findMainCategories(categoryData).filter((cat) => {
    const name = showingTranslateValue(cat.name)?.toLowerCase()?.trim();
    return name !== "home" && name !== "all categories" && name !== "all departments" && name !== "";
  });

  // Get first 5 categories to display
  const displayCategories = filteredCategories.slice(0, 5);

  // Get subcategories from the first category if available
  const subCategories = displayCategories[0]?.children?.slice(0, 3) || [];

  const handleSubCategoryClick = (subCategory) => {
    const name = showingTranslateValue(subCategory?.name);
    router.push(getCategorySearchUrl(subCategory._id, name, subCategory.slug));
  };

  return (
    <div className="bg-white py-12 lg:py-16">
      <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
            {showingTranslateValue(storeCustomizationSetting?.home?.feature_title) || "Top Products Collection"}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {showingTranslateValue(storeCustomizationSetting?.home?.feature_description) || "Discover our premium selection of stabilizers, transformers, and power solutions designed for industrial and home applications"}
          </p>
        </div>

        {/* Main Collage Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Section - Main Category */}
          <div className="lg:col-span-1">
            <div className="relative h-80 lg:h-[500px] rounded-lg overflow-hidden shadow-lg">
              <img
                src="/TopProduct/TopProducts.png"
                alt="Power Solutions Collection"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-orange-900/70"></div>
              <div className="absolute inset-0 flex flex-col justify-center p-8">
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                  {displayCategories[0]
                    ? showingTranslateValue(displayCategories[0].name)
                    : "Premium Power Solutions"}
                </h3>
                <p className="text-white/90 text-lg mb-6 max-w-md">
                  {displayCategories[0]
                    ? `Explore our ${showingTranslateValue(
                        displayCategories[0].name
                      ).toLowerCase()} collection`
                    : "High-quality stabilizers and transformers for reliable power management"}
                </p>
                <button
                  onClick={() =>
                    displayCategories[0] &&
                    handleCategoryClick(displayCategories[0])
                  }
                  className="inline-flex items-center px-6 py-3 bg-white text-blue-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-300 w-fit"
                >
                  Explore Products
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Right Section - 4 Categories Grid */}
          <div className="lg:col-span-1 grid grid-cols-2 gap-4 lg:gap-6 h-full">
            {/* First card - Second main category */}
            {displayCategories[1] && (
              <div
                key={displayCategories[1]._id}
                className="relative h-36 lg:h-56 rounded-lg overflow-hidden shadow-lg group cursor-pointer"
                onClick={() => handleCategoryClick(displayCategories[1])}
              >
                <img
                  src="/TopProduct/transformer.png"
                  alt={showingTranslateValue(displayCategories[1].name)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 text-center">
                  <div className="flex items-center justify-center mb-1">
                    <div className="w-8 h-px bg-white"></div>
                    <span className="text-white font-bold text-sm px-2">
                      {showingTranslateValue(displayCategories[1].name)}
                    </span>
                    <div className="w-8 h-px bg-white"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Second card - Subcategory 1 from first category */}
            {subCategories[0] && (
              <div
                key={subCategories[0]._id}
                className="relative h-36 lg:h-56 rounded-lg overflow-hidden shadow-lg group cursor-pointer"
                onClick={() => handleSubCategoryClick(subCategories[0])}
              >
                <img
                  src="/TopProduct/UPS.png"
                  alt={showingTranslateValue(subCategories[0].name)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 text-center">
                  <div className="flex items-center justify-center mb-1">
                    <div className="w-8 h-px bg-white"></div>
                    <span className="text-white font-bold text-sm px-2">
                      {showingTranslateValue(subCategories[0].name)}
                    </span>
                    <div className="w-8 h-px bg-white"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Third card - Subcategory 2 from first category */}
            {subCategories[1] && (
              <div
                key={subCategories[1]._id}
                className="relative h-36 lg:h-56 rounded-lg overflow-hidden shadow-lg group cursor-pointer"
                onClick={() => handleSubCategoryClick(subCategories[1])}
              >
                <img
                  src="/TopProduct/MainLine.png"
                  alt={showingTranslateValue(subCategories[1].name)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 text-center">
                  <div className="flex items-center justify-center mb-1">
                    <div className="w-8 h-px bg-white"></div>
                    <span className="text-white font-bold text-sm px-2">
                      {showingTranslateValue(subCategories[1].name)}
                    </span>
                    <div className="w-8 h-px bg-white"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Fourth card - Subcategory 3 from first category */}
            {subCategories[2] && (
              <div
                key={subCategories[2]._id}
                className="relative h-36 lg:h-56 rounded-lg overflow-hidden shadow-lg group cursor-pointer"
                onClick={() => handleSubCategoryClick(subCategories[2])}
              >
                <img
                  src="/TopProduct/AC.png"
                  alt={showingTranslateValue(subCategories[2].name)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 text-center">
                  <div className="flex items-center justify-center mb-1">
                    <div className="w-8 h-px bg-white"></div>
                    <span className="text-white font-bold text-sm px-2">
                      {showingTranslateValue(subCategories[2].name)}
                    </span>
                    <div className="w-8 h-px bg-white"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    //     </div>
  );
};

export default TopProductsCollage;

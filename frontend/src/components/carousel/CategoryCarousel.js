import Image from "next/image";
import { useRouter } from "next/router";
import React, { useContext, useRef, useMemo, useState } from "react";
import { IoChevronBackOutline, IoChevronForward } from "react-icons/io5";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Controller, Navigation, Pagination } from "swiper/modules";

import { getCategorySearchUrl } from "@utils/categoryUrl";
import { SidebarContext } from "@context/SidebarContext";
import useUtilsFunction from "@hooks/useUtilsFunction";
import CategoryCarouselSkeleton from "@components/skeleton/CategoryCarouselSkeleton";
import { IMAGE_PLACEHOLDER, isCloudinaryUrl } from "@utils/cloudinaryImage";

const CategoryCarousel = ({ activeSlug }) => {
  const router = useRouter();

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const { showingTranslateValue } = useUtilsFunction();
  const { categories, isCategoriesLoading } = useContext(SidebarContext);

  const handleCategoryClick = (category) => {
    const category_name = showingTranslateValue(category?.name);
    const url = getCategorySearchUrl(category?._id, category_name, category?.slug);
    router.push(url);
  };

  const handleCategoryHover = (category) => {
    const category_name = showingTranslateValue(category?.name);
    const url = getCategorySearchUrl(category?._id, category_name, category?.slug);
    router.prefetch(url);
  };

  const enableLoop = categories.length > 6;

  if (isCategoriesLoading) {
    return <CategoryCarouselSkeleton />;
  }

  if (!categories.length) {
    return null;
  }

  return (
    <>
      <Swiper
        onInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
          swiper.navigation.init();
          swiper.navigation.update();
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        spaceBetween={28}
        navigation={true}
        allowTouchMove={true}
        loop={enableLoop}
        breakpoints={{
          320: {
            slidesPerView: 1.3,
            spaceBetween: 16,
          },
          480: {
            slidesPerView: 2,
            spaceBetween: 18,
          },
          640: {
            slidesPerView: 2.8,
            spaceBetween: 20,
          },
          860: {
            slidesPerView: 3.5,
            spaceBetween: 22,
          },
          1024: {
            slidesPerView: 4.5,
            spaceBetween: 24,
          },
          1280: {
            slidesPerView: 5.5,
            spaceBetween: 26,
          },
          1536: {
            slidesPerView: 6.5,
            spaceBetween: 28,
          },
        }}
        modules={[Autoplay, Navigation, Pagination, Controller]}
        className="mySwiper category-slider my-10"
      >
        {categories.map((category) => {
          const catSlug =
            category?.slug ||
            showingTranslateValue(category?.name)
              ?.toLowerCase()
              .replace(/[^A-Z0-9]+/gi, "-");
          const isActive =
            activeSlug === catSlug ||
            router.query._id === category?._id ||
            (router.query.category &&
              showingTranslateValue(category?.name)
                ?.toLowerCase()
                .replace(/[^A-Z0-9]+/gi, "-") === router.query.category);
          return (
            <SwiperSlide key={category._id} className="group px-3 py-3">
              <div
                onClick={() => handleCategoryClick(category)}
                onMouseEnter={() => handleCategoryHover(category)}
                onTouchStart={() => handleCategoryHover(category)}
                className={`flex flex-col items-center justify-between text-center cursor-pointer p-4 bg-white rounded-2xl border transition-all duration-300 h-52 w-52 sm:h-56 sm:w-56 mx-auto hover:shadow-lg ${
                  isActive
                    ? "border-[#A821A8] shadow-md ring-1 ring-[#A821A8]/20"
                    : "border-gray-100 hover:border-[#A821A8]/20 shadow-sm"
                }`}
              >
                <div className="bg-white p-3 mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-full shadow-md flex items-center justify-center transition-transform duration-300 group-hover:scale-105 mb-2 border border-gray-50">
                  <div className="relative w-16 h-16 sm:w-[4.5rem] sm:h-[4.5rem] flex items-center justify-center">
                    <CategoryIcon
                      src={category?.icon || IMAGE_PLACEHOLDER}
                      alt={showingTranslateValue(category?.name) || "category"}
                    />
                  </div>
                </div>

                <h3
                  className={`text-xs md:text-sm font-bold uppercase tracking-wider text-center flex-grow flex items-center justify-center transition-colors duration-200 px-1 leading-snug ${
                    isActive ? "text-[#A821A8]" : "text-gray-500 group-hover:text-[#A821A8]"
                  }`}
                >
                  {showingTranslateValue(category?.name)}
                </h3>
              </div>
            </SwiperSlide>
          );
        })}
        <button ref={prevRef} className="prev">
          <IoChevronBackOutline />
        </button>
        <button ref={nextRef} className="next">
          <IoChevronForward />
        </button>
      </Swiper>
    </>
  );
};

function CategoryIcon({ src, alt }) {
  const [failed, setFailed] = useState(false);
  const imageSrc = failed ? IMAGE_PLACEHOLDER : src;

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={56}
      height={56}
      className="object-contain w-full h-full"
      unoptimized={isCloudinaryUrl(imageSrc)}
      onError={() => setFailed(true)}
    />
  );
}

export default React.memo(CategoryCarousel);

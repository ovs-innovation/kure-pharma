import React, { useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiArrowRight, FiMessageCircle } from "react-icons/fi";
import useGetSetting from "@hooks/useGetSetting";
import { resolveBannerHref, isExternalHref } from "@utils/bannerLink";
import { optimizeImageUrl } from "@utils/cloudinaryImage";
import "swiper/css";
import "swiper/css/effect-fade";

const BannerImagePanel = ({ slide, idx, className = "" }) => {
  const href = resolveBannerHref(slide.href);
  const imageSrc = optimizeImageUrl(slide.image, { width: 1600 });

  const imageContent = (
    <div className={`relative w-full h-full overflow-hidden bg-white ${className}`}>
      {slide.image ? (
        <>
          <Image
            src={imageSrc}
            alt={slide.title || "Hero banner"}
            fill
            priority={idx === 0}
            loading={idx === 0 ? "eager" : "lazy"}
            sizes="(max-width: 1024px) 100vw, 62vw"
            className="object-cover object-center"
          />
          <div
            className="absolute inset-y-0 left-0 w-12 sm:w-16 lg:w-24 pointer-events-none bg-gradient-to-r from-white via-white/40 to-transparent"
            aria-hidden
          />
          <div
            className="absolute inset-0 pointer-events-none shadow-[inset_0_0_48px_rgba(11,29,61,0.04)]"
            aria-hidden
          />
        </>
      ) : null}
    </div>
  );

  if (!href) return imageContent;

  if (isExternalHref(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`block w-full h-full cursor-pointer ${className}`}
        aria-label={`View ${slide.title}`}
      >
        {imageContent}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={`block w-full h-full cursor-pointer ${className}`}
      aria-label={`View ${slide.title}`}
    >
      {imageContent}
    </Link>
  );
};

const HomeHeroBanner = () => {
  const { storeCustomizationSetting, loading, isFetched } = useGetSetting();
  const sd = storeCustomizationSetting?.slider;
  const swiperRef = useRef(null);
  const [active, setActive] = useState(0);

  const rawSlides = [
    {
      id: 1,
      image: sd?.first_img,
      badge: "Power Solutions",
      title: sd?.first_title?.en,
      body: sd?.first_description?.en,
      href: sd?.first_link,
      cta: sd?.first_button?.en,
    },
    {
      id: 2,
      image: sd?.second_img,
      badge: "Grid Infrastructure",
      title: sd?.second_title?.en,
      body: sd?.second_description?.en,
      href: sd?.second_link,
      cta: sd?.second_button?.en,
    },
    {
      id: 3,
      image: sd?.third_img,
      badge: "Advanced Electronics",
      title: sd?.third_title?.en,
      body: sd?.third_description?.en,
      href: sd?.third_link,
      cta: sd?.third_button?.en,
    },
  ];

  const slides = rawSlides.filter((slide) => slide.title && slide.image);

  const onSwiper = useCallback((s) => { swiperRef.current = s; }, []);
  const onChange = useCallback((s) => { setActive(s.realIndex); }, []);
  const isActive = (idx) => active === idx % slides.length;

  if (!isFetched || loading || slides.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full bg-white overflow-hidden border-b border-gray-100">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        slidesPerView={1}
        loop
        speed={900}
        autoplay={{ delay: 5500, disableOnInteraction: false }}
        onSwiper={onSwiper}
        onSlideChange={onChange}
        className="w-full hero-swiper"
      >
        {slides.map((slide, idx) => {
          const bannerHref = resolveBannerHref(slide.href);

          return (
            <SwiperSlide key={slide.id}>
              <div className="w-full flex flex-col lg:flex-row bg-white hero-slide-inner">
                <div className="w-full lg:hidden order-1 h-[42vh] min-h-[240px] max-h-[380px]">
                  <BannerImagePanel slide={slide} idx={idx} className="h-full" />
                </div>

                <div className="w-full lg:w-[38%] xl:w-[36%] flex items-center justify-center lg:justify-start px-5 sm:px-8 lg:px-10 xl:px-12 pt-8 pb-20 lg:py-8 order-2 lg:order-1 relative flex-shrink-0">
                  <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-[#ED1C24] to-transparent hidden lg:block opacity-40" />

                  <AnimatePresence mode="wait">
                    {isActive(idx) && (
                      <motion.div
                        key={`text-${slide.id}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full max-w-lg text-center lg:text-left"
                      >
                        <div className="inline-flex items-center gap-2 mb-4 justify-center lg:justify-start">
                          <span className="w-4 h-px bg-[#ED1C24]" />
                          <span className="text-[10px] font-black text-[#ED1C24] uppercase tracking-[0.28em]">{slide.badge}</span>
                        </div>

                        <h1 className="font-black text-[#0b1d3d] leading-[1.08] tracking-tight mb-4 text-3xl sm:text-4xl lg:text-[2.65rem] xl:text-5xl">
                          {slide.title}
                        </h1>

                        <div className="flex items-center gap-2 mb-4 justify-center lg:justify-start">
                          <div className="w-8 h-0.5 bg-[#ED1C24] rounded-full" />
                          <div className="w-3 h-0.5 bg-gray-200 rounded-full" />
                        </div>

                        <p className="text-gray-500 leading-relaxed mb-7 font-medium text-[15px] xl:text-[17px] max-w-sm mx-auto lg:mx-0">
                          {slide.body}
                        </p>

                        <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                          {bannerHref ? (
                            isExternalHref(bannerHref) ? (
                              <a
                                href={bannerHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center gap-2 px-6 py-3.5 bg-[#0b1d3d] hover:bg-[#ED1C24] text-white rounded-full font-black uppercase tracking-widest transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] text-[12px]"
                              >
                                {slide.cta}
                                <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                              </a>
                            ) : (
                              <Link
                                href={bannerHref}
                                className="group inline-flex items-center gap-2 px-6 py-3.5 bg-[#0b1d3d] hover:bg-[#ED1C24] text-white rounded-full font-black uppercase tracking-widest transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] text-[12px]"
                              >
                                {slide.cta}
                                <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                              </Link>
                            )
                          ) : null}
                          <Link href="/contact-us" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-black uppercase tracking-widest border-2 border-gray-200 text-gray-500 hover:border-[#0b1d3d] hover:text-[#0b1d3d] hover:bg-gray-50 hover:-translate-y-0.5 transition-all duration-200 text-[12px]">
                            <FiMessageCircle className="w-3.5 h-3.5" />
                            Get A Quote
                          </Link>
                        </div>

                        <div className="flex items-center gap-5 sm:gap-8 mt-8 pt-6 border-t border-gray-100 justify-center lg:justify-start">
                          {[
                            { value: "2,500+", label: "Clients" },
                            { value: "15 Yrs", label: "Experience" },
                            { value: "100%", label: "Genuine" },
                          ].map((stat) => (
                            <div key={stat.label} className="flex flex-col items-center lg:items-start">
                              <span className="text-[#0b1d3d] font-black text-lg leading-none">{stat.value}</span>
                              <span className="text-gray-400 text-[9px] font-bold uppercase tracking-widest mt-1">{stat.label}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="hidden lg:block lg:w-[62%] xl:w-[64%] order-2 relative self-stretch min-h-0 overflow-hidden bg-white">
                  <BannerImagePanel slide={slide} idx={idx} className="absolute inset-0" />
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div className="absolute bottom-0 left-0 right-0 z-40 flex items-center justify-between px-5 sm:px-8 lg:px-12 xl:px-16 py-3 bg-white/90 backdrop-blur-sm border-t border-gray-100">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => swiperRef.current?.slidePrev()} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#0b1d3d] hover:border-[#0b1d3d] hover:bg-gray-50 transition-all" aria-label="Previous slide">
            <FiChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5">
            {slides.map((_, i) => (
              <button key={i} type="button" onClick={() => swiperRef.current?.slideToLoop(i)} className={`rounded-full transition-all duration-400 ${active === i ? "w-6 h-1.5 bg-[#ED1C24]" : "w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400"}`} aria-label={`Go to slide ${i + 1}`} />
            ))}
          </div>
          <button type="button" onClick={() => swiperRef.current?.slideNext()} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#0b1d3d] hover:border-[#0b1d3d] hover:bg-gray-50 transition-all" aria-label="Next slide">
            <FiChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2 font-black tracking-[0.15em] text-[11px]">
          <span className="text-[#ED1C24]">{String(active + 1).padStart(2, "0")}</span>
          <span className="w-5 h-px bg-gray-200" />
          <span className="text-gray-300">{String(slides.length).padStart(2, "0")}</span>
        </div>
      </div>

      <style>{`
        .hero-swiper { width: 100%; }
        .hero-swiper .swiper-wrapper { align-items: stretch; }
        .hero-swiper .swiper-slide { height: auto !important; }

        @media (min-width: 1024px) {
          .hero-slide-inner {
            height: calc(100vh - 160px);
            min-height: 480px;
            max-height: 720px;
          }
        }
      `}</style>
    </section>
  );
};

export default HomeHeroBanner;

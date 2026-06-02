import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import Image from 'next/image';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const HeroSlider = ({ onBookServices }) => {
    const slides = [
        {
            id: 1,
            image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2000',
            title: 'WE NOT JUST\nPROMISE, BUT WE\nDELIVER!',
            subtitle: 'INDIAN LITHIUM-ION BATTERY MANUFACTURER &\nRAW-MATERIAL SUPPLIER',
        },
        {
            id: 2,
            image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2000',
            title: 'POWERING\nTHE FUTURE',
            subtitle: 'ADVANCED ENERGY STORAGE SOLUTIONS &\nRELIABLE LITHIUM-ION CELLS',
        },
        {
            id: 3,
            image: 'https://images.unsplash.com/photo-1620802051783-6d0cb37456d2?auto=format&fit=crop&q=80&w=2000',
            title: 'INNOVATION\nTHAT DRIVES',
            subtitle: 'HIGH PERFORMANCE E-MOBILITY BATTERIES &\nSUSTAINABLE TECHNOLOGY',
        }
    ];

    return (
        <div className="relative w-full h-[500px] md:h-[600px] lg:h-[800px]">
            <Swiper
                modules={[Autoplay, EffectFade, Navigation, Pagination]}
                effect="fade"
                speed={1000}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                navigation
                pagination={{
                    clickable: true,
                }}
                loop={true}
                className="w-full h-full"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id} className="relative w-full h-full">
                        <div className="absolute inset-0">
                            <Image
                                src={slide.image}
                                alt={slide.title.replace('\n', ' ')}
                                fill
                                className="object-cover"
                                priority={slide.id === 1}
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10"></div>
                        </div>

                        <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-12 h-full flex items-center">
                            <div className="max-w-4xl">
                                <h1
                                    className="text-white font-extrabold text-5xl sm:text-6xl md:text-7xl lg:text-[80px] leading-[1.1] mb-6 whitespace-pre-line tracking-tight drop-shadow-2xl"
                                >
                                    {slide.title}
                                </h1>
                                <p
                                    className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-wide whitespace-pre-line drop-shadow-lg"
                                >
                                    {slide.subtitle}
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 mt-10">
                                    <a
                                        href="tel:+919717372217"
                                        className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-gradient-to-r from-[#051124] to-[#0b1d3d] hover:from-[#0b1d3d] hover:to-[#162542] text-white font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] transition gap-2 text-lg"
                                    >
                                        Call Us
                                    </a>
                                    {onBookServices && (
                                        <button
                                            onClick={onBookServices}
                                            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-gradient-to-r from-[#051124] to-[#0b1d3d] hover:from-[#0b1d3d] hover:to-[#162542] text-white font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] transition gap-2 text-lg"
                                        >
                                            Book Our Services
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: white !important;
          background: rgba(0, 0, 0, 0.5);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          transition: all 0.3s ease;
        }
        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background: rgba(237, 28, 36, 0.9);
        }
        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 20px !important;
          font-weight: bold;
        }
        .swiper-pagination-bullet {
          background: white !important;
          opacity: 0.5;
          width: 12px;
          height: 12px;
        }
        .swiper-pagination-bullet-active {
          opacity: 1;
          background: #ED1C24 !important;
          transform: scale(1.2);
        }
      `}</style>
        </div>
    );
};

export default HeroSlider;

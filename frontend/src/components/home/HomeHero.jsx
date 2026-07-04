import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

const DEFAULT_SCENES = [
  "/hero-indian-pharma.png",
  "/hero-indian-distribution.png",
  "/about-indian-healthcare.png",
];

const getSlideScene = (slide, index) => {
  if (slide?.bgImage) return slide.bgImage;
  if (slide?.heroScene) return slide.heroScene;
  if (slide?.sceneImage) return slide.sceneImage;
  if (slide?.heroImage) return slide.heroImage;
  return DEFAULT_SCENES[index % DEFAULT_SCENES.length];
};

const HomeHero = ({
  slides = [],
  ctaPrimary = { text: "View Full Product Range", link: "/products" },
  ctaSecondary = { text: "Send Enquiry" },
  onEnquiry,
  phone = "+91 99119 72234",
  whatsapp = "919911972234",
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideCount = slides.length;

  const goTo = useCallback(
    (index) => {
      if (!slideCount) return;
      setCurrentSlide((index + slideCount) % slideCount);
    },
    [slideCount],
  );

  const nextSlide = useCallback(() => goTo(currentSlide + 1), [currentSlide, goTo]);
  const prevSlide = useCallback(() => goTo(currentSlide - 1), [currentSlide, goTo]);

  useEffect(() => {
    if (slideCount <= 1) return undefined;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideCount);
    }, 7000);
    return () => clearInterval(timer);
  }, [slideCount]);

  if (!slideCount) return null;

  const slide = slides[currentSlide];

  const headline =
    slide.titleLine1 && slide.titleHighlight
      ? `${slide.titleLine1} ${slide.titleHighlight}${slide.titleLine2 ? ` ${slide.titleLine2}` : "."}`
      : slide.titleText || "Leading Pharmaceutical Wholesale Distributors in India.";

  return (
    <section className="kure-hero-v2" aria-label="Kure Pharma hero">
      <div className="kure-hero-v2__mesh" aria-hidden />

      <div className="kure-container kure-hero-v2__body">
        <div className="kure-hero-v2__main">
          <div className="kure-hero-v2__copy">
            <p className="kure-hero-v2__eyebrow">
              {slide.tagline || "Prescription Medicines · Specialty Pharma"}
            </p>

            <h1 className="kure-hero-v2__title">{headline}</h1>

            <p className="kure-hero-v2__desc">
              {slide.subtitle ||
                "Government-approved pharmaceutical wholesaler supplying hospitals, pharmacies and clinics across India."}
            </p>

            <p className="kure-hero-v2__locations">
              <FiMapPin className="w-3.5 h-3.5 shrink-0" aria-hidden />
              {slide.cities ||
                "Delhi NCR · Mumbai · Lucknow · Kolkata · Chandigarh · Pan-India"}
            </p>

            <div className="kure-hero-v2__cta-row">
              <Link
                href={ctaPrimary.link || "/products"}
                className="kure-hero-v2__cta-primary"
              >
                {ctaPrimary.text || "View Full Product Range"}
                <FiArrowRight className="w-4 h-4" aria-hidden />
              </Link>
              <button
                type="button"
                onClick={onEnquiry}
                className="kure-hero-v2__cta-secondary"
              >
                {ctaSecondary.text || "Send Enquiry"}
              </button>
            </div>

            <div className="kure-hero-v2__contact">
              {phone && (
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="kure-hero-v2__phone">
                  <FiPhone className="w-3.5 h-3.5" aria-hidden />
                  {phone}
                </a>
              )}
              {phone && whatsapp && (
                <span className="kure-hero-v2__contact-dot" aria-hidden />
              )}
              {whatsapp && (
                <a
                  href={`https://wa.me/${whatsapp.replace(/\+/g, '').replace(/\s+/g, '')}?text=Hello%20Kure%20Pharma%2C%20I%20need%20a%20sourcing%20quote.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kure-hero-v2__whatsapp-link"
                >
                  <FaWhatsapp className="w-3.5 h-3.5" aria-hidden />
                  WhatsApp
                </a>
              )}
            </div>
          </div>

          <div className="kure-hero-v2__visual">
            <div className="kure-hero-v2__showcase">
              {slides.map((item, idx) => (
                <img
                  key={idx}
                  src={getSlideScene(item, idx)}
                  alt=""
                  className={`kure-hero-v2__showcase-img ${
                    idx === currentSlide ? "kure-hero-v2__showcase-img--active" : ""
                  }`}
                />
              ))}
              <div className="kure-hero-v2__showcase-shade" aria-hidden />

              {slideCount > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevSlide}
                    className="kure-hero-v2__showcase-btn kure-hero-v2__showcase-btn--prev"
                    aria-label="Previous slide"
                  >
                    <FiChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    className="kure-hero-v2__showcase-btn kure-hero-v2__showcase-btn--next"
                    aria-label="Next slide"
                  >
                    <FiChevronRight className="w-5 h-5" />
                  </button>
                  <div className="kure-hero-v2__dots">
                    {slides.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => goTo(idx)}
                        className={`kure-hero-v2__dot ${
                          currentSlide === idx ? "kure-hero-v2__dot--active" : ""
                        }`}
                        aria-label={`Slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;

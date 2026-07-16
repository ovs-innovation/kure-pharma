import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { kureTherapeuticCategories } from "@utils/kureTherapeuticCategories";
import { THERAPEUTICS_SHOWCASE, isGenericProductImage } from "@utils/indianProductImages";

const MOCKUP_ICONS = {
  "Anti-Cancer Medicines": "/categories/icon-anti-cancer.png",
  "Oncology Drugs": "/categories/icon-oncology.png",
  "Critical Care Medicines": "/categories/icon-critical-care.png",
  "Lifesaving Drugs": "/categories/icon-lifesaving.png",
  "Imported medicine": "/categories/icon-imported.png",
  HIV: "/categories/icon-hiv.png",
  "Nephrology Medicine": "/categories/icon-nephrology.png",
};

const DEFAULTS = Object.fromEntries(
  kureTherapeuticCategories.map((c) => [c.category || c.name, c]),
);

const enrichCategory = (item) => {
  const key = item.category || item.name || item.label;
  const def = DEFAULTS[key] || {};
  return {
    ...def,
    ...item,
    label: item.name || item.label || def.name,
    productCount: item.productCount || def.productCount || "100+",
    textColor: item.textColor || def.textColor || "#1A2E5B",
    bgColor: item.bgColor || def.bgColor || "#f8fafc",
    mockupIcon: MOCKUP_ICONS[key] || def.image,
  };
};

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

const LEGACY_SHOWCASE_IMAGES = new Set(["/products/hertuma.png"]);

const TherapeuticsSection = ({ therapeutics = {} }) => {
  const rawCategories = therapeutics.items?.length
    ? therapeutics.items
    : kureTherapeuticCategories;
  const categories = rawCategories.map(enrichCategory);

  const showcaseImage =
    therapeutics.image &&
    !LEGACY_SHOWCASE_IMAGES.has(therapeutics.image) &&
    !isGenericProductImage(therapeutics.image)
      ? therapeutics.image
      : THERAPEUTICS_SHOWCASE.image;
  const showcaseLabel =
    therapeutics.imageLabel &&
    therapeutics.image &&
    !LEGACY_SHOWCASE_IMAGES.has(therapeutics.image)
      ? therapeutics.imageLabel
      : THERAPEUTICS_SHOWCASE.label;
  const showcaseSubLabel =
    therapeutics.imageSubLabel &&
    therapeutics.image &&
    !LEGACY_SHOWCASE_IMAGES.has(therapeutics.image)
      ? therapeutics.imageSubLabel
      : THERAPEUTICS_SHOWCASE.sublabel;

  return (
    <section className="kther" aria-label="Life-saving therapeutics">
      <div className="kther__glow kther__glow--left" aria-hidden />
      <div className="kther__glow kther__glow--right" aria-hidden />

      <div className="kther__container">
        <div className="kther__layout">
          <motion.div className="kther__copy" {...fade(0)}>
            <p className="kther__eyebrow">
              <span className="kther__eyebrow-line" aria-hidden />
              {therapeutics.badge || "Specialized Distribution"}
              <span className="kther__eyebrow-line" aria-hidden />
            </p>

            <h2 className="kther__title">
              {therapeutics.title || "Comprehensive Range of"}{" "}
              <span className="kther__title-accent">
                {therapeutics.titleHighlight || "Life-Saving"}
              </span>{" "}
              {therapeutics.titleSuffix || "Therapeutics"}
            </h2>

            <p className="kther__desc">
              {therapeutics.description ||
                "We distribute fully authenticated, temperature-controlled specialty medicines sourced directly from trusted global manufacturers to hospitals, pharmacy chains, and clinical networks across India."}
            </p>

            <ul className="kther__highlights">
              <li>Cold-chain biologics & injectables</li>
              <li>CDSCO-licensed wholesale supply</li>
              <li>Pan-India hospital delivery</li>
            </ul>
          </motion.div>

          <motion.div className="kther__showcase-wrap" {...fade(0.08)}>
            <div className="kther__showcase">
              <div className="kther__showcase-badge">Featured Product</div>
              <div className="kther__showcase-media">
                <img
                  src={showcaseImage}
                  alt={showcaseLabel}
                  className="kther__showcase-img"
                  loading="lazy"
                />
              </div>
              <div className="kther__showcase-meta">
                <span className="kther__showcase-brand">{showcaseLabel}</span>
                <span className="kther__showcase-note">{showcaseSubLabel}</span>
              </div>
            </div>
          </motion.div>

          <motion.div className="kther__list" {...fade(0.12)}>
            {categories.map((item, index) => {
              const href = `/products?category=${encodeURIComponent(
                item.category || item.name,
              )}`;

              return (
                <motion.div
                  key={item.category || item.name || item.label}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                >
                  <Link
                    href={href}
                    className="kther__row"
                    style={{
                      "--kther-accent": item.textColor,
                      "--kther-bg": item.bgColor,
                    }}
                  >
                    <span className="kther__row-icon">
                      <img src={item.mockupIcon} alt="" draggable={false} />
                    </span>
                    <span className="kther__row-body">
                      <span className="kther__row-name">{item.label}</span>
                    </span>
                    <FiArrowRight className="kther__row-arrow" aria-hidden />
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TherapeuticsSection;

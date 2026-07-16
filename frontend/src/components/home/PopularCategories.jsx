import Link from "next/link";
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiAward,
  FiHeadphones,
  FiShield,
  FiThermometer,
  FiTruck,
  FiUsers,
} from "react-icons/fi";

const IconHospital = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      d="M4 21V8l8-4 8 4v13M9 21v-6h6v6M12 11v3"
    />
  </svg>
);
import { popularCategoryItems } from "@utils/kureTherapeuticCategories";

const TRUST_BADGES = [
  {
    icon: FiShield,
    iconClass: "kcs-badge__icon--gold",
    title: "CDSCO Compliant",
    sub: "Regulatory approved",
  },
  {
    icon: FiThermometer,
    iconClass: "kcs-badge__icon--blue",
    title: "Cold Chain Logistics",
    sub: "Temperature controlled",
  },
  {
    icon: FiAward,
    iconClass: "kcs-badge__icon--green",
    title: "Quality Assured",
    sub: "100% genuine medicines",
  },
];

const TRUST_BAR = [
  {
    icon: FiTruck,
    title: "Pan India Delivery",
    sub: "Reaching every corner",
  },
  {
    icon: IconHospital,
    title: "250+ Hospital Partners",
    sub: "Trusted by healthcare leaders",
  },
  {
    icon: FiUsers,
    title: "18+ Years Experience",
    sub: "Delivering trust since 2006",
  },
  {
    icon: FiHeadphones,
    title: "Dedicated Support",
    sub: "We're here to help",
  },
];

const MOCKUP_ICONS = {
  "Anti-Cancer Medicines": "/categories/icon-anti-cancer.png",
  "Oncology Drugs": "/categories/icon-oncology.png",
  "Critical Care Medicines": "/categories/icon-critical-care.png",
  "Lifesaving Drugs": "/categories/icon-lifesaving.png",
  "Imported medicine": "/categories/icon-imported.png",
  HIV: "/categories/icon-hiv.png",
  "Nephrology Medicine": "/categories/icon-nephrology.png",
};

const DISPLAY_NAMES = {
  HIV: "HIV Medicines",
  "Imported medicine": "Imported Medicine",
};

const DEFAULTS = Object.fromEntries(
  popularCategoryItems.map((c) => [c.category || c.name, c]),
);

const enrichCategory = (cat) => {
  const key = cat.category || cat.name;
  const def = DEFAULTS[key] || {};
  return {
    ...def,
    ...cat,
    displayName: DISPLAY_NAMES[key] || cat.name || def.name,
    productCount: cat.productCount || def.productCount || "100+",
    textColor: cat.textColor || def.textColor || "#0F2B63",
    bgColor: cat.bgColor || def.bgColor || "#f8fafc",
    mockupIcon: MOCKUP_ICONS[key] || def.image,
  };
};

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

const PopularCategories = ({ items = [] }) => {
  if (!items.length) return null;

  const categories = items.map(enrichCategory);

  return (
    <section className="kcs" aria-label="Pharmaceutical categories">
      <div className="kcs__container">
        <div className="kcs-hero">
          <motion.div className="kcs-hero__copy" {...fade(0)}>
            <p className="kcs__eyebrow">
              Our Specialties
              <span className="kcs__eyebrow-line" aria-hidden />
            </p>
            <h2 className="kcs__title">
              Explore Our Pharmaceutical
              <span className="kcs__title-gold">Categories</span>
            </h2>
            <p className="kcs__desc">
              Discover our comprehensive range of oncology, specialty and
              life-saving medicines trusted by healthcare institutions across
              India.
            </p>

            <ul className="kcs-badges">
              {TRUST_BADGES.map((b) => {
                const Icon = b.icon;
                return (
                  <li key={b.title} className="kcs-badge">
                    <span className={`kcs-badge__icon ${b.iconClass}`}>
                      <Icon strokeWidth={2.2} aria-hidden />
                    </span>
                    <span className="kcs-badge__text">
                      <strong>{b.title}</strong>
                      <span>{b.sub}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </motion.div>

          <motion.div className="kcs-hero__visual" {...fade(0.08)}>
            <img
              src="/categories/hero-scene.png"
              alt="Kure Pharma oncology care products"
              className="kcs-hero__img"
              draggable={false}
            />
          </motion.div>
        </div>

        <div className="kcs__grid">
          {categories.map((cat, i) => {
            const accent = cat.textColor;
            const href = `/products?category=${encodeURIComponent(cat.category || cat.name)}`;

            return (
              <motion.div
                key={cat.category || cat.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
              >
                <Link
                  href={href}
                  className="kcs-card"
                  style={{ "--kcs-accent": accent, "--kcs-bg": cat.bgColor }}
                >
                  <div className="kcs-card__visual">
                    <span className="kcs-card__glow" aria-hidden />
                    <img
                      src={cat.mockupIcon}
                      alt=""
                      className="kcs-card__img"
                      draggable={false}
                    />
                  </div>

                  <h3 className="kcs-card__title">{cat.displayName}</h3>
                  <p className="kcs-card__count">
                    <strong>{cat.productCount}</strong> Products
                  </p>
                  <span className="kcs-card__cta">
                    Explore <FiArrowRight aria-hidden />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div className="kcs-trust" {...fade(0.1)}>
          {TRUST_BAR.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="kcs-trust__item">
                <span className="kcs-trust__icon">
                  <Icon strokeWidth={1.8} aria-hidden />
                </span>
                <span className="kcs-trust__text">
                  <strong>{item.title}</strong>
                  <span>{item.sub}</span>
                </span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default PopularCategories;

import Link from "next/link";
import {
  FiArrowRight,
  FiAward,
  FiHeadphones,
  FiMapPin,
  FiPackage,
  FiPhone,
  FiShield,
  FiTruck,
  FiUsers,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { renderHomepageIcon } from "@utils/homepageIcons";

const DEFAULT_HERO_IMAGE = "/hero-indian-distribution.png";

const DEFAULT_TRUST_ICONS = [
  { icon: FiShield, label: "CDSCO Compliant" },
  { icon: FiTruck, label: "Cold Chain Delivery" },
  { icon: FiAward, label: "Quality Assured" },
  { icon: FiMapPin, label: "Pan-India Network" },
];

const DEFAULT_STATS = [
  { icon: FiUsers, value: "500+", label: "Happy Clients" },
  { icon: FiPackage, value: "10,000+", label: "Products" },
  { icon: FiAward, value: "50+", label: "Top Brands" },
  { icon: FiShield, value: "8+", label: "Years of Trust" },
];

const DEFAULT_FEATURE_CARDS = [
  {
    icon: "FiPackage",
    title: "Wide Range",
    description:
      "Extensive portfolio of oncology, specialty and prescription medicines.",
  },
  {
    icon: "FiTruck",
    title: "Timely Delivery",
    description: "On-time delivery with temperature-controlled logistics.",
  },
  {
    icon: "FiUsers",
    title: "Trusted by Experts",
    description: "Serving hospitals, clinics and pharmacies across India.",
  },
  {
    icon: "FiHeadphones",
    title: "Dedicated Support",
    description: "Responsive support for sourcing, pricing and availability.",
  },
];

const isMedicineProductImage = (url) => {
  if (!url || typeof url !== "string") return false;
  const normalized = url.toLowerCase();
  return (
    normalized.includes("/products/") ||
    normalized.includes("medicine") ||
    normalized.includes("injection") ||
    normalized.includes("oncology_box") ||
    normalized.includes("vial") ||
    normalized.includes("capsule")
  );
};

const getHeroImage = (slide) => {
  const candidates = [
    slide?.bgImage,
    slide?.heroScene,
    slide?.sceneImage,
    slide?.heroImage,
  ];

  const safeImage = candidates.find((url) => url && !isMedicineProductImage(url));
  return safeImage || DEFAULT_HERO_IMAGE;
};

const HomeHero = ({
  slides = [],
  ctaPrimary = { text: "View Full Product Range", link: "/products" },
  ctaSecondary = { text: "Send Enquiry" },
  onEnquiry,
  phone = "+91 99119 72234",
  whatsapp = "919911972234",
  stats = DEFAULT_STATS,
  featureCards = DEFAULT_FEATURE_CARDS,
  qualityBar,
}) => {
  const slide = slides[0] || {};
  const heroImage = getHeroImage(slide);

  const titleLine1 =
    slide.titleLine1 || "Your Trusted Partner in Healthcare.";
  const titleScript = slide.titleHighlight || "Across India.";
  const subtitle =
    slide.subtitle ||
    "CDSCO-compliant sourcing for hospitals, pharmacies and clinics with reliable supply, quality assurance and pan-India delivery.";
  const tagline =
    slide.tagline ||
    "Oncology & Specialty Medicines | Prescription Products";

  const cards =
    qualityBar?.items?.length > 0 ? qualityBar.items : featureCards;

  const cities =
    slide.cities ||
    "Delhi NCR | Mumbai | Lucknow | Kolkata | Chandigarh | & Many More";

  return (
    <section className="kure-hero-exact" aria-label="Kure Pharma hero">
      <div className="kure-container kure-hero-exact__body">
        <div className="kure-hero-exact__main">
          <div className="kure-hero-exact__copy">
            <p className="kure-hero-exact__eyebrow">{tagline}</p>

            <h1 className="kure-hero-exact__title">
              {titleLine1}
              <span className="kure-hero-exact__script">{titleScript}</span>
            </h1>

            <p className="kure-hero-exact__desc">{subtitle}</p>

            <div className="kure-hero-exact__trust-grid">
              {DEFAULT_TRUST_ICONS.map(({ icon: Icon, label }) => (
                <div key={label} className="kure-hero-exact__trust-item">
                  <span className="kure-hero-exact__trust-icon" aria-hidden>
                    <Icon className="w-4 h-4" />
                  </span>
                  <span>{label}</span>
                </div>
              ))}
            </div>

            <div className="kure-hero-exact__cta-row">
              <Link
                href={ctaPrimary.link || "/products"}
                className="kure-hero-exact__cta-primary"
              >
                {ctaPrimary.text || "View Full Product Range"}
                <FiArrowRight className="w-4 h-4" aria-hidden />
              </Link>
              <button
                type="button"
                onClick={onEnquiry}
                className="kure-hero-exact__cta-secondary"
              >
                {ctaSecondary.text || "Send Enquiry"}
              </button>
            </div>

            <div className="kure-hero-exact__contact">
              {phone && (
                <a
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="kure-hero-exact__phone"
                >
                  <FiPhone className="w-3.5 h-3.5" aria-hidden />
                  {phone}
                </a>
              )}
              {phone && whatsapp && (
                <span className="kure-hero-exact__contact-dot" aria-hidden />
              )}
              {whatsapp && (
                <a
                  href={`https://wa.me/${whatsapp.replace(/\+/g, "").replace(/\s+/g, "")}?text=Hello%20Kure%20Pharma%2C%20I%20need%20a%20sourcing%20quote.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kure-hero-exact__whatsapp-link"
                >
                  <FaWhatsapp className="w-3.5 h-3.5" aria-hidden />
                  WhatsApp
                </a>
              )}
            </div>
          </div>

          <div className="kure-hero-exact__visual">
            <div className="kure-hero-exact__showcase">
              <img
                src={heroImage}
                alt="Kure Pharma distribution facility"
                className="kure-hero-exact__showcase-img"
              />
              <div className="kure-hero-exact__stats">
                {stats.map(({ icon: Icon, value, label }) => (
                  <div key={label} className="kure-hero-exact__stat">
                    <span className="kure-hero-exact__stat-icon" aria-hidden>
                      <Icon className="w-4 h-4" />
                    </span>
                    <div>
                      <strong>{value}</strong>
                      <span>{label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {qualityBar?.enabled !== false && cards.length > 0 && (
          <div className="kure-hero-exact__features">
            {cards.map((item) => (
              <div key={item.title} className="kure-hero-exact__feature-card">
                <span className="kure-hero-exact__feature-icon" aria-hidden>
                  {renderHomepageIcon(
                    item.icon,
                    "w-5 h-5 text-[#1A2E5B]",
                  )}
                </span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span className="kure-hero-exact__feature-line" aria-hidden />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="kure-hero-exact__locations">
        <div className="kure-container kure-hero-exact__locations-inner">
          <p className="kure-hero-exact__cities">
            <FiMapPin className="w-3.5 h-3.5 shrink-0" aria-hidden />
            {cities}
          </p>
          <p className="kure-hero-exact__tagline">
            <span className="kure-hero-exact__handshake" aria-hidden>
              🤝
            </span>
            Building healthier tomorrows,{" "}
            <em className="kure-hero-exact__script-inline">together.</em>
          </p>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;

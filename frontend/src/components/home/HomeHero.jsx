import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiAward,
  FiCheck,
  FiMail,
  FiPhone,
  FiShield,
  FiThermometer,
  FiGlobe,
  FiZap,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { renderHomepageIcon } from "@utils/homepageIcons";
import HeroPremiumVisual from "@components/home/HeroPremiumVisual";
import kureHomepageDefaults from "@utils/kureHomepageDefaults";

const defaultSlide = kureHomepageDefaults.hero.slides[0] || {};

const TRUST_BADGES = [
  { icon: FiShield, label: "CDSCO Certified" },
  { icon: FiAward, label: "GDP Compliant" },
  { icon: FiThermometer, label: "Cold Chain Logistics" },
  { icon: FiCheck, label: "ISO Certified" },
  { icon: FiGlobe, label: "Pan India Delivery" },
];

const FEATURE_CARDS = [
  {
    icon: "FiPackage",
    title: "Wide Product Portfolio",
    description:
      "Comprehensive oncology & specialty therapeutics sourced from verified global manufacturers.",
  },
  {
    icon: "FiTruck",
    title: "Temperature Controlled Logistics",
    description:
      "GDP-compliant cold chain with real-time monitoring across every delivery corridor.",
  },
  {
    icon: "FiUsers",
    title: "Trusted by Oncology Experts",
    description:
      "Preferred partner for cancer centres, hospitals and government institutions nationwide.",
  },
  {
    icon: "FiHeadphones",
    title: "24×7 Dedicated Support",
    description:
      "Round-the-clock pharmaceutical support for urgent procurement and clinical needs.",
  },
];

const CERT_STRIP = [
  "CDSCO Registered",
  "GDP Compliant",
  "ISO 9001:2015",
  "Cold Chain Certified",
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
});

const HomeHero = ({
  slides = [],
  ctaPrimary = { text: "Explore Products", link: "/products" },
  ctaSecondary = { text: "Request Quote" },
  onEnquiry,
  phone = "+91 99119 72234",
  whatsapp = "919911972234",
  email = "info@kurepharma.com",
  qualityBar,
}) => {
  const heroRef = useRef(null);
  const slide = { ...defaultSlide, ...(slides[0] || {}) };
  const showFeatures = qualityBar?.enabled !== false;
  const cards = qualityBar?.items?.length ? qualityBar.items : FEATURE_CARDS;

  const phoneHref = phone ? `tel:${phone.replace(/\s+/g, "")}` : null;
  const waHref = whatsapp
    ? `https://wa.me/${whatsapp.replace(/\+/g, "").replace(/\s+/g, "")}?text=Hello%20Kure%20Pharma%2C%20I%20need%20a%20sourcing%20quote.`
    : null;

  return (
    <section className="khp" aria-label="Kure Pharma hero" ref={heroRef}>
      {/* Background system */}
      <div className="khp__bg" aria-hidden>
        <div className="khp__bg-gradient" />
        <div className="khp__bg-dots" />
        <div className="khp__bg-radial khp__bg-radial--gold" />
        <div className="khp__bg-radial khp__bg-radial--blue" />
        {[...Array(8)].map((_, i) => (
          <motion.span
            key={i}
            className="khp__bg-particle"
            style={{ left: `${10 + i * 11}%`, top: `${15 + ((i * 17) % 70)}%` }}
            animate={{ y: [0, -20, 0], opacity: [0.15, 0.45, 0.15] }}
            transition={{
              duration: 6 + i * 0.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
          />
        ))}
      </div>

      <div className="khp__container">
        <div className="khp__split">
          {/* LEFT — Content */}
          <div className="khp__left">
            <motion.p className="khp__eyebrow" {...fadeUp(0)}>
              {slide.tagline ||
                "Oncology & Specialty Medicines · Prescription Products"}
            </motion.p>

            <motion.h1 className="khp__title" {...fadeUp(0.08)}>
              Leading <span className="khp__gold">Oncology</span>
              {" & Specialty Medicine"}
              <br />
              Distributor Across <span className="khp__gold">India</span>
            </motion.h1>

            <motion.p className="khp__subtitle" {...fadeUp(0.16)}>
              Serving Hospitals, Clinics, Cancer Centres &amp; Government
              Institutions with CDSCO compliant cold-chain pharmaceutical
              distribution.
            </motion.p>

            {/* Trust badges */}
            <motion.div className="khp__trust" {...fadeUp(0.24)}>
              {TRUST_BADGES.map(({ icon: Icon, label }) => (
                <div key={label} className="khp__trust-item">
                  <span className="khp__trust-icon">
                    <Icon strokeWidth={2.2} />
                  </span>
                  <span className="khp__trust-label">{label}</span>
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div className="khp__cta-row" {...fadeUp(0.32)}>
              <Link
                href={ctaPrimary.link || "/products"}
                className="khp__btn khp__btn--primary"
              >
                {ctaPrimary.text || "Explore Products"}
                <FiArrowRight className="khp__btn-arrow" aria-hidden />
              </Link>
              <button
                type="button"
                onClick={onEnquiry}
                className="khp__btn khp__btn--secondary"
              >
                {ctaSecondary.text || "Request Quote"}
                <span className="khp__btn-arrow-wrap" aria-hidden>
                  <FiArrowRight className="khp__btn-arrow khp__btn-arrow--secondary" />
                </span>
              </button>
            </motion.div>

            {/* Contact strip */}
            <motion.div className="khp__contact" {...fadeUp(0.38)}>
              {phoneHref && (
                <a href={phoneHref} className="khp__contact-link">
                  <FiPhone aria-hidden />
                  {phone}
                </a>
              )}
              {waHref && (
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="khp__contact-link khp__contact-link--wa"
                >
                  <FaWhatsapp aria-hidden />
                  WhatsApp
                </a>
              )}
              <a href={`mailto:${email}`} className="khp__contact-link">
                <FiMail aria-hidden />
                {email}
              </a>
              <span className="khp__contact-badge">
                <FiZap aria-hidden />
                Quick Response
              </span>
            </motion.div>

            {/* Certification strip */}
            <motion.div className="khp__cert" {...fadeUp(0.5)}>
              {CERT_STRIP.map((cert, i) => (
                <span key={cert} className="khp__cert-item">
                  {i > 0 && <span className="khp__cert-dot" aria-hidden />}
                  {cert}
                </span>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — Visual */}
          <motion.div className="khp__right" {...fadeUp(0.2)}>
            <HeroPremiumVisual trackRef={heroRef} />
          </motion.div>
        </div>

        {/* Feature cards */}
        {showFeatures && cards.length > 0 && (
          <motion.div
            className="khp__features"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {cards.map((item) => (
              <motion.div
                key={item.title}
                className="khp-feature"
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
              >
                <span className="khp-feature__icon">
                  {renderHomepageIcon(item.icon, "w-5 h-5")}
                </span>
                <h3 className="khp-feature__title">{item.title}</h3>
                <p className="khp-feature__desc">{item.description}</p>
                <span className="khp-feature__line" aria-hidden />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default HomeHero;

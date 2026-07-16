import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ProductEnquiryModal from "@components/modal/ProductEnquiryModal";
import {
  kurePharmaServices,
  kureServiceTourCities,
  kureServiceProcess,
  kureServiceHighlights,
} from "@utils/kureServicesData";
import {
  FiArrowRight,
  FiChevronRight,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

const generalEnquiryProduct = {
  _id: "general",
  name: "General Sourcing Enquiry",
  shortDescription:
    "Tell us what medicines you need — our team responds within 24 hours.",
};

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] },
});

const ServicesPageContent = () => {
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  return (
    <div className="ksv">
      <section className="ksv-banner">
        <div
          className="ksv-banner__bg"
          style={{ backgroundImage: "url(/hero-indian-distribution.png)" }}
          aria-hidden
        />
        <div className="ksv-banner__overlay" aria-hidden />
        <div className="ksv-banner__glow" aria-hidden />
        <div className="ksv-wrap ksv-banner__inner">
          <nav className="ksv-crumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <FiChevronRight aria-hidden />
            <span>Services</span>
          </nav>

          <motion.div className="ksv-banner__body" {...fade(0)}>
            <p className="ksv-banner__tag">Kure Pharma · Bharat</p>
            <h1 className="ksv-banner__title">
              Therapeutic Supply
              <span>Services Across India</span>
            </h1>
            <p className="ksv-banner__lead">
              CDSCO-compliant oncology, critical care and specialty distribution
              with cold chain logistics for hospitals and pharmacies.
            </p>
            <div className="ksv-banner__actions">
              <button
                type="button"
                onClick={() => setEnquiryOpen(true)}
                className="ksv-btn ksv-btn--gold"
              >
                Send Enquiry <FiArrowRight aria-hidden />
              </button>
              <Link href="/products" className="ksv-btn ksv-btn--ghost">
                Browse Products
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="ksv-wrap ksv-stats-wrap">
        <motion.div className="ksv-stats" {...fade(0.06)}>
          {kureServiceHighlights.map((item) => (
            <div key={item.label} className="ksv-stats__cell">
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <section className="ksv-main">
        <div className="ksv-wrap">
          <motion.header className="ksv-head" {...fade(0)}>
            <p className="ksv-head__eyebrow">
              <span aria-hidden />
              What We Offer
              <span aria-hidden />
            </p>
            <h2 className="ksv-head__title">
              Pharmaceutical Distribution
              <em>Services</em>
            </h2>
            <p className="ksv-head__sub">
              End-to-end wholesale and distribution trusted by healthcare
              institutions since 2016.
            </p>
          </motion.header>

          <div className="ksv-cards">
            {kurePharmaServices.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
              >
                <Link
                  href={service.href}
                  className="ksv-card"
                  style={{
                    "--ksv-accent": service.color,
                    "--ksv-bg": service.bg,
                  }}
                >
                  <div className="ksv-card__media">
                    <img
                      src={service.image}
                      alt=""
                      className="ksv-card__img"
                      draggable={false}
                    />
                  </div>
                  <div className="ksv-card__body">
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                    <ul className="ksv-card__features">
                      {service.features.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                    <span className="ksv-card__link">
                      View service <FiArrowRight aria-hidden />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div className="ksv-process" {...fade(0.08)}>
            <div className="ksv-process__head">
              <h3>How It Works</h3>
              <p>From enquiry to delivery in four simple steps</p>
            </div>
            <div className="ksv-process__track">
              {kureServiceProcess.map((step, i) => (
                <div key={step.step} className="ksv-process__item">
                  <span className="ksv-process__num">{step.step}</span>
                  <h4>{step.title}</h4>
                  <p>{step.description}</p>
                  {i < kureServiceProcess.length - 1 && (
                    <span className="ksv-process__connector" aria-hidden />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div className="ksv-network" {...fade(0.1)}>
            <div className="ksv-network__label">
              <FiMapPin aria-hidden />
              <span>Pan-India delivery network</span>
            </div>
            <div className="ksv-network__chips">
              {kureServiceTourCities.map((city) => (
                <span
                  key={city.city}
                  className={`ksv-network__chip ${city.hub ? "ksv-network__chip--hub" : ""}`}
                >
                  {city.city}
                  {city.hub && <small>Hub</small>}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div className="ksv-cta" {...fade(0.12)}>
            <div className="ksv-cta__copy">
              <p className="ksv-cta__tag">Get Started</p>
              <h3>Need Medicine Sourcing Assistance?</h3>
              <p>
                Call us or send an enquiry — we respond within 24 hours with
                availability and pricing.
              </p>
            </div>
            <div className="ksv-cta__btns">
              <a href="tel:+919911972234" className="ksv-btn ksv-btn--navy">
                <FiPhone aria-hidden /> +91 99119 72234
              </a>
              <a
                href="https://wa.me/919911972234?text=Hello%20Kure%20Pharma%2C%20I%20need%20medicine%20sourcing%20help."
                target="_blank"
                rel="noopener noreferrer"
                className="ksv-btn ksv-btn--whatsapp"
              >
                <FaWhatsapp aria-hidden /> WhatsApp
              </a>
              <button
                type="button"
                onClick={() => setEnquiryOpen(true)}
                className="ksv-btn ksv-btn--gold"
              >
                Send Enquiry <FiArrowRight aria-hidden />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <ProductEnquiryModal
        modalOpen={enquiryOpen}
        setModalOpen={setEnquiryOpen}
        product={generalEnquiryProduct}
      />
    </div>
  );
};

export default ServicesPageContent;

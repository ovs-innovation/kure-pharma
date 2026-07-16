import { useState } from "react";
import Link from "next/link";
import PageHero from "@components/ui/PageHero";
import SectionHeader from "@components/ui/SectionHeader";
import ProductEnquiryModal from "@components/modal/ProductEnquiryModal";
import {
  IconAwarenessRibbon,
  IconCriticalCare,
  IconHivRibbon,
  IconImported,
} from "@components/home/CategoryTherapyIcons";
import {
  kurePharmaServices,
  kureServiceTourCities,
  kureServiceProcess,
  kureServiceHighlights,
} from "@utils/kureServicesData";
import {
  FiArrowRight,
  FiCheckCircle,
  FiGlobe,
  FiMapPin,
  FiPhone,
  FiShield,
  FiTruck,
  FiUsers,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

const SERVICE_ICONS = {
  ribbon: IconAwarenessRibbon,
  truck: FiTruck,
  hospital: FiUsers,
  heart: IconCriticalCare,
  globe: IconImported,
  shield: IconHivRibbon,
};

const generalEnquiryProduct = {
  _id: "general",
  name: "General Sourcing Enquiry",
  shortDescription: "Tell us what medicines you need — our team responds within 24 hours.",
};

const ServicesPageContent = () => {
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  return (
    <>
      <PageHero
        breadcrumb="Services"
        title="Therapeutic Supply"
        highlight="Services Across India"
        subtitle="From oncology and critical care to imported specialty medicines — CDSCO-compliant sourcing with cold chain delivery to hospitals and pharmacies nationwide."
        bgImage="/hero-indian-distribution.png"
      >
        <div className="flex flex-wrap gap-3 mt-6">
          <button
            type="button"
            onClick={() => setEnquiryOpen(true)}
            className="kure-btn kure-btn-navy !text-xs !py-3 !px-5"
          >
            Send Enquiry <FiArrowRight className="w-4 h-4" />
          </button>
          <Link href="/products" className="kure-btn kure-btn-outline !text-xs !py-3 !px-5 !bg-white/10 !text-white !border-white/30 hover:!bg-white hover:!text-[#1A2E5B]">
            Browse Products
          </Link>
        </div>
      </PageHero>

      <section className="relative z-20 -mt-10">
        <div className="kure-nav-container">
          <div className="kure-services-stats">
            {kureServiceHighlights.map((item) => (
              <div key={item.label} className="kure-services-stats__item">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="kure-section kure-section-cream">
        <div className="kure-nav-container">
          <SectionHeader
            eyebrow="What We Offer"
            title="Complete Pharmaceutical Distribution Services"
            subtitle="Trusted wholesale and distribution for hospitals, clinics and pharmacies — since 2016."
          />
          <div className="kure-services-grid">
            {kurePharmaServices.map((service) => {
              const Icon = SERVICE_ICONS[service.icon] || FiShield;
              return (
                <article
                  key={service.id}
                  className="kure-services-card"
                  style={{ "--service-color": service.color, "--service-bg": service.bg }}
                >
                  <span className="kure-services-card__icon" aria-hidden>
                    <Icon className="w-6 h-6" />
                  </span>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <ul className="kure-services-card__list">
                    {service.features.map((feature) => (
                      <li key={feature}>
                        <FiCheckCircle className="w-3.5 h-3.5 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="kure-section kure-section-white">
        <div className="kure-nav-container">
          <SectionHeader
            eyebrow="Pan-India Network Tour"
            title="Serving Healthcare Partners Across Bharat"
            subtitle="Our distribution network covers major cities and extends to hospitals and pharmacies nationwide."
          />
          <div className="kure-services-tour">
            <div className="kure-services-tour__map">
              <div className="kure-services-tour__map-glow" aria-hidden />
              <FiGlobe className="kure-services-tour__globe" aria-hidden />
              <p className="kure-services-tour__map-label">Pan-India Coverage</p>
              <div className="kure-services-tour__dots" aria-hidden>
                <span /><span /><span /><span /><span />
              </div>
            </div>
            <div className="kure-services-tour__cities">
              {kureServiceTourCities.map((item) => (
                <div
                  key={item.city}
                  className={`kure-services-tour__city ${item.hub ? "kure-services-tour__city--hub" : ""}`}
                >
                  <div className="kure-services-tour__city-head">
                    <FiMapPin className="w-4 h-4 shrink-0" />
                    <strong>{item.city}</strong>
                    {item.hub && <span className="kure-services-tour__hub-badge">Hub</span>}
                  </div>
                  <p>{item.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="kure-section kure-section-cream">
        <div className="kure-nav-container">
          <SectionHeader
            eyebrow="How It Works"
            title="Simple, Reliable Sourcing Process"
            subtitle="From enquiry to delivery — transparent steps at every stage."
          />
          <div className="kure-services-process">
            {kureServiceProcess.map((step, index) => (
              <div key={step.step} className="kure-services-process__item">
                <span className="kure-services-process__step">{step.step}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                {index < kureServiceProcess.length - 1 && (
                  <span className="kure-services-process__line" aria-hidden />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="kure-section-navy py-14 lg:py-16">
        <div className="kure-nav-container kure-services-cta">
          <div>
            <span className="kure-eyebrow !text-[#FF9933]">Get Started</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-2 mb-3">
              Need Medicine Sourcing Assistance?
            </h2>
            <p className="text-white/75 text-base max-w-xl">
              Call us or send an enquiry — our team responds within 24 hours with availability and pricing.
            </p>
          </div>
          <div className="kure-services-cta__actions">
            <a href="tel:+919911972234" className="kure-btn bg-white text-[#1A2E5B] hover:bg-[#FFF9F0]">
              <FiPhone className="w-4 h-4" /> +91 99119 72234
            </a>
            <a
              href="https://wa.me/919911972234?text=Hello%20Kure%20Pharma%2C%20I%20need%20medicine%20sourcing%20help."
              target="_blank"
              rel="noopener noreferrer"
              className="kure-btn bg-[#25D366] text-white hover:bg-[#20ba5a]"
            >
              <FaWhatsapp className="w-4 h-4" /> WhatsApp
            </a>
            <button
              type="button"
              onClick={() => setEnquiryOpen(true)}
              className="kure-btn kure-btn-maroon cursor-pointer"
            >
              Send Enquiry <FiArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <ProductEnquiryModal
        modalOpen={enquiryOpen}
        setModalOpen={setEnquiryOpen}
        product={generalEnquiryProduct}
      />
    </>
  );
};

export default ServicesPageContent;

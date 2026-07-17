import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiChevronRight,
  FiCheckCircle,
  FiShield,
  FiTarget,
  FiEye,
  FiTruck,
  FiAward,
  FiActivity,
  FiPackage,
  FiStar,
  FiUsers,
  FiHeart,
} from "react-icons/fi";
import Layout from "@layout/Layout";
import PageHero from "@components/ui/PageHero";
import useUtilsFunction from "@hooks/useUtilsFunction";
import ProductServices from "@services/ProductServices";
import { getProductImageSrc } from "@utils/productImage";

/* ─── Brand tokens ────────────────────────────────────────
   navy   : #1A2E5B  (deep traditional navy — like classic Indian pharma letterheads)
   maroon : #8B1A2E  (rich burgundy-maroon)
   gold   : #B8860B  (antique dark gold)
   cream  : #FFF9F0  (warm ivory — old parchment feel)
   ──────────────────────────────────────────────────────── */

const NAVY   = "#1A2E5B";
const MAROON = "#8B1A2E";
const GOLD   = "#B8860B";
const CREAM  = "#FFF9F0";

const FALLBACK_PRODUCTS = [
  { title: { en: "Midostar" }, description: { en: "Indicated for newly diagnosed acute myeloid leukemia (AML) that is FLT3 mutation-positive, in combination with standard induction and consolidation chemotherapy." }, slug: "midostar", image: ["/products/capsule_bottle.png"], manufacturer: "Zydus" },
  { title: { en: "Intazumab" }, description: { en: "HER2-targeted therapy for metastatic breast cancer, used in combination with trastuzumab and docetaxel." }, slug: "intazumab", image: ["/products/injection_vial.png"], manufacturer: "Intas" },
  { title: { en: "Ibruzee" }, description: { en: "Used for treating patients with Mantle Cell Lymphoma (MCL), Chronic Lymphocytic Leukemia (CLL), and Waldenstrom's." }, slug: "ibruzee", image: ["/products/targeted_therapy_pack.png"], manufacturer: "Zee Laboratories" },
  { title: { en: "Somalinx LAR" }, description: { en: "Long-acting release suspension for severe diarrhea and flushing episodes associated with metastatic carcinoid tumors." }, slug: "somalinx-lar", image: ["/products/critical_care_injection.png"], manufacturer: "Emcure" },
  { title: { en: "Mediopa" }, description: { en: "Alkylating agent indicated to reduce the risk of graft rejection when used in conjunction with high-dose chemotherapy." }, slug: "mediopa", image: ["/products/injection_vial.png"], manufacturer: "Oncology Division" },
  { title: { en: "Tucanat" }, description: { en: "Oral tyrosine kinase inhibitor indicated in combination with trastuzumab and capecitabine for advanced breast cancer." }, slug: "tucanat", image: ["/products/targeted_therapy_pack.png"], manufacturer: "Natco" },
];

const AboutUsRedesign = () => {
  const [activeTab, setActiveTab] = useState("story");
  const [products, setProducts] = useState([]);
  const { showingTranslateValue } = useUtilsFunction();

  useEffect(() => {
    ProductServices.getAllProducts({ limit: 6 })
      .then((res) => {
        if (res && Array.isArray(res.products) && res.products.length > 0) {
          setProducts(res.products);
        } else {
          setProducts(FALLBACK_PRODUCTS);
        }
      })
      .catch((err) => {
        console.error("Failed to load products in About Us:", err);
        setProducts(FALLBACK_PRODUCTS);
      });
  }, []);

  return (
    <Layout
      title="About Us - Kure Pharma | Premium Pharmaceutical Distributor"
      description="Established in 2016, Kure Pharma is a trusted trader, wholesaler, distributor, and retailer of pharmaceutical tablets, injectables, anti-cancer, oncology, critical care, and specialty medicines under Mr. Hitesh Sharma."
    >
      <PageHero
        breadcrumb="About Us"
        title="About"
        highlight="Kure Pharma"
        subtitle="Established in 2016 under the visionary leadership of Mr. Hitesh Sharma, Kure Pharma stands as a trusted benchmark in pharmaceutical distribution, delivering authentic oncology, critical care, and lifesaving medicines across India."
        bgImage="/about-hero-indian.png"
      />
      {/* ── 2. STATS CARD ── */}
      <section className="relative z-20 -mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="kure-card p-8 sm:p-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { count: "9+ Years",  label: "Industry Legacy",      desc: "Delivering trust since 2016",        icon: FiAward,   iconColor: GOLD,   bg: "#FFFBEE" },
            { count: "500+",      label: "Specialty Medicines",   desc: "Oncology, ICU & Critical care",     icon: FiPackage, iconColor: NAVY,   bg: "#EEF0F8" },
            { count: "1000+",     label: "Partners Sourced",      desc: "Hospitals & retail pharmacies",     icon: FiUsers,   iconColor: MAROON, bg: "#F8EEEE" },
            { count: "100%",      label: "Genuine Products",      desc: "Direct manufacturer sourcing",      icon: FiShield,  iconColor: NAVY,   bg: "#EEF0F8" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: item.bg, color: item.iconColor }}
              >
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-gray-900 leading-tight" style={{ color: NAVY }}>{item.count}</div>
                <div className="text-xs font-bold text-gray-600 mt-0.5">{item.label}</div>
                <div className="text-[10px] text-gray-400 font-medium mt-0.5">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. STORY SECTION ── */}
      <section className="py-20 lg:py-28 relative overflow-hidden" style={{ background: CREAM }}>
        {/* subtle watermark-like ornament */}
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-72 h-72 opacity-[0.03] pointer-events-none select-none text-[20rem] font-black leading-none"
          style={{ color: NAVY }}
        >
          K
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

            {/* Left image */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div
                className="relative rounded-2xl overflow-hidden shadow-2xl max-w-sm sm:max-w-md w-full"
                style={{ border: `6px solid white`, boxShadow: `0 20px 60px rgba(26,46,91,0.18)` }}
              >
                <img
                  src="/about-indian-healthcare.png"
                  alt="Kure Pharma Corporate Operations"
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
                <div className="absolute inset-0 flex flex-col justify-end p-8 text-white" style={{ background: "linear-gradient(to top, rgba(26,46,91,0.85) 0%, transparent 60%)" }}>
                  <span
                    className="text-[9px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-full self-start border"
                    style={{ color: "#D4A831", borderColor: "#D4A831", background: "rgba(180,134,11,0.15)" }}
                  >
                    Kure Pharma
                  </span>
                  <h4 className="text-lg font-black leading-snug">Delivering Critical Healthcare Everywhere</h4>
                  <p className="text-white/75 text-xs font-semibold mt-1">Sourcing authentic oncology and specialty drugs pan-India.</p>
                </div>
              </div>

              {/* Badge */}
              <div
                className="absolute -bottom-5 -right-5 text-white rounded-xl shadow-lg px-5 py-4 flex flex-col items-center z-20"
                style={{ background: MAROON }}
              >
                <span className="text-2xl font-black leading-none">9+</span>
                <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5" style={{ color: "#F5C6C6" }}>Yrs Trust</span>
              </div>
            </div>

            {/* Right tabs */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <div
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 mb-5 rounded-sm text-[10px] font-black uppercase tracking-[0.2em]"
                  style={{ background: "#F5EDD5", color: GOLD, borderLeft: `3px solid ${GOLD}` }}
                >
                  <FiStar className="w-3 h-3" />
                  Leadership &amp; Legacy
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight" style={{ color: NAVY }}>
                  About{" "}
                  <span style={{ color: MAROON }}>Kure Pharma</span>
                </h2>
              </div>

              {/* Tab buttons */}
              <div className="flex gap-2 flex-wrap border-b border-gray-200 pb-4">
                {[
                  { id: "story",     icon: FiActivity, title: "Our Story"           },
                  { id: "approach",  icon: FiPackage,  title: "Logistics"            },
                  { id: "guarantee", icon: FiShield,   title: "Authenticity Pledge"  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold cursor-pointer transition-all duration-200"
                    style={
                      activeTab === tab.id
                        ? { background: NAVY, color: "white", borderRadius: "6px", boxShadow: "0 4px 12px rgba(26,46,91,0.25)" }
                        : { background: "white", color: "#4b5563", border: "1px solid #e5e7eb", borderRadius: "6px" }
                    }
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.title}</span>
                  </button>
                ))}
              </div>

              {/* Tab body */}
              <div className="min-h-[220px]">
                <AnimatePresence mode="wait">
                  {activeTab === "story" && (
                    <motion.div
                      key="story"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-black" style={{ color: NAVY }}>Our History &amp; Leadership</h3>
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-medium">
                        Established in 2016 under the visionary leadership of <strong>Mr. Hitesh Sharma</strong>, Kure Pharma has developed into a premier name in the pharmaceutical distribution sector across India. Over the last nine years, our organization has specialized in the sourcing and distribution of highly critical medical formulations, serving as a vital link in the healthcare supply chain. We operate as a trusted Wholesaler, Distributor, Supplier, and Retailer of critical life-saving drugs, including specialized Oncology/Anti-Cancer drugs, ICU Injectables, Nephrology formulations, HIV therapeutics, and approved specialty imported medicines.
                      </p>
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-medium">
                        Under the strategic guidance of Mr. Hitesh Sharma, we have built strong, direct partnerships with leading CDSCO-compliant manufacturers and authorized importers. This enables us to maintain a reliable inventory of fully authenticated, high-quality pharmaceutical products at competitive price points. Our operations are governed by a strict quality assurance protocol, ensuring that every batch of critical medicine we distribute is backed by proper verification and batch analysis certification.
                      </p>
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-medium">
                        Recognizing the highly sensitive nature of specialty pharmaceuticals, Kure Pharma has integrated state-of-the-art cold-chain logistics and GDP-compliant shipping networks. This ensures that temperature-sensitive injections and biologics maintain their absolute potency and bio-structure from procurement to final destination. Today, we proudly support a vast network of corporate hospitals, regional clinics, retail pharmacies, and distributors, keeping patient safety and immediate accessibility at the heart of our mission.
                      </p>
                    </motion.div>
                  )}
                  {activeTab === "approach" && (
                    <motion.div
                      key="approach"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-black" style={{ color: NAVY }}>Timely Delivery &amp; Cold-Chain Logistics</h3>
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-medium">
                        We employ strict cold-chain management and verified shipping channels to preserve the potency and bio-structure of delicate injectable solutions and oncology drugs.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                        {[
                          "Real-time temperature tracking & storage",
                          "Hassle-free shipping across Pan-India",
                          "Experienced medical product packaging",
                          "Verified logistics partners & networks",
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs font-bold text-gray-700">
                            <FiCheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: MAROON }} />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  {activeTab === "guarantee" && (
                    <motion.div
                      key="guarantee"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-black" style={{ color: NAVY }}>Zero Tolerance for Counterfeit Drugs</h3>
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-medium">
                        Every product is backed by batch analysis certificates, direct sourcing trails, and strict laboratory controls. Your patients&apos; safety is Kure Pharma&apos;s highest priority.
                      </p>
                      <div className="flex flex-wrap gap-4 mt-6">
                        <div className="flex items-center gap-2 px-4 py-3 rounded-lg border" style={{ background: "#F8EEEE", borderColor: `${MAROON}30` }}>
                          <FiShield className="w-5 h-5 flex-shrink-0" style={{ color: MAROON }} />
                          <span className="text-[11px] font-black uppercase tracking-wide" style={{ color: MAROON }}>100% Genuine</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-3 rounded-lg border" style={{ background: "#FFFBEE", borderColor: `${GOLD}40` }}>
                          <FiAward className="w-5 h-5 flex-shrink-0" style={{ color: GOLD }} />
                          <span className="text-[11px] font-black uppercase tracking-wide" style={{ color: GOLD }}>FDA Approved Brands</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. TIMELINE ── */}
      <section className="py-20 lg:py-24 bg-white border-y border-gray-100 relative overflow-hidden">
        {/* gold thin top accent */}
        <div className="absolute top-0 left-1/4 right-1/4 h-px" style={{ background: GOLD }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <span
              className="inline-block px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] border"
              style={{ color: GOLD, borderColor: GOLD, background: "#FFFBEE" }}
            >
              Our Milestones
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
              The Growth of <span style={{ color: MAROON }}>Kure Pharma</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="hidden md:block absolute top-7 left-[12%] right-[12%] h-px" style={{ background: `linear-gradient(90deg, ${NAVY}, ${MAROON})`, opacity: 0.25 }} />

            {[
              { year: "2016", title: "Kure Pharma Founded",        desc: "Established operations in Delhi NCR region, setting up strong trader connections." },
              { year: "2019", title: "Pan-India Expansion",        desc: "Registered supplies for leading corporate hospitals and regional pharmacy chains."  },
              { year: "2022", title: "Cold-Chain Integration",     desc: "Implemented advanced refrigeration capabilities for sensitive oncology injectables." },
              { year: "2026", title: "Digitized Supply Ecosystem", desc: "Launched dynamic digital catalogs for fast sourcing of lifesaving & specialty drugs." },
            ].map((m, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative z-10 flex flex-col items-center text-center space-y-4 hover:shadow-md transition-all duration-300"
                style={{ borderTop: `3px solid ${idx % 2 === 0 ? NAVY : MAROON}` }}
              >
                <div
                  className="w-14 h-14 rounded-full text-white flex items-center justify-center font-black text-sm shadow"
                  style={{ background: idx % 2 === 0 ? NAVY : MAROON }}
                >
                  {m.year}
                </div>
                <h4 className="font-black text-gray-900 text-sm">{m.title}</h4>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. PRODUCT PORTFOLIO ── */}
      <section className="py-20 lg:py-28" style={{ background: CREAM }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <span
              className="inline-block px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] border"
              style={{ color: MAROON, borderColor: MAROON, background: "#F8EEEE" }}
            >
              Our Sourcing Portfolios
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight" style={{ color: NAVY }}>
              Products We Deliver <span style={{ color: MAROON }}>With Care</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {products.map((prod, idx) => {
              const name = showingTranslateValue(prod.title) || prod.name || "";
              const desc = showingTranslateValue(prod.description) || prod.uses || "";
              const imageUrl = getProductImageSrc(prod);
              const manufacturer = prod.manufacturer || "";

              return (
                <div
                  key={prod._id || idx}
                  className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col group"
                  style={{ borderTop: `3px solid ${idx % 2 === 0 ? NAVY : MAROON}` }}
                >
                  {/* product image */}
                  <div className="w-full h-44 flex items-center justify-center rounded-lg mb-5 overflow-hidden" style={{ background: "#F4F6FC" }}>
                    <img
                      src={imageUrl}
                      alt={name}
                      className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  </div>
                  {manufacturer && (
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">
                      {manufacturer}
                    </span>
                  )}
                  <h4 className="text-base font-black text-gray-900 mb-2">{name}</h4>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed flex-1">
                    {desc.length > 140 ? `${desc.slice(0, 137)}...` : desc}
                  </p>
                  <Link
                    href={`/product/${prod.slug}`}
                    className="inline-flex items-center gap-1 mt-5 text-xs font-black uppercase tracking-wider transition-colors"
                    style={{ color: NAVY }}
                  >
                    View Details <FiChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 6. VISION & MISSION ── */}
      <section className="py-20 lg:py-24 relative overflow-hidden" style={{ background: NAVY }}>
        {/* Subtle diagonal overlay */}
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: "repeating-linear-gradient(-45deg, white, white 1px, transparent 1px, transparent 14px)",
          }}
        />
        {/* gold top accent */}
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: GOLD }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-14">
            <span
              className="inline-block px-4 py-1 mb-4 text-[10px] font-black uppercase tracking-[0.2em] border"
              style={{ color: "#D4A831", borderColor: "#D4A831", background: "rgba(212,168,49,0.1)" }}
            >
              Our Purpose
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">Vision &amp; Mission</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: FiTarget,
                iconBg: `rgba(139,26,46,0.25)`,
                iconColor: "#F5A8B4",
                title: "Our Dedicated Mission",
                body: "To make life-saving medicines more accessible across India through ethical business practices, competitive pricing, dependable customer support, and the highest standards of quality and compliance.",
              },
              {
                icon: FiEye,
                iconBg: `rgba(212,168,49,0.2)`,
                iconColor: "#D4A831",
                title: "Our Vision",
                body: "To be a trusted trader, wholesaler, distributor, and retailer of pharmaceutical tablets, injectables, oncology, critical care, and specialty medicines — serving hospitals, healthcare institutions, pharmacies, and distributors nationwide.",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="p-8 sm:p-12 rounded-xl hover:bg-white/5 transition-all duration-300"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-8"
                  style={{ background: card.iconBg, color: card.iconColor }}
                >
                  <card.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-white mb-4">{card.title}</h3>
                <p className="text-blue-100/70 text-sm sm:text-base leading-relaxed font-medium">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. FAQ ── */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 space-y-3">
            <span
              className="inline-block px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] border"
              style={{ color: NAVY, borderColor: NAVY, background: "#EEF0F8" }}
            >
              Frequently Asked
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Distribution &amp; Supply FAQs</h2>
          </div>

          <div className="space-y-4">
            {[
              { q: "Where does Kure Pharma deliver medicines?",          a: "We provide comprehensive distribution across all states in India, serving local pharmacies, corporate hospital suites, diagnostic clinics, and individual practitioner centers." },
              { q: "How do you verify the authenticity of medications?", a: "Every batch is sourced directly from licensed pharma companies or their authorized importers. We trace every batch ID and provide full certification trails for complete peace of mind." },
              { q: "What is your typical turnaround time for orders?",   a: "In-stock formulations are dispatched within 24 hours. Critical air logistics is prioritized for urgent lifesaving compounds with transparent tracking." },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-sm transition-all duration-300"
                style={{ background: CREAM }}
              >
                <div className="flex gap-4 items-start">
                  <div
                    className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0 text-white text-[11px] font-black mt-0.5"
                    style={{ background: NAVY }}
                  >
                    Q
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 text-sm sm:text-base mb-2">{faq.q}</h4>
                    <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. CTA BANNER ── */}
      <section className="py-16 relative overflow-hidden" style={{ background: `linear-gradient(135deg, #0d1a34 0%, ${NAVY} 50%, #2a0e1a 100%)` }}>
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: GOLD }} />
        <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: GOLD }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="w-12 h-0.5 mx-auto" style={{ background: GOLD }} />
          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">Partner with a Trusted Name</h2>
          <p className="text-blue-200 text-sm sm:text-base max-w-xl mx-auto font-medium">
            Contact us today for wholesale contract rates, rare drug sourcing requests, or to register your hospital pharmacy account.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/contact-us"
              className="inline-flex items-center justify-center gap-2 bg-white px-8 py-4 rounded font-extrabold text-sm hover:bg-gray-100 transition-all shadow-lg hover:scale-105 active:scale-95"
              style={{ color: NAVY }}
            >
              Contact Our Desk <FiChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded font-extrabold text-sm transition-all hover:scale-105 active:scale-95 shadow-lg border-2"
              style={{ background: MAROON, color: "white", borderColor: MAROON }}
            >
              Browse Catalog <FiChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutUsRedesign;

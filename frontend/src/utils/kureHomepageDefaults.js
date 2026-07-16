import { popularCategoryItems } from "./kureTherapeuticCategories";
import { KURE_ADDRESS_MULTILINE } from "./kureContactInfo";

const kureHomepageDefaults = {
  seo: {
    title:
      "Kure Pharma - Trusted Pharmaceutical Distributor | Oncology, Critical Care, Specialty Medicines",
    description:
      "Kure Pharma is a leading pharmaceutical wholesaler and distributor of Anti-Cancer, Oncology, Critical Care, HIV, Nephrology & Specialty medicines. Established 2016, Noida.",
  },
  hero: {
    enabled: true,
    trustBadges: [
      {
        icon: "FiShield",
        title: "Trusted Since 2016",
        description: "Years of excellence in distribution",
      },
      {
        icon: "FiPackage",
        title: "1000+ Products",
        description: "Wide range of medications",
      },
      {
        icon: "FiTruck",
        title: "Pan India Supply",
        description: "Cold chain delivery logistics",
      },
    ],
    ctaPrimary: { text: "Explore Products", link: "/products" },
    ctaSecondary: { text: "Request Quote", action: "enquiry" },
    phone: "+91 99119 72234",
    whatsapp: "919911972234",
    slides: [
      {
        tagline: "Oncology & Specialty Medicines | Prescription Products",
        titleLine1: "Leading Pharmaceutical Wholesale",
        titleGoldLine: "Distributors in India.",
        subtitle:
          "CDSCO-compliant sourcing for hospitals, pharmacies and clinics. Noida | Delhi NCR | Mumbai | Lucknow | Kolkata | Pan-India delivery.",
      },
    ],
  },
  qualityBar: {
    enabled: true,
    items: [
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
    ],
  },
  popularCategories: {
    enabled: true,
    title: "Explore Our Pharmaceutical Categories",
    items: popularCategoryItems,
  },
  bestDeals: {
    enabled: true,
    title: "Today's Best Deals For You!",
    linkText: "See all",
    linkUrl: "/products",
  },
  promoBanners: {
    enabled: true,
    items: [
      {
        label: "Anti-Cancer Medicines",
        title: "Anti-Cancer &",
        titleLine2: "Oncology Range",
        image: "/products/ramiven.png",
        category: "Anti-Cancer Medicines",
        accent: "navy",
        linkText: "Browse Oncology",
        linkUrl: "/products?category=Anti-Cancer Medicines",
      },
      {
        label: "Critical Care Medicines",
        title: "Life-Saving",
        titleLine2: "Injectable Medicines",
        image: "/products/adcetris.png",
        category: "Critical Care Medicines",
        accent: "maroon",
        linkText: "Browse Critical Care",
        linkUrl: "/products?category=Critical Care Medicines",
      },
      {
        label: "Imported medicine",
        title: "Imported &",
        titleLine2: "Specialty Therapeutics",
        image: "/products/tagrisso.png",
        category: "Imported medicine",
        accent: "gold",
        linkText: "View Imported Range",
        linkUrl: "/products?category=Imported medicine",
      },
    ],
  },
  therapeutics: {
    enabled: true,
    badge: "Specialized Distribution",
    title: "Comprehensive Range of",
    titleHighlight: "Life-Saving",
    titleSuffix: "Therapeutics",
    description:
      "We distribute fully authenticated, temperature-controlled specialty medicines sourced directly from trusted global manufacturers to hospitals, pharmacy chains, and clinical networks across India.",
    image: "/categories/hero-scene.png",
    imageLabel: "Oncology & Specialty Care",
    imageSubLabel: "Trusted distribution for hospitals & pharmacies across India",
  },
  featuredBrands: {
    enabled: true,
    title: "Our Featured Brands",
  },
  trendingProducts: {
    enabled: true,
    title: "Our Trending Products",
    subtitle: "Indian branded medicines trusted across Bharat.",
    linkText: "See all products",
    linkUrl: "/products",
  },
  bottomCta: {
    enabled: true,
    title: "Need Medicine Sourcing Assistance?",
    subtitle: "Call us or send an enquiry — our team responds within 24 hours.",
    phone: "+91 99119 72234",
    phoneHref: "tel:+919911972234",
    enquiryButtonText: "Send Enquiry",
  },
  footer: {
    description:
      "भारत का विश्वसनीय फार्मास्युटिकल वितरक — Oncology, Critical Care, HIV & Specialty medicines. Serving hospitals & pharmacies across India since 2016.",
    badges: ["Quality Assured", "Pan-India"],
    phone: "+91 99119 72234",
    phoneHref: "tel:+919911972234",
    email: "Kure.export@gmail.com",
    address: KURE_ADDRESS_MULTILINE,
    hours: "Mon–Sat: 10 AM – 7 PM IST",
    whatsappUrl: "https://wa.me/919911972234",
    facebookUrl: "https://facebook.com",
    copyright: "Proudly serving India.",
  },
};

export const fallbackBrands = [
  { name: "Curemart Pharma", slug: "curemart-pharma", logo: "/brands/curemart-pharma.svg" },
  { name: "Cadila Pharmaceuticals", slug: "cadila-pharmaceuticals", logo: "/brands/cadila.svg" },
  { name: "Deltamed", slug: "deltamed", logo: "/brands/deltamed.svg" },
  { name: "Dr. Reddy's", slug: "dr-reddys", logo: "/brands/dr-reddys.svg" },
  { name: "Zydus", slug: "zydus", logo: "/brands/zydus.svg" },
  { name: "BDR Pharmaceuticals", slug: "bdr-pharmaceuticals", logo: "/brands/bdr.svg" },
  { name: "Mankind", logo: "/brands/mankind.png" },
  { name: "Natco Pharma", logo: "/brands/natco.svg" },
  { name: "Bharat Serums", logo: "/brands/bharat-serums.webp" },
  { name: "Glenmark", logo: "/brands/glenmark.png" },
  { name: "Lilly", logo: "/brands/lilly.svg" },
  { name: "Pfizer", logo: "/brands/pfizer.svg" },
  { name: "AstraZeneca", logo: "/brands/astrazeneca.svg" },
  { name: "Novartis", logo: "/brands/novartis.svg" },
  { name: "Novo Nordisk", logo: "/brands/novo-nordisk.svg" },
  { name: "Astellas", logo: "/brands/astellas.svg" },
];

export default kureHomepageDefaults;

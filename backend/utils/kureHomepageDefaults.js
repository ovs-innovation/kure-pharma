const { popularCategoryItems } = require("./kureTherapeuticCategories");

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
    ctaPrimary: { text: "View Full Product Range", link: "/products" },
    ctaSecondary: { text: "Send Enquiry", action: "enquiry" },
    phone: "+91 99119 72234",
    whatsapp: "919911972234",
    slides: [
      {
        tagline: "Oncology & Specialty Medicines | Prescription Products",
        titleLine1: "Leading Pharmaceutical Wholesale",
        titleGoldLine: "Distributors in India.",
        titleLine2: "in India.",
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
        title: "Wide Range",
        description: "Extensive portfolio of oncology & specialty care products.",
      },
      {
        icon: "FiTruck",
        title: "Timely Delivery",
        description: "On-time delivery with temperature-controlled logistics.",
      },
      {
        icon: "FiUsers",
        title: "Trusted by Experts",
        description: "Serving hospitals, clinics & pharmacies across India.",
      },
      {
        icon: "FiHeadphones",
        title: "Dedicated Support",
        description: "Responsive support for all your business needs.",
      },
    ],
  },
  popularCategories: {
    enabled: true,
    title: "Popular Categories",
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
        linkText: "Browse Anti-Cancer",
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
      "Authenticated Indian & licensed specialty medicines from Zydus, Natco, Intas, Cipla, Sun Pharma and trusted partners — cold-chain delivered to hospitals and pharmacies across India.",
    image: "/products/hertuma.png",
    imageLabel: "Hertraz",
    imageSubLabel: "Indian branded oncology medicine",
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
    subtitle:
      "Call us or send an enquiry — our team responds within 24 hours.",
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
    address:
      "B-1/D, Saurav Vihar, Jaitpur,\nBadarpur, New Delhi – 110044",
    hours: "Mon–Sat: 10 AM – 7 PM IST",
    whatsappUrl: "https://wa.me/919911972234",
    facebookUrl: "https://facebook.com",
    copyright: "Proudly serving India.",
  },
};

module.exports = kureHomepageDefaults;

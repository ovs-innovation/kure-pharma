import { KURE_ADDRESS_WITH_COUNTRY } from "./kureContactInfo";

export const kureDefaultFaqItems = [
  {
    question: "Where does Kure Pharma deliver medicines?",
    answer:
      "We supply hospitals, pharmacies, clinics, and distributors across Noida, Delhi NCR, Mumbai, Lucknow, Kolkata, Patna, Chandigarh, and pan-India, subject to product availability and regulatory requirements.",
  },
  {
    question: "How do I place an order with Kure Pharma?",
    answer:
      "Call us at +91 99119 72234, email Kure.export@gmail.com, use the website enquiry form, or WhatsApp us with your product requirement, prescription details (where applicable), and delivery location.",
  },
  {
    question: "Do you deliver medicines in emergency situations?",
    answer:
      "Yes. For urgent critical care and lifesaving medicines, contact our team directly. We prioritise emergency hospital and pharmacy requests wherever logistics allow.",
  },
  {
    question: "How do I know the medicines supplied are authentic?",
    answer:
      "Kure Pharma sources medicines directly from licensed manufacturers and authorised distributors. We maintain batch records and supply only genuine, quality-assured pharmaceutical products.",
  },
  {
    question: "Why is a prescription required for some medicines?",
    answer:
      "Prescription-only medicines must be supplied as per Drugs & Cosmetics Act and CDSCO guidelines. A valid prescription from a registered medical practitioner is mandatory where applicable.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept bank transfer, UPI, and other payment modes as agreed at the time of order confirmation for wholesale and institutional buyers.",
  },
  {
    question: "Which categories do you specialise in?",
    answer:
      "Anti-Cancer Medicines, Oncology Drugs, Critical Care Medicines, Lifesaving Drugs, Imported medicine, HIV, and Nephrology Medicine — plus related injectables and specialty pharmaceuticals.",
  },
  {
    question: "How can I contact Kure Pharma for support?",
    answer:
      `Phone: +91 99119 72234 | Email: Kure.export@gmail.com | Address: ${KURE_ADDRESS_WITH_COUNTRY}.`,
  },
];

const FAQ_SLOT_KEYS = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
];

const readLocalized = (value, lang = "en") => {
  if (!value) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "object") {
    return (value[lang] || value.en || Object.values(value)[0] || "").trim();
  }
  return "";
};

export const getFaqItemsFromSettings = (faqSetting, lang = "en") => {
  if (!faqSetting || faqSetting.page_status === false) {
    return kureDefaultFaqItems;
  }

  const items = FAQ_SLOT_KEYS.map((key) => ({
    question: readLocalized(faqSetting[`faq_${key}`], lang),
    answer: readLocalized(faqSetting[`description_${key}`], lang),
  })).filter((item) => item.question && item.answer);

  return items.length ? items : kureDefaultFaqItems;
};

export const getFaqPageTitle = (faqSetting, lang = "en") =>
  readLocalized(faqSetting?.title, lang) || "Frequently Asked Questions";

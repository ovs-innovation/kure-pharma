export const POLICY_LINKS = [
  { id: "privacy-policy", href: "/privacy-policy", label: "Privacy Policy" },
  { id: "terms-and-conditions", href: "/terms-and-conditions", label: "Terms & Conditions" },
  { id: "shipping-policy", href: "/shipping-policy", label: "Shipping Policy" },
  { id: "return-and-refund-policy", href: "/return-and-refund-policy", label: "Return & Refund Policy" },
  { id: "legal-disclaimer", href: "/legal-disclaimer", label: "Legal Disclaimer" },
];

import { KURE_ADDRESS_WITH_COUNTRY } from "./kureContactInfo";

export const KURE_POLICY_CONTACT = {
  company: "Kure Pharma",
  website: "kurepharma.com",
  phone: "+91 99119 72234",
  email: "Kure.export@gmail.com",
  address: KURE_ADDRESS_WITH_COUNTRY,
  cities:
    "Noida, Delhi NCR, Mumbai, Lucknow, Kolkata, Patna, Chandigarh & Pan-India",
};

export const flattenPolicySections = (sections = []) => {
  const blocks = [];

  sections.forEach((section) => {
    if (section.title) {
      blocks.push({ type: "heading", text: section.title });
    }

    section.paragraphs?.forEach((text) => {
      if (text) blocks.push({ type: "paragraph", text });
    });

    if (section.link) {
      blocks.push({
        type: "link",
        prefix: section.linkPrefix || "",
        href: section.link.href,
        label: section.link.label,
      });
    }

    if (section.list?.length) {
      blocks.push({ type: "list", items: section.list.filter(Boolean) });
    }

    section.paragraphsAfter?.forEach((text) => {
      if (text) blocks.push({ type: "paragraph", text });
    });
  });

  return blocks;
};

export const getPrivacyPolicySections = (t) => [
  { paragraphs: [t("privacy-s1-p1"), t("privacy-s1-p2")] },
  {
    title: t("privacy-s2-title"),
    paragraphs: [t("privacy-s2-p1"), t("privacy-s2-p2")],
    list: [t("privacy-s2-l1"), t("privacy-s2-l2"), t("privacy-s2-l3"), t("privacy-s2-l4")],
  },
  { title: t("privacy-s3-title"), paragraphs: [t("privacy-s3-p1")] },
  { title: t("privacy-s4-title"), paragraphs: [t("privacy-s4-p1")] },
  { title: t("privacy-s5-title"), paragraphs: [t("privacy-s5-p1")] },
  { title: t("privacy-s6-title"), paragraphs: [t("privacy-s6-p1")] },
  { title: t("privacy-s7-title"), paragraphs: [t("privacy-s7-p1")] },
  { title: t("privacy-s8-title"), paragraphs: [t("privacy-s8-p1")] },
  { title: t("privacy-s9-title"), paragraphs: [t("privacy-s9-p1")] },
  { title: t("privacy-s10-title"), paragraphs: [t("privacy-s10-p1")] },
  { title: t("privacy-s11-title"), paragraphs: [t("privacy-s11-p1"), t("privacy-s11-p2")] },
];

export const getTermsPolicySections = (t) => [
  { paragraphs: [t("terms-s1-p1"), t("terms-s1-p2")] },
  { title: t("terms-s2-title"), paragraphs: [t("terms-s2-p1")] },
  {
    title: t("terms-s3-title"),
    paragraphs: [t("terms-s3-p1")],
    list: [t("terms-s3-l1"), t("terms-s3-l2"), t("terms-s3-l3")],
  },
  {
    title: t("terms-s4-title"),
    paragraphs: [t("terms-s4-p1"), t("terms-s4-p2")],
  },
  { title: t("terms-s5-title"), paragraphs: [t("terms-s5-p1")] },
  { title: t("terms-s6-title"), paragraphs: [t("terms-s6-p1")] },
  { title: t("terms-s7-title"), paragraphs: [t("terms-s7-p1")] },
  {
    title: t("terms-s8-title"),
    linkPrefix: t("terms-s8-p1"),
    link: { href: "/privacy-policy", label: t("terms-s8-link") },
    paragraphsAfter: [t("terms-s8-p2")],
  },
  { title: t("terms-s9-title"), paragraphs: [t("terms-s9-p1")] },
  { title: t("terms-s10-title"), paragraphs: [t("terms-s10-p1")] },
  { title: t("terms-s11-title"), paragraphs: [t("terms-s11-p1"), t("terms-s11-p2")] },
];

export const getShippingPolicySections = (t) => [
  { paragraphs: [t("shipping-s1-p1")] },
  { title: t("shipping-s2-title"), paragraphs: [t("shipping-s2-p1"), t("shipping-s2-p2")] },
  {
    title: t("shipping-s3-title"),
    paragraphs: [t("shipping-s3-p1")],
    list: [t("shipping-s3-l1"), t("shipping-s3-l2"), t("shipping-s3-l3")],
  },
  { title: t("shipping-s4-title"), paragraphs: [t("shipping-s4-p1"), t("shipping-s4-p2")] },
  { title: t("shipping-s5-title"), paragraphs: [t("shipping-s5-p1")] },
  { title: t("shipping-s6-title"), paragraphs: [t("shipping-s6-p1")] },
  { title: t("shipping-s7-title"), paragraphs: [t("shipping-s7-p1")] },
  { title: t("shipping-s8-title"), paragraphs: [t("shipping-s8-p1"), t("shipping-s8-p2")] },
];

export const getReturnRefundPolicySections = (t) => [
  { paragraphs: [t("return-s1-p1"), t("return-s1-p2")] },
  {
    title: t("return-s2-title"),
    paragraphs: [t("return-s2-p1")],
    list: [t("return-s2-l1"), t("return-s2-l2"), t("return-s2-l3"), t("return-s2-l4")],
  },
  {
    title: t("return-s3-title"),
    paragraphs: [t("return-s3-p1")],
    list: [t("return-s3-l1"), t("return-s3-l2"), t("return-s3-l3"), t("return-s3-l4")],
  },
  { title: t("return-s4-title"), paragraphs: [t("return-s4-p1"), t("return-s4-p2")] },
  { title: t("return-s5-title"), paragraphs: [t("return-s5-p1")] },
  {
    title: t("return-s6-title"),
    paragraphs: [t("return-s6-p1")],
    list: [t("return-s6-l1"), t("return-s6-l2"), t("return-s6-l3")],
  },
  { title: t("return-s7-title"), paragraphs: [t("return-s7-p1")] },
  { title: t("return-s8-title"), paragraphs: [t("return-s8-p1"), t("return-s8-p2")] },
];

export const getLegalDisclaimerSections = (t) => [
  { paragraphs: [t("disclaimer-s1-p1")] },
  { title: t("disclaimer-s2-title"), paragraphs: [t("disclaimer-s2-p1"), t("disclaimer-s2-p2")] },
  { title: t("disclaimer-s3-title"), paragraphs: [t("disclaimer-s3-p1")] },
  {
    title: t("disclaimer-s4-title"),
    paragraphs: [t("disclaimer-s4-p1")],
    list: [t("disclaimer-s4-l1"), t("disclaimer-s4-l2"), t("disclaimer-s4-l3")],
  },
  { title: t("disclaimer-s5-title"), paragraphs: [t("disclaimer-s5-p1")] },
  { title: t("disclaimer-s6-title"), paragraphs: [t("disclaimer-s6-p1")] },
  { title: t("disclaimer-s7-title"), paragraphs: [t("disclaimer-s7-p1"), t("disclaimer-s7-p2")] },
];

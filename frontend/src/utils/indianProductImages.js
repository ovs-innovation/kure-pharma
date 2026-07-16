import { kureTherapeuticCategories } from "./kureTherapeuticCategories";

/** Generic / AI-looking packshots — avoid on site */
export const GENERIC_PRODUCT_IMAGES = new Set([
  "/products/oncology_box.png",
  "/products/oncology.png",
  "/products/cancer_treatment_pack.png",
  "/products/specialty.png",
  "/products/immunotherapy_kit.png",
  "/products/targeted_therapy_pack.png",
  "/products/imported_specialty_pack.png",
  "/products/lifesaving_emergency_box.png",
  "/products/critical_care_injection.png",
  "/products/injection_vial.png",
  "/products/monoclonal_antibody_pack.png",
  "/products/iv_infusion_box.png",
  "/products/capsule_bottle.png",
  "/products/bone_health_kit.png",
]);

/** Indian marketed brand packshots (Natco, Zydus, Intas-style catalog images) */
export const CATEGORY_INDIAN_BRAND_IMAGES = {
  "Anti-Cancer Medicines": "/products/ramiven.png",
  "Oncology Drugs": "/products/hertuma.png",
  "Critical Care Medicines": "/products/adcetris.png",
  "Lifesaving Drugs": "/products/venclexta.png",
  "Imported medicine": "/products/tagrisso.png",
  HIV: "/products/hiv.png",
  "Nephrology Medicine": "/products/kryxana.png",
};

export const THERAPEUTICS_SHOWCASE = {
  image: "/app/mido.jpeg",
  label: "Midostar®",
  sublabel: "Zydus specialty oncology · Midostaurin 25 mg",
};

export const isGenericProductImage = (src) =>
  !src || GENERIC_PRODUCT_IMAGES.has(src);

export const getIndianCategoryImage = (categoryName = "") => {
  if (CATEGORY_INDIAN_BRAND_IMAGES[categoryName]) {
    return CATEGORY_INDIAN_BRAND_IMAGES[categoryName];
  }

  const normalized = categoryName.toLowerCase();
  const matched = kureTherapeuticCategories.find(
    (item) =>
      item.name.toLowerCase() === normalized ||
      item.category.toLowerCase() === normalized,
  );
  if (matched && CATEGORY_INDIAN_BRAND_IMAGES[matched.category]) {
    return CATEGORY_INDIAN_BRAND_IMAGES[matched.category];
  }

  if (normalized.includes("anti-cancer")) return CATEGORY_INDIAN_BRAND_IMAGES["Anti-Cancer Medicines"];
  if (normalized.includes("oncology")) return CATEGORY_INDIAN_BRAND_IMAGES["Oncology Drugs"];
  if (normalized.includes("critical")) return CATEGORY_INDIAN_BRAND_IMAGES["Critical Care Medicines"];
  if (normalized.includes("lifesav")) return CATEGORY_INDIAN_BRAND_IMAGES["Lifesaving Drugs"];
  if (normalized.includes("imported")) return CATEGORY_INDIAN_BRAND_IMAGES["Imported medicine"];
  if (normalized.includes("hiv")) return CATEGORY_INDIAN_BRAND_IMAGES.HIV;
  if (normalized.includes("nephrology")) return CATEGORY_INDIAN_BRAND_IMAGES["Nephrology Medicine"];

  return "/products/ramiven.png";
};

export const resolveIndianProductImage = (src, categoryName = "") => {
  if (!isGenericProductImage(src)) return src;
  return getIndianCategoryImage(categoryName);
};

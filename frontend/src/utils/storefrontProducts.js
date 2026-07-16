import { breakthroughDrugs } from "@utils/kureHomepageRichContent";

const STATIC_CATALOG_SLUGS = new Set(
  breakthroughDrugs.map((item) => item.slug).filter(Boolean),
);

const isDbProductId = (id) => /^[a-f\d]{24}$/i.test(String(id || ""));

/** Storefront listings: real MongoDB products only (no hardcoded catalog rows). */
export const filterStorefrontProducts = (products = []) => {
  if (!Array.isArray(products)) return [];

  return products.filter((product) => {
    if (!product || !isDbProductId(product._id)) return false;
    if (product.slug && STATIC_CATALOG_SLUGS.has(product.slug)) return false;
    return true;
  });
};

const readLabel = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "object") {
    if (value.en) return String(value.en).trim();
    const first = Object.values(value).find((v) => typeof v === "string" && v.trim());
    return first ? first.trim() : "";
  }
  return String(value).trim();
};

/** Category names attached to a product (primary + categories[]). */
export const getProductCategoryLabels = (product) => {
  const labels = new Set();
  const add = (value) => {
    const label = readLabel(value);
    if (label) labels.add(label);
  };

  add(product?.category?.name || product?.category);
  (product?.categories || []).forEach((entry) => add(entry?.name || entry));
  return labels;
};

export const productMatchesCategoryFilter = (product, categoryFilter = "") => {
  if (!categoryFilter) return true;
  return getProductCategoryLabels(product).has(categoryFilter);
};

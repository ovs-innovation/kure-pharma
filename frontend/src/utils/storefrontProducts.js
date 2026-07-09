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

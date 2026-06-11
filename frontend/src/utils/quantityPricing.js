import { isInventoryTracked } from "./inventory";

export const roundMoney = (value) =>
  Math.round((Number(value) || 0) * 100) / 100;

export const normalizeTier = (tier = {}) => ({
  minQuantity: Math.max(1, parseInt(tier.minQuantity, 10) || 1),
  maxQuantity: Math.max(0, parseInt(tier.maxQuantity, 10) || 0),
  discountPercent: Math.min(100, Math.max(0, Number(tier.discountPercent) || 0)),
  unitPrice: Math.max(0, Number(tier.unitPrice) || 0),
});

export const sortTiers = (tiers = []) =>
  [...tiers].map(normalizeTier).sort((a, b) => a.minQuantity - b.minQuantity);

export const getEffectiveMinOrder = (product = {}) => {
  const tiers = sortTiers(product?.quantityTiers || []);
  const tierMin = tiers.length ? tiers[0].minQuantity : null;
  const moq = Math.max(1, parseInt(product?.minOrderQuantity, 10) || 1);
  return tierMin ? Math.max(moq, tierMin) : moq;
};

export const getEffectiveMaxOrder = (product = {}) => {
  const max = parseInt(product?.maxOrderQuantity, 10) || 0;
  let stockCap = 0;

  if (isInventoryTracked(product)) {
    const stock = Math.max(0, parseInt(product?.stock, 10) || 0);
    stockCap = stock > 0 ? stock : 0;
  }

  if (max > 0 && stockCap > 0) return Math.min(max, stockCap);
  if (max > 0) return max;
  if (stockCap > 0) return stockCap;
  return 0;
};

export const getTierForQuantity = (product = {}, quantity = 1) => {
  const qty = Math.max(1, parseInt(quantity, 10) || 1);
  const tiers = sortTiers(product?.quantityTiers || []);
  if (!tiers.length) return null;

  let match = null;
  for (const tier of tiers) {
    if (qty < tier.minQuantity) continue;
    if (tier.maxQuantity > 0 && qty > tier.maxQuantity) continue;
    if (!match || tier.minQuantity >= match.minQuantity) match = tier;
  }
  return match;
};

export const getUnitPriceForQuantity = (product = {}, quantity = 1) => {
  const base = roundMoney(product?.price ?? product?.prices?.price ?? 0);
  const tier = getTierForQuantity(product, quantity);
  if (!tier) return base;
  if (tier.unitPrice > 0) return roundMoney(tier.unitPrice);
  if (tier.discountPercent > 0) {
    return roundMoney(base * (1 - tier.discountPercent / 100));
  }
  return base;
};

export const clampQuantity = (product = {}, quantity = 1) => {
  const min = getEffectiveMinOrder(product);
  const max = getEffectiveMaxOrder(product);
  let qty = Math.max(min, parseInt(quantity, 10) || min);
  if (max > 0) qty = Math.min(qty, max);
  return qty;
};

export const formatTierRangeLabel = (tier) => {
  if (!tier) return "";
  if (tier.maxQuantity > 0) {
    return `${tier.minQuantity} – ${tier.maxQuantity} pcs`;
  }
  return `${tier.minQuantity}+ pcs`;
};

/** Build cart line fields for bulk pricing enforcement */
export const getCartPricingMeta = (product = {}) => ({
  minQty: getEffectiveMinOrder(product),
  maxQty: getEffectiveMaxOrder(product),
  quantityTiers: product?.quantityTiers || [],
  listPrice: roundMoney(product?.price ?? product?.prices?.price ?? 0),
  stock: isInventoryTracked(product)
    ? Math.max(0, parseInt(product?.stock, 10) || 0)
    : 0,
  trackInventory: isInventoryTracked(product),
  hsnCode: product?.hsnCode || "",
});

const buyNowStorageKey = (id) => `buyNowPricing:${id}`;

export const stashBuyNowPricing = (product = {}) => {
  if (typeof window === "undefined" || !product?._id) return;
  try {
    sessionStorage.setItem(
      buyNowStorageKey(product._id),
      JSON.stringify(getCartPricingMeta(product))
    );
  } catch (_) {
    /* ignore */
  }
};

export const loadBuyNowPricing = (productId) => {
  if (typeof window === "undefined" || !productId) return null;
  try {
    const raw = sessionStorage.getItem(buyNowStorageKey(productId));
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
};

export const buildCartItemFields = (product = {}, quantity) => {
  const meta = getCartPricingMeta(product);
  const qty = clampQuantity(product, quantity ?? meta.minQty);
  const unitPrice = getUnitPriceForQuantity(product, qty);
  return { ...meta, quantity: qty, price: unitPrice };
};

export const syncCartQuantity = (updateItem, lineItem, newQuantity) => {
  if (!updateItem || !lineItem?.id) return;
  const resolved = resolveCartLinePrice(lineItem, newQuantity);
  updateItem(lineItem.id, {
    quantity: resolved.quantity,
    price: resolved.price,
  });
};

export const resolveCartLinePrice = (lineItem = {}, quantity) => {
  const productLike = {
    price: lineItem.listPrice ?? lineItem.price ?? 0,
    minOrderQuantity: lineItem.minQty ?? 1,
    maxOrderQuantity: lineItem.maxQty ?? 0,
    quantityTiers: lineItem.quantityTiers || [],
    stock: lineItem.stock,
  };
  const qty = clampQuantity(productLike, quantity);
  return {
    quantity: qty,
    price: getUnitPriceForQuantity(productLike, qty),
  };
};

/** Qty at or above this → recommend bulk enquiry instead of instant checkout */
export const getBulkEnquiryThreshold = (product = {}) => {
  const tiers = sortTiers(product?.quantityTiers || []);
  const bulkTier = tiers.find((t) => t.minQuantity > 1);
  if (bulkTier) return bulkTier.minQuantity;
  const moq = getEffectiveMinOrder(product);
  if (moq > 1) return moq;
  return 10;
};

export const getRetailMaxQuantity = (product = {}) => {
  const bulk = getBulkEnquiryThreshold(product);
  const min = getEffectiveMinOrder(product);
  if (bulk <= min) return 0;
  return bulk - 1;
};

export const canUseRetailCheckout = (product = {}, quantity = 1) => {
  const qty = clampQuantity(product, quantity);
  const maxRetail = getRetailMaxQuantity(product);
  if (maxRetail === 0) return true;
  return qty <= maxRetail;
};

export const getTierLabelForQuantity = (product = {}, quantity = 1) => {
  const tier = getTierForQuantity(product, quantity);
  return tier ? formatTierRangeLabel(tier) : "Standard rate";
};

export const getPricingSummary = (product = {}, quantity = 1) => {
  const qty = clampQuantity(product, quantity);
  const listPrice = roundMoney(product?.price ?? product?.prices?.price ?? 0);
  const unitPrice = getUnitPriceForQuantity(product, qty);
  const discountPercent =
    listPrice > 0 ? Math.round((1 - unitPrice / listPrice) * 100) : 0;
  return {
    quantity: qty,
    listUnitPrice: listPrice,
    unitPrice,
    estimatedTotal: roundMoney(unitPrice * qty),
    discountPercent: Math.max(0, discountPercent),
    tierLabel: getTierLabelForQuantity(product, qty),
    isBulk: qty >= getBulkEnquiryThreshold(product),
  };
};

/** Max bulk savings + labels for cards / badges */
export const getBulkDiscountInfo = (product = {}) => {
  const base = roundMoney(product?.price ?? product?.prices?.price ?? 0);
  const tiers = sortTiers(product?.quantityTiers || []);
  if (!tiers.length) {
    return {
      hasBulkTiers: false,
      maxDiscountPercent: 0,
      bulkFromQty: null,
      shortLabel: null,
      detailLabel: null,
    };
  }

  let maxDiscountPercent = 0;
  for (const tier of tiers) {
    const unitPrice =
      tier.unitPrice > 0
        ? roundMoney(tier.unitPrice)
        : tier.discountPercent > 0
          ? roundMoney(base * (1 - tier.discountPercent / 100))
          : base;
    if (base > 0 && unitPrice < base) {
      maxDiscountPercent = Math.max(
        maxDiscountPercent,
        Math.round((1 - unitPrice / base) * 100)
      );
    }
    if (tier.discountPercent > 0) {
      maxDiscountPercent = Math.max(maxDiscountPercent, tier.discountPercent);
    }
  }

  const bulkFromQty =
    tiers.find((t) => t.minQuantity > 1)?.minQuantity ?? tiers[0].minQuantity;

  const shortLabel =
    maxDiscountPercent > 0
      ? `Up to ${maxDiscountPercent}% bulk off`
      : `Bulk from ${bulkFromQty} pcs`;

  const detailLabel =
    maxDiscountPercent > 0
      ? `${bulkFromQty}+ pcs — save up to ${maxDiscountPercent}% per piece`
      : `Volume pricing from ${bulkFromQty} pieces`;

  return {
    hasBulkTiers: true,
    maxDiscountPercent,
    bulkFromQty,
    shortLabel,
    detailLabel,
  };
};

export const getTierRowsForDisplay = (product = {}, currency = "₹") => {
  const base = roundMoney(product?.price ?? 0);
  const tiers = sortTiers(product?.quantityTiers || []);
  if (!tiers.length) {
    const min = getEffectiveMinOrder(product);
    return [
      {
        label: min > 1 ? `${min}+ pcs` : "1+ pcs",
        unitPrice: base,
        discountPercent: 0,
        isBase: true,
      },
    ];
  }
  return tiers.map((tier) => {
    const unitPrice = tier.unitPrice > 0
      ? roundMoney(tier.unitPrice)
      : tier.discountPercent > 0
        ? roundMoney(base * (1 - tier.discountPercent / 100))
        : base;
    return {
      ...tier,
      label: formatTierRangeLabel(tier),
      unitPrice,
      discountPercent: tier.discountPercent,
      currency,
    };
  });
};

const HSN_CODE_PATTERN = /^[0-9A-Za-z]{2,8}$/;

const normalizeStock = (value) => {
  const n = parseInt(value, 10);
  return Number.isFinite(n) && n >= 0 ? n : 0;
};

const normalizeThreshold = (value) => {
  const n = parseInt(value, 10);
  return Number.isFinite(n) && n >= 0 ? n : 5;
};

const getStockStatus = (stock, lowStockThreshold = 5) => {
  const qty = normalizeStock(stock);
  const threshold = normalizeThreshold(lowStockThreshold);

  if (qty <= 0) return "out-of-stock";
  if (qty <= threshold) return "low-stock";
  return "in-stock";
};

const getStockStatusLabel = (status) => {
  switch (status) {
    case "in-stock":
      return "In Stock";
    case "low-stock":
      return "Low Stock";
    case "out-of-stock":
      return "Out of Stock";
    default:
      return "Out of Stock";
  }
};

const validateHsnCode = (value) => {
  if (value === undefined || value === null || String(value).trim() === "") {
    return { valid: true, value: "" };
  }

  const normalized = String(value).trim();
  if (!HSN_CODE_PATTERN.test(normalized)) {
    return {
      valid: false,
      message: "HSN code must be 2–8 alphanumeric characters (GST format).",
    };
  }

  return { valid: true, value: normalized };
};

const getAvailableStock = (product = {}) => normalizeStock(product.stock);

const isInventoryTracked = (product = {}) => Boolean(product?.trackInventory);

const assertSufficientStock = (product, quantity, titleHint = "") => {
  if (!isInventoryTracked(product)) return;

  const available = getAvailableStock(product);
  const qty = parseInt(quantity, 10) || 0;

  if (qty <= 0) {
    throw new Error("Invalid quantity.");
  }

  if (available <= 0) {
    throw new Error(
      `${titleHint || "Product"} is out of stock.`
    );
  }

  if (qty > available) {
    throw new Error(
      `Only ${available} unit(s) available for ${titleHint || "this product"}.`
    );
  }
};

module.exports = {
  HSN_CODE_PATTERN,
  normalizeStock,
  normalizeThreshold,
  getStockStatus,
  getStockStatusLabel,
  validateHsnCode,
  isInventoryTracked,
  getAvailableStock,
  assertSufficientStock,
};

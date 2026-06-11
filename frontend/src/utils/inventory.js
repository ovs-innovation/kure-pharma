export const isInventoryTracked = (product = {}) => Boolean(product?.trackInventory);

export const getStockStatus = (product = {}) => {
  if (!isInventoryTracked(product)) return "in-stock";

  const stock = Math.max(0, parseInt(product?.stock, 10) || 0);
  const threshold = Math.max(
    0,
    parseInt(product?.lowStockThreshold, 10) ?? 5
  );

  if (stock <= 0) return "out-of-stock";
  if (stock <= threshold) return "low-stock";
  return "in-stock";
};

export const getStockStatusLabel = (status) => {
  switch (status) {
    case "in-stock":
      return "In Stock";
    case "low-stock":
      return "Low Stock";
    case "out-of-stock":
      return "Out Of Stock";
    default:
      return "Out Of Stock";
  }
};

export const getAvailableStock = (product = {}) => {
  if (!isInventoryTracked(product)) return null;
  return Math.max(0, parseInt(product?.stock, 10) || 0);
};

/** User-facing stock line e.g. "In Stock (48 Available)" or "In Stock" when untracked */
export const getStockDisplayText = (product = {}) => {
  const status = getStockStatus(product);
  const label = getStockStatusLabel(status);

  if (!isInventoryTracked(product)) {
    return label;
  }

  if (status === "out-of-stock") {
    return label;
  }

  const available = getAvailableStock(product);
  return `${label} (${available} Available)`;
};

export const isInStock = (product = {}) => {
  if (!isInventoryTracked(product)) return true;
  return getAvailableStock(product) > 0;
};

export const getStockCap = (product = {}) => {
  if (!isInventoryTracked(product)) return 0;
  const stock = getAvailableStock(product);
  return stock > 0 ? stock : 0;
};

import { IMAGE_PLACEHOLDER, optimizeImageUrl } from "@utils/cloudinaryImage";

const collectImageCandidates = (product) => {
  if (!product || typeof product !== "object") return [];

  const candidates = [];

  if (Array.isArray(product.image)) {
    candidates.push(...product.image.filter(Boolean));
  } else if (typeof product.image === "string" && product.image.trim()) {
    candidates.push(product.image.trim());
  }

  if (Array.isArray(product.images)) {
    candidates.push(...product.images.filter(Boolean));
  } else if (typeof product.images === "string" && product.images.trim()) {
    candidates.push(product.images.trim());
  }

  if (Array.isArray(product.variants)) {
    for (const variant of product.variants) {
      if (!variant?.image) continue;
      if (Array.isArray(variant.image)) {
        candidates.push(...variant.image.filter(Boolean));
      } else if (typeof variant.image === "string" && variant.image.trim()) {
        candidates.push(variant.image.trim());
      }
    }
  }

  return candidates.filter(
    (src) => typeof src === "string" && src.trim().length > 0
  );
};

/** Resolve the best product image URL with Cloudinary optimization */
export const getProductImageSrc = (product, index = 0, { width = 600 } = {}) => {
  const candidates = collectImageCandidates(product);
  const src = candidates[index] ?? candidates[0];

  if (!src) return IMAGE_PLACEHOLDER;
  return optimizeImageUrl(src, { width });
};

export const hasProductImage = (product) =>
  collectImageCandidates(product).length > 0;

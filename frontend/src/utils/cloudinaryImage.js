/** Fallback when Cloudinary or remote image fails */
export const IMAGE_PLACEHOLDER = "/no-result.svg";

export const isCloudinaryUrl = (src) =>
  typeof src === "string" && src.includes("res.cloudinary.com");

/** Apply Cloudinary transforms for responsive delivery */
export const optimizeImageUrl = (src, { width = 800, quality = "auto" } = {}) => {
  if (!src || typeof src !== "string") return IMAGE_PLACEHOLDER;
  if (!isCloudinaryUrl(src)) return src;

  try {
    const marker = "/upload/";
    const idx = src.indexOf(marker);
    if (idx === -1) return src;
    const prefix = src.slice(0, idx + marker.length);
    const suffix = src.slice(idx + marker.length);
    return `${prefix}f_auto,q_${quality},w_${width},c_limit/${suffix}`;
  } catch {
    return src;
  }
};

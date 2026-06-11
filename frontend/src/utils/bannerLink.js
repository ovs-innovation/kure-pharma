/** Normalize admin slider / banner links for Next.js routing */
export const resolveBannerHref = (href) => {
  if (!href || typeof href !== "string") return null;
  const trimmed = href.trim();
  if (!trimmed || trimmed === "#" || trimmed === "!#") return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("/")) return trimmed;
  if (/^(product|category|search|blog|service)\//i.test(trimmed)) {
    return `/${trimmed.replace(/^\/+/, "")}`;
  }
  return `/${trimmed.replace(/^\/+/, "")}`;
};

export const isExternalHref = (href) =>
  typeof href === "string" && /^https?:\/\//i.test(href);

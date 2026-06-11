export const getCategorySlug = (name) => {
  if (!name || typeof name !== "string") return "";
  return name.toLowerCase().replace(/[^A-Z0-9]+/gi, "-");
};

export const resolveCategorySlug = (categoryOrId, name, slug) => {
  if (slug && typeof slug === "string") return slug;
  if (categoryOrId && typeof categoryOrId === "object") {
    return (
      categoryOrId.slug ||
      getCategorySlug(
        typeof categoryOrId.name === "string"
          ? categoryOrId.name
          : categoryOrId.name?.en || ""
      )
    );
  }
  return getCategorySlug(name);
};

/** SEO-friendly category listing URL */
export const getCategorySearchUrl = (id, name, slug) => {
  const resolvedSlug = resolveCategorySlug(null, name, slug);
  return resolvedSlug ? `/category/${resolvedSlug}` : `/search?_id=${id}`;
};

/** Legacy search URL — kept for redirects */
export const getLegacyCategorySearchUrl = (id, name) => {
  const slug = getCategorySlug(name);
  return slug ? `/search?category=${slug}&_id=${id}` : `/search?_id=${id}`;
};

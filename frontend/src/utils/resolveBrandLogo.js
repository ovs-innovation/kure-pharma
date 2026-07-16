const BRAND_LOGO_BY_SLUG = {
  "curemart-pharma": "/brands/curemart-pharma.svg",
  "cadila-pharmaceuticals": "/brands/cadila.svg",
  deltamed: "/brands/deltamed.svg",
  "dr-reddys": "/brands/dr-reddys.svg",
  zydus: "/brands/zydus.svg",
  "bdr-pharmaceuticals": "/brands/bdr.svg",
  mankind: "/brands/mankind.png",
  "natco-pharma": "/brands/natco.svg",
  natco: "/brands/natco.svg",
  "bharat-serums": "/brands/bharat-serums.webp",
  glenmark: "/brands/glenmark.png",
  lilly: "/brands/lilly.svg",
  pfizer: "/brands/pfizer.svg",
  astrazeneca: "/brands/astrazeneca.svg",
  novartis: "/brands/novartis.svg",
  "novo-nordisk": "/brands/novo-nordisk.svg",
  astellas: "/brands/astellas.svg",
};

const BRAND_LOGO_BY_NAME = {
  "curemart pharma": "/brands/curemart-pharma.svg",
  "cadila pharmaceuticals": "/brands/cadila.svg",
  deltamed: "/brands/deltamed.svg",
  "dr. reddy's": "/brands/dr-reddys.svg",
  zydus: "/brands/zydus.svg",
  "bdr pharmaceuticals": "/brands/bdr.svg",
};

const normalizeKey = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/['']/g, "'");

export const resolveBrandLogo = (brand) => {
  if (!brand) return null;

  const existing = brand.logo || brand.image;
  if (existing && String(existing).trim()) {
    return existing;
  }

  const slug = normalizeKey(brand.slug);
  if (slug && BRAND_LOGO_BY_SLUG[slug]) {
    return BRAND_LOGO_BY_SLUG[slug];
  }

  const name = normalizeKey(brand.name);
  if (name && BRAND_LOGO_BY_NAME[name]) {
    return BRAND_LOGO_BY_NAME[name];
  }

  return null;
};

export const enrichBrandLogos = (brands) =>
  Array.isArray(brands)
    ? brands.map((brand) => ({
        ...brand,
        logo: resolveBrandLogo(brand),
      }))
    : [];

export default resolveBrandLogo;

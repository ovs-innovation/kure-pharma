import Link from "next/link";
import SectionHeader from "@components/ui/SectionHeader";
import CatalogProductImage from "@components/ui/CatalogProductImage";
import CatalogReadMore from "@components/ui/CatalogReadMore";
import { getProductImageSrc } from "@utils/productImage";
import { breakthroughDrugs } from "@utils/kureHomepageRichContent";
import { filterStorefrontProducts } from "@utils/storefrontProducts";

const cardShell =
  "group flex flex-col h-full w-full min-w-0 border-2 border-[#c9a066]/55 rounded-sm bg-white overflow-hidden hover:border-[#b8860b]/80 hover:shadow-[0_6px_20px_rgba(184,134,11,0.12)] transition-all duration-300 text-center";

const getTitle = (product) => {
  if (!product?.title) return product?.name || "Product";
  if (typeof product.title === "string") return product.title;
  return product.title.en || product.title[Object.keys(product.title)[0]] || "Product";
};

const staticBreakthroughItems = breakthroughDrugs.slice(0, 12).map((item, index) => ({
  _id: `breakthrough-static-${index}`,
  name: item.name,
  title: { en: item.name },
  slug: item.slug,
  image: item.image,
  composition: item.subtitle,
  staticImage: item.image,
}));

const BreakthroughDrugs = ({ products = [], onEnquire }) => {
  const dbItems = filterStorefrontProducts(products).slice(0, 12);
  const items = dbItems.length ? dbItems : staticBreakthroughItems;

  if (!items.length) return null;

  return (
    <section className="kure-section kure-section-white kure-breakthrough">
      <div className="kure-container">
        <SectionHeader
          eyebrow="Breakthrough Therapies"
          title="Breakthrough Drugs Available In India"
          subtitle="Indian branded specialty medicines from trusted manufacturers — oncology, hematology, critical care and more."
        />

        <div className="kure-catalog-grid grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {items.map((product) => {
            const title = getTitle(product);
            const href = product.slug
              ? `/product/${product.slug}`
              : "/products";
            const subtitle =
              product.composition ||
              product.strength ||
              product.dosageForm ||
              "";

            return (
              <Link key={product._id} href={href} className={cardShell}>
                <CatalogProductImage
                  src={product.staticImage || getProductImageSrc(product)}
                  alt={title}
                />
                <div className="kure-catalog-card-body">
                  <h3 className="kure-catalog-card-title">{title}</h3>
                  {subtitle ? (
                    <p className="kure-breakthrough__composition">{subtitle}</p>
                  ) : null}
                  <CatalogReadMore href={href} />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="kure-breakthrough__footer">
          <p className="kure-breakthrough__note">
            More breakthrough drugs available across oncology, HIV, nephrology & imported specialty range.
          </p>
          <div className="kure-breakthrough__actions">
            <Link href="/products" className="kure-btn kure-btn-primary !text-sm">
              View Full Product Range
            </Link>
            {onEnquire ? (
              <button
                type="button"
                onClick={onEnquire}
                className="kure-btn kure-btn-outline !text-sm cursor-pointer"
              >
                Enquire Now
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BreakthroughDrugs;

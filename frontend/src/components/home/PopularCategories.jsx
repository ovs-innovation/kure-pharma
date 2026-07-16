import Link from "next/link";
import SectionHeader from "@components/ui/SectionHeader";
import { renderCategoryTherapyIcon } from "@utils/categoryIcons";

const PopularCategories = ({ title = "Popular Categories", items = [] }) => {
  if (!items.length) return null;

  return (
    <section className="kure-section kure-section-cream kure-popular-cats">
      <div className="kure-container">
        <SectionHeader
          eyebrow="Browse by Therapy"
          title={title}
          subtitle="Specialty therapeutic segments trusted by hospitals across India"
        />
        <div className="kure-popular-cats__grid">
          {items.map((cat, idx) => {
            const accent = cat.textColor || "#1A2E5B";
            const bg = cat.bgColor || "#F8FAFC";

            return (
              <Link
                key={idx}
                href={`/products?category=${encodeURIComponent(cat.category || cat.name)}`}
                className="kure-cat-item group"
                style={{
                  "--cat-color": accent,
                  "--cat-bg": bg,
                }}
              >
                <div className="kure-cat-item__card">
                  <div className="kure-cat-circle">
                    <span className="kure-cat-circle__ring kure-cat-circle__ring--outer" aria-hidden />
                    <span className="kure-cat-circle__ring kure-cat-circle__ring--inner" aria-hidden />
                    <span className="kure-cat-circle__icon-wrap kure-cat-circle__icon-wrap--therapy">
                      {renderCategoryTherapyIcon(cat)}
                    </span>
                  </div>
                </div>
                <span className="kure-cat-item__label">{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;

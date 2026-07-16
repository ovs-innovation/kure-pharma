import { useState } from "react";
import { resolveBrandLogo } from "@utils/resolveBrandLogo";

const BrandLogo = ({ brand }) => {
  const [imgError, setImgError] = useState(false);
  const logo = resolveBrandLogo(brand);
  const name = brand?.name || "Brand";

  if (imgError || !logo) {
    return (
      <span className="kure-brand-wordmark" aria-label={name}>
        {name}
      </span>
    );
  }

  return (
    <img
      src={logo}
      alt={name}
      className="kure-brand-logo"
      loading="lazy"
      onError={() => setImgError(true)}
    />
  );
};

const BrandCard = ({ brand }) => (
  <div className="kure-brand-card">
    <BrandLogo brand={brand} />
  </div>
);

const FeaturedBrands = ({ brands }) => {
  if (!brands?.length) return null;

  const loopBrands = [...brands, ...brands];

  return (
    <div className="kure-featured-brands">
      {/* Mobile & tablet — auto scroll */}
      <div className="kure-brands-marquee lg:hidden" aria-label="Featured brands">
        <div className="kure-brands-marquee-fade kure-brands-marquee-fade--left" />
        <div className="kure-brands-marquee-fade kure-brands-marquee-fade--right" />
        <div className="kure-brands-marquee-track">
          {loopBrands.map((brand, idx) => (
            <BrandCard key={`${brand._id || brand.name}-${idx}`} brand={brand} />
          ))}
        </div>
      </div>

      {/* Desktop — static grid */}
      <div className="kure-brands-grid hidden lg:grid">
        {brands.map((brand, idx) => (
          <BrandCard key={brand._id || idx} brand={brand} />
        ))}
      </div>
    </div>
  );
};

export default FeaturedBrands;

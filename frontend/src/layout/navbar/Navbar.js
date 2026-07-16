import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { FiMenu, FiX, FiPhoneCall, FiShield, FiTruck, FiAward, FiSearch, FiArrowRight } from "react-icons/fi";
import dynamic from "next/dynamic";
import ProductEnquiryModal from "@components/modal/ProductEnquiryModal";

const Navbar = () => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [genericEnquiryOpen, setGenericEnquiryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleSearch = (event) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) {
      router.push("/products");
      return;
    }
    router.push({
      pathname: "/products",
      query: { name: query },
    });
    setSearchQuery("");
    closeMobileMenu();
  };

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [router.asPath]);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about-us" },
    { name: "Products", href: "/products" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/contact-us" },
  ];

  const generalProductPlaceholder = {
    _id: "general",
    name: "General Sourcing Enquiry",
    shortDescription: "Bulk pharmaceutical sourcing across India.",
  };

  const isActive = (href) => {
    if (href === "/") return router.pathname === "/";
    return router.pathname.startsWith(href);
  };

  return (
    <>
      <div className="kure-trust-strip hidden sm:block">
        <div className="kure-nav-container kure-trust-strip__inner">
          <span className="kure-trust-strip__item">
            <FiShield className="w-3.5 h-3.5" />
            CDSCO Compliant Sourcing
          </span>
          <span className="kure-trust-strip__divider hidden md:inline" aria-hidden>|</span>
          <span className="kure-trust-strip__item">
            <FiTruck className="w-3.5 h-3.5" />
            Pan-India Cold Chain Delivery
          </span>
          <span className="kure-trust-strip__divider hidden lg:inline" aria-hidden>|</span>
          <span className="kure-trust-strip__item hidden lg:flex">
            <FiAward className="w-3.5 h-3.5" />
            Trusted Since 2016 · Delhi NCR
          </span>
        </div>
      </div>

      <header
        className={`kure-navbar sticky top-0 z-50 transition-shadow duration-300 ${
          isScrolled ? "kure-navbar--scrolled" : ""
        }`}
      >
        <div className="kure-nav-container">
          <div className="kure-navbar__inner">
            <Link
              href="/"
              className="kure-navbar__logo"
            >
              <img
                src="/kure-logo.png"
                alt="Kure Pharma"
                className="h-[4rem] sm:h-[4.25rem] lg:h-[5.5rem] w-auto max-w-[12rem] sm:max-w-[13rem] lg:max-w-[15rem] object-contain lg:-my-3"
              />
            </Link>

            <nav className="kure-navbar__nav hidden lg:flex">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`kure-nav-link ${isActive(item.href) ? "active" : ""}`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <form
              onSubmit={handleSearch}
              className="kure-nav-search hidden md:flex kure-navbar__search"
            >
              <FiSearch className="kure-nav-search__icon" aria-hidden />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search medicines, products..."
                className="kure-nav-search__input"
                aria-label="Search medicines and products"
              />
            </form>

            <div className="kure-navbar__actions hidden md:flex">
              <a href="tel:+919911972234" className="kure-navbar__phone">
                <span className="kure-navbar__phone-icon">
                  <FiPhoneCall className="w-4 h-4" />
                </span>
                <span className="hidden lg:inline">+91 99119 72234</span>
              </a>
              <button
                type="button"
                onClick={() => setGenericEnquiryOpen(true)}
                className="kure-nav-cta"
              >
                Send Enquiry
                <FiArrowRight className="w-3.5 h-3.5" aria-hidden />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="kure-navbar__menu-btn"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="kure-mobile-menu" role="presentation">
          <button
            type="button"
            className="kure-mobile-menu__overlay"
            onClick={closeMobileMenu}
            aria-label="Close menu"
          />
          <div
            className="kure-mobile-menu__panel"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div className="kure-mobile-menu__header">
              <Link href="/" className="flex items-center shrink-0" onClick={closeMobileMenu}>
                <img
                  src="/kure-logo.png"
                  alt="Kure Pharma"
                  className="h-11 w-auto object-contain"
                />
              </Link>
              <button
                type="button"
                className="kure-mobile-menu__close"
                onClick={closeMobileMenu}
                aria-label="Close menu"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSearch} className="kure-nav-search px-4 pb-3 md:hidden">
              <FiSearch className="kure-nav-search__icon" aria-hidden />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search medicines, products..."
                className="kure-nav-search__input"
                aria-label="Search medicines and products"
              />
            </form>

            <nav className="kure-mobile-menu__nav">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`kure-mobile-menu__link ${
                    isActive(item.href) ? "kure-mobile-menu__link--active" : ""
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="kure-mobile-menu__footer">
              <a href="tel:+919911972234" className="kure-mobile-menu__phone">
                <FiPhoneCall className="w-4 h-4 shrink-0" />
                <span>+91 99119 72234</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  closeMobileMenu();
                  setGenericEnquiryOpen(true);
                }}
                className="kure-btn kure-btn-primary w-full"
              >
                Send Enquiry
              </button>
            </div>
          </div>
        </div>
      )}

      <ProductEnquiryModal
        modalOpen={genericEnquiryOpen}
        setModalOpen={setGenericEnquiryOpen}
        product={generalProductPlaceholder}
      />
    </>
  );
};

export default dynamic(() => Promise.resolve(Navbar), { ssr: false });

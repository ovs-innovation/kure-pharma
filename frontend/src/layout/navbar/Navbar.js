import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { FiMenu, FiX, FiPhoneCall, FiShield, FiTruck, FiAward, FiSearch } from "react-icons/fi";
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
        <div className="kure-container flex flex-wrap items-center justify-center gap-x-6 gap-y-1 py-1.5">
          <span className="flex items-center gap-1.5">
            <FiShield className="w-3.5 h-3.5 text-[#FF9933]" />
            CDSCO Compliant Sourcing
          </span>
          <span className="hidden md:inline text-white/30">|</span>
          <span className="flex items-center gap-1.5">
            <FiTruck className="w-3.5 h-3.5 text-[#FF9933]" />
            Pan-India Cold Chain Delivery
          </span>
          <span className="hidden lg:inline text-white/30">|</span>
          <span className="hidden lg:flex items-center gap-1.5">
            <FiAward className="w-3.5 h-3.5 text-[#FF9933]" />
            Trusted Since 2016 · Delhi NCR
          </span>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 bg-[#FFF9F0]/95 backdrop-blur-md transition-shadow duration-300 ${
          isScrolled ? "shadow-lg shadow-[#1A2E5B]/8" : "border-b border-[#B8860B]/15"
        }`}
      >
        <div className="kure-container">
          <div className="flex items-center justify-between h-16 lg:h-[80px] gap-2 lg:gap-3">
            <Link
              href="/"
              className="relative flex items-center flex-shrink-0 min-w-0 z-20 -ml-1 sm:-ml-1.5 lg:-ml-2"
            >
              <img
                src="/kure-logo.png"
                alt="Kure Pharma"
                className="h-[3.6rem] sm:h-[3.9rem] lg:h-[120px] w-auto max-w-[11rem] sm:max-w-[12.5rem] lg:max-w-none object-contain lg:-my-[1.25rem] drop-shadow-sm"
              />
            </Link>

            <nav className="hidden lg:flex items-center gap-0.5 flex-shrink-0">
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
              className="kure-nav-search hidden md:flex flex-1 min-w-0 max-w-[11rem] lg:max-w-[15rem] xl:max-w-[17rem]"
            >
              <FiSearch className="kure-nav-search__icon" aria-hidden />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search medicines..."
                className="kure-nav-search__input"
                aria-label="Search medicines"
              />
            </form>

            <div className="hidden md:flex items-center gap-3 lg:gap-4 flex-shrink-0">
              <a
                href="tel:+919911972234"
                className="flex items-center gap-2 text-sm font-bold text-[#1A2E5B] hover:text-[#8B1A2E] transition-colors"
              >
                <span className="w-9 h-9 rounded-full bg-[#1A2E5B]/8 flex items-center justify-center">
                  <FiPhoneCall className="w-4 h-4 text-[#1A2E5B]" />
                </span>
                <span className="hidden xl:inline">+91 99119 72234</span>
              </a>
              <button
                type="button"
                onClick={() => setGenericEnquiryOpen(true)}
                className="kure-btn kure-btn-primary !py-2.5 !px-5 !text-xs"
              >
                Send Enquiry
              </button>
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="lg:hidden p-2.5 rounded-lg text-[#1A2E5B] hover:bg-[#1A2E5B]/8 border border-[#1A2E5B]/10 transition-colors shrink-0"
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
        <div className="kure-mobile-menu lg:hidden" role="presentation">
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
                placeholder="Search medicines..."
                className="kure-nav-search__input"
                aria-label="Search medicines"
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

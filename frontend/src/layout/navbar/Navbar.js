import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import { signOut } from "next-auth/react";
import {
  FiMenu, FiX, FiChevronDown, FiChevronRight, FiUser,
  FiShoppingBag, FiSearch, FiHeart, FiPhoneCall,
  FiMapPin, FiCheckCircle, FiGrid
} from "react-icons/fi";
import { useCart } from "react-use-cart";

import useUtilsFunction from "@hooks/useUtilsFunction";
import useGetSetting from "@hooks/useGetSetting";
import { UserContext } from "@context/UserContext";
import { SidebarContext } from "@context/SidebarContext";
import { WishlistContext } from "@context/WishlistContext";
import { getCategorySearchUrl } from "@utils/categoryUrl";

const Navbar = () => {
  const router = useRouter();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [pinnedDropdown, setPinnedDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { state: { userInfo } } = useContext(UserContext);
  const { storeCustomizationSetting } = useGetSetting();
  const { toggleCartDrawer, categories, services, isCategoriesLoading } = useContext(SidebarContext);
  const { items, emptyCart, cartTotal } = useCart();
  const { totalWishlistItems, clearWishlist } = useContext(WishlistContext);
  const { showingTranslateValue, getNumberTwo, currency } = useUtilsFunction();

  const handleLogOut = () => {
    signOut();
    Cookies.remove("userInfo");
    Cookies.remove("couponInfo");
    Cookies.remove("shippingAddress");
    emptyCart();
    if (typeof clearWishlist === 'function') clearWishlist();
    router.push("/");
  };

  useEffect(() => {
    setOpenDropdown(null);
    setPinnedDropdown(null);
    setMobileMenuOpen(false);
    setMobileServicesOpen(false);
    setMobileCategoriesOpen(false);
  }, [router.asPath]);

  // Close desktop dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest("[data-nav-dropdown]")) {
        setOpenDropdown(null);
        setPinnedDropdown(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const isDropdownOpen = (key) => openDropdown === key;

  const handleDropdownEnter = (key) => setOpenDropdown(key);

  const handleDropdownLeave = (key) => {
    if (pinnedDropdown !== key) setOpenDropdown(null);
  };

  const handleDropdownToggle = (key) => {
    if (openDropdown === key && pinnedDropdown === key) {
      setOpenDropdown(null);
      setPinnedDropdown(null);
      return;
    }
    setOpenDropdown(key);
    setPinnedDropdown(key);
  };

  const closeDropdown = () => {
    setOpenDropdown(null);
    setPinnedDropdown(null);
  };

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 1024) setMobileMenuOpen(false); };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const phone = storeCustomizationSetting?.navbar?.phone || "+91 9717372217";
  const email = storeCustomizationSetting?.contact_us?.email_box_email?.en || "elecmoonofficial@gmail.com";
  const address = showingTranslateValue(storeCustomizationSetting?.contact_us?.address_box_address_one) || "B-1/D GROUND FLOOR SAURAV VIHAR, JAITPUR NEAR CHOKAN MANDIR B, ADARPUR, DELHI 110044";

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about-us" },
    { name: "Blog", href: "/blog" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact-us" },
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?title=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <>
      <div className="sticky top-0 z-50 shadow-[0_2px_16px_rgba(0,0,0,0.08)]">

        {/* ── Top bar ── */}
        <div className="bg-[#0b1d3d] border-b border-white/5">
          <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 h-8 flex items-center justify-between">
            <div className="flex items-center gap-4 text-[10px] font-semibold text-white/50 uppercase tracking-wider overflow-hidden">
              <a href={`tel:${phone}`} className="flex items-center gap-1.5 hover:text-white transition-colors whitespace-nowrap">
                <FiPhoneCall className="w-3 h-3 text-[#ED1C24] flex-shrink-0" />
                <span className="truncate">{phone}</span>
              </a>
              <span className="hidden sm:flex items-center gap-1.5 whitespace-nowrap">
                <FiMapPin className="w-3 h-3 text-[#ED1C24] flex-shrink-0" />
                <span className="truncate">{address}</span>
              </span>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-semibold text-white/50 uppercase tracking-wider flex-shrink-0">
              <a href="https://www.shiprocket.in/shipment-tracking/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors whitespace-nowrap">Track Order</a>
              <span className="hidden md:flex items-center gap-1.5 whitespace-nowrap">
                <FiCheckCircle className="w-3 h-3 text-[#ED1C24]" />
                <span className="text-white/30">Authorized Partner</span>
              </span>
            </div>
          </div>
        </div>

        {/* ── Main header ── */}
        <div className="bg-white py-2">
          <div className="max-w-screen-2xl mx-auto px-4 lg:px-8">
            <div className="flex items-center gap-2 lg:gap-4 min-w-0">

              {/* Logo */}
              <Link href="/" className="flex-shrink-0">
                <div className="relative overflow-hidden flex items-center h-[48px] sm:h-[58px] lg:h-[68px] xl:h-[78px] w-[150px] sm:w-[190px] lg:w-[230px] xl:w-[260px]">
                  <img
                    src="/logo/elecmoon-transparent.png"
                    alt="ELECMOON"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-auto object-contain object-left origin-left h-[160%] scale-[1.55] sm:scale-[1.6] lg:scale-[1.65]"
                  />
                </div>
              </Link>

              {/* Nav links — desktop only, left of center */}
              <nav className="hidden lg:flex items-center gap-3 xl:gap-5 flex-shrink-0">
                {navLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-[12px] xl:text-[13px] font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${router.pathname === item.href ? 'text-[#ED1C24]' : 'text-gray-500 hover:text-[#0b1d3d]'}`}
                  >
                    {item.name}
                  </Link>
                ))}
                {/* Services Dropdown */}
                <div
                  data-nav-dropdown
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter("services")}
                  onMouseLeave={() => handleDropdownLeave("services")}
                >
                  <button
                    type="button"
                    onClick={() => handleDropdownToggle("services")}
                    className={`flex items-center gap-1 text-[12px] xl:text-[13px] font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${isDropdownOpen("services") ? "text-[#0b1d3d]" : "text-gray-500 hover:text-[#0b1d3d]"}`}
                  >
                    Services <FiChevronDown className={`w-3.5 h-3.5 transition-transform ${isDropdownOpen("services") ? "rotate-180" : ""}`} />
                  </button>
                  <div className={`absolute top-[calc(100%+10px)] left-0 w-56 bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-gray-100 transition-all duration-200 origin-top z-[70] overflow-hidden ${isDropdownOpen("services") ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2 pointer-events-none"}`}>
                    <div className="py-2">
                      {services.length > 0 ? services.map((service) => {
                        const name = showingTranslateValue(service.name);
                        if (!name) return null;
                        const href = service.slug ? `/service/${service.slug}` : `/services`;
                        return (
                          <Link key={service._id} href={href} onClick={closeDropdown} className="block px-5 py-2.5 text-[12px] font-bold text-gray-600 hover:text-[#0b1d3d] hover:bg-gray-50 transition-colors">
                            {name}
                          </Link>
                        );
                      }) : <div className="px-5 py-4 text-gray-400 text-xs">No services.</div>}
                      <Link href="/services" onClick={closeDropdown} className="block px-5 py-2.5 text-[11px] font-black text-[#ED1C24] uppercase tracking-wider hover:bg-gray-50 transition-colors border-t border-gray-50 mt-1">
                        View All Services →
                      </Link>
                    </div>
                  </div>
                </div>
              </nav>

              {/* ── Right side: Categories + Search ── */}
              <div className="hidden lg:flex items-center gap-2 ml-auto flex-shrink-0">

                {/* Categories dropdown */}
                <div
                  data-nav-dropdown
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter("categories")}
                  onMouseLeave={() => handleDropdownLeave("categories")}
                >
                  <button
                    type="button"
                    onClick={() => handleDropdownToggle("categories")}
                    className={`h-10 px-5 flex items-center gap-2.5 rounded-full text-[12px] font-black uppercase tracking-wider transition-all border ${isDropdownOpen("categories") ? "bg-[#0b1d3d] text-white border-[#0b1d3d]" : "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300"}`}
                  >
                    <FiGrid className="w-4 h-4" />
                    <span className="hidden xl:inline">Categories</span>
                    <FiChevronDown className={`w-3.5 h-3.5 transition-transform ${isDropdownOpen("categories") ? "rotate-180" : ""}`} />
                  </button>
                  <div className={`absolute top-[calc(100%+8px)] right-0 w-60 bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-gray-100 transition-all duration-200 origin-top z-[60] overflow-hidden ${isDropdownOpen("categories") ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2 pointer-events-none"}`}>
                    <div className="py-2 max-h-[55vh] overflow-y-auto">
                      {isCategoriesLoading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className="px-5 py-3 animate-pulse"><div className="h-3 bg-gray-100 rounded w-3/4" /></div>
                        ))
                      ) : categories.length > 0 ? (
                        categories.map((cat) => {
                          const catName = showingTranslateValue(cat.name);
                          return (
                          <Link key={cat._id} href={getCategorySearchUrl(cat._id, catName)} onClick={closeDropdown} className="flex items-center justify-between px-5 py-2.5 text-[13px] font-bold text-gray-600 hover:text-[#0b1d3d] hover:bg-gray-50 transition-all group/ci">
                            <span>{catName}</span>
                            <FiChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover/ci:text-[#ED1C24]" />
                          </Link>
                        );})
                      ) : (
                        <div className="px-5 py-4 text-gray-400 text-xs">No categories found.</div>
                      )}
                    </div>
                    <div className="p-3 border-t border-gray-50">
                      <Link href="/search" onClick={closeDropdown} className="block w-full py-2 text-center bg-[#0b1d3d] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#1a2e4d] transition-colors">
                        Browse All →
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Search */}
                <div className="relative w-40 xl:w-64 2xl:w-80">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search products..."
                    className="w-full h-10 pl-9 pr-10 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#0b1d3d] focus:ring-2 focus:ring-[#0b1d3d]/8 outline-none transition-all text-[13px] font-medium text-gray-700 placeholder:text-gray-400"
                  />
                  <button onClick={handleSearch} className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-[#0b1d3d] hover:bg-[#ED1C24] text-white rounded-lg flex items-center justify-center transition-colors">
                    <FiSearch className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Action Icons */}
              <div className="ml-auto lg:ml-0 flex items-center gap-1 flex-shrink-0">
                <Link href="/user/wishlist" className="hidden sm:flex w-9 h-9 items-center justify-center rounded-xl hover:bg-gray-100 relative transition-all text-gray-500 hover:text-[#ED1C24]">
                  <FiHeart className="w-4.5 h-4.5" />
                  {totalWishlistItems > 0 && (
                    <span className="absolute top-1 right-1 bg-[#ED1C24] text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center ring-1 ring-white">{totalWishlistItems}</span>
                  )}
                </Link>
                <button onClick={toggleCartDrawer} className="flex items-center gap-2 h-9 px-2.5 rounded-xl hover:bg-gray-100 transition-all text-gray-600 hover:text-[#0b1d3d]">
                  <div className="relative">
                    <FiShoppingBag className="w-4.5 h-4.5" />
                    {items?.length > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-[#ED1C24] text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center ring-1 ring-white">{items.length}</span>
                    )}
                  </div>
                  <div className="hidden xl:flex flex-col items-start leading-none">
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Cart</span>
                    <span className="text-[12px] font-black text-[#0b1d3d]">{currency}{getNumberTwo(cartTotal)}</span>
                  </div>
                </button>
                <Link href={userInfo ? "/user/dashboard" : "/auth/login"} className="flex items-center gap-1.5 h-9 px-2 rounded-xl hover:bg-gray-100 transition-all text-gray-600">
                  {userInfo?.image ? (
                    <img src={userInfo.image} alt="user" className="w-7 h-7 rounded-full object-cover ring-2 ring-gray-200" />
                  ) : (
                    <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center">
                      <FiUser className="w-4 h-4 text-gray-500" />
                    </div>
                  )}
                </Link>
                {/* Mobile hamburger */}
                <button className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-600 transition-colors" onClick={() => setMobileMenuOpen(true)}>
                  <FiMenu className="w-5 h-5" />
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <div className={`lg:hidden fixed inset-0 z-[100] ${mobileMenuOpen ? "visible" : "invisible"}`}>
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMobileMenuOpen(false)}
        />
        <div className={`absolute top-0 right-0 w-[85vw] max-w-[340px] h-full bg-white shadow-2xl flex flex-col transition-transform duration-300 ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
          {/* Mobile header */}
          <div className="px-5 py-4 bg-[#0b1d3d] flex items-center justify-between flex-shrink-0">
            <div>
              <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Welcome to</p>
              <p className="text-base font-black text-white tracking-wide">Elecmoon</p>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
              <FiX className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Mobile search */}
          <div className="px-4 py-3 border-b border-gray-50 flex-shrink-0">
            <div className="relative">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { handleSearch(); setMobileMenuOpen(false); } }}
                placeholder="Search products..."
                className="w-full h-11 pl-10 pr-4 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-gray-300 transition-colors"
              />
            </div>
          </div>

          {/* Mobile links */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
            <p className="text-[9px] font-black text-[#ED1C24] uppercase tracking-[0.2em] mb-2">Navigation</p>
            {[...navLinks].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-[13px] font-bold transition-all group ${router.pathname === item.href ? 'bg-[#0b1d3d] text-white' : 'text-gray-700 hover:bg-gray-50 hover:text-[#0b1d3d]'}`}
              >
                {item.name}
                <FiChevronRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-all" />
              </Link>
            ))}

            {/* Mobile Services — tap to expand */}
            <button
              type="button"
              onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
              className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-[13px] font-bold text-gray-700 hover:bg-gray-50 hover:text-[#0b1d3d] transition-all"
            >
              Services
              <FiChevronDown className={`w-4 h-4 transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`} />
            </button>
            {mobileServicesOpen && (
              <div className="ml-2 pl-2 border-l-2 border-gray-100 space-y-1">
                {services.length > 0 ? services.map((service) => {
                  const name = showingTranslateValue(service.name);
                  if (!name) return null;
                  const href = service.slug ? `/service/${service.slug}` : `/services`;
                  return (
                    <Link
                      key={service._id}
                      href={href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between px-4 py-2.5 rounded-lg text-[12px] font-bold text-gray-600 hover:bg-gray-50 hover:text-[#0b1d3d] transition-all"
                    >
                      {name}
                      <FiChevronRight className="w-3 h-3 text-gray-300" />
                    </Link>
                  );
                }) : (
                  <p className="px-4 py-2 text-xs text-gray-400">No services.</p>
                )}
                <Link
                  href="/services"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 text-[11px] font-black text-[#ED1C24] uppercase tracking-wider"
                >
                  View All Services →
                </Link>
              </div>
            )}

            {/* Mobile Categories — tap to expand */}
            {categories.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                  className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-[13px] font-bold text-gray-700 hover:bg-gray-50 hover:text-[#0b1d3d] transition-all mt-2"
                >
                  Categories
                  <FiChevronDown className={`w-4 h-4 transition-transform ${mobileCategoriesOpen ? "rotate-180" : ""}`} />
                </button>
                {mobileCategoriesOpen && (
                  <div className="ml-2 pl-2 border-l-2 border-gray-100 space-y-1">
                    {categories.map((cat) => {
                      const catName = showingTranslateValue(cat.name);
                      return (
                        <Link
                          key={cat._id}
                          href={getCategorySearchUrl(cat._id, catName)}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-between px-4 py-2.5 rounded-lg text-[12px] font-bold text-gray-600 hover:bg-gray-50 hover:text-[#0b1d3d] transition-all group"
                        >
                          {catName}
                          <FiChevronRight className="w-3 h-3 text-gray-200 group-hover:text-[#ED1C24]" />
                        </Link>
                      );
                    })}
                    <Link
                      href="/search"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-2.5 text-[11px] font-black text-[#0b1d3d] uppercase tracking-wider"
                    >
                      Browse All →
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile footer */}
          <div className="px-4 py-4 border-t border-gray-50 flex-shrink-0">
            <Link
              href={userInfo ? "/user/dashboard" : "/auth/login"}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-4 bg-[#0b1d3d] rounded-2xl shadow-md text-white w-full"
            >
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <FiUser className="w-4 h-4" />
              </div>
              <div className="flex flex-col leading-none min-w-0">
                <span className="text-[9px] text-white/40 uppercase font-bold tracking-wider">Account</span>
                <span className="text-[13px] font-black mt-0.5 truncate">{userInfo ? userInfo.name : "Login / Register"}</span>
              </div>
            </Link>
            {userInfo && (
              <button onClick={handleLogOut} className="w-full mt-2 py-3 text-[11px] font-bold text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors">
                Sign Out
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 99px; }
      `}</style>
    </>
  );
};

export default dynamic(() => Promise.resolve(Navbar), { ssr: false });

import { useState, useEffect, useRef, useCallback, useContext } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { FiSearch } from "react-icons/fi";

import ProductServices from "@services/ProductServices";
import { SidebarContext } from "@context/SidebarContext";
import useUtilsFunction from "@hooks/useUtilsFunction";
import { getCategorySearchUrl } from "@utils/categoryUrl";
import { getProductImageSrc } from "@utils/productImage";

const RECENT_KEY = "elecmoon_recent_searches";
const MAX_RECENT = 5;
const MAX_SUGGESTIONS = 6;

const readRecentSearches = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.slice(0, MAX_RECENT) : [];
  } catch {
    return [];
  }
};

const saveRecentSearch = (term) => {
  if (typeof window === "undefined" || !term?.trim()) return;
  const trimmed = term.trim();
  const next = [trimmed, ...readRecentSearches().filter((t) => t !== trimmed)].slice(
    0,
    MAX_RECENT
  );
  window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
};

const NavbarSearch = ({
  value,
  onChange,
  onSubmit,
  className = "",
  inputClassName = "",
  showButton = true,
  autoFocus = false,
}) => {
  const router = useRouter();
  const { categories } = useContext(SidebarContext);
  const { showingTranslateValue } = useUtilsFunction();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productMatches, setProductMatches] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const rootRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    setRecentSearches(readRecentSearches());
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categoryMatches = useCallback(() => {
    const q = value.trim().toLowerCase();
    if (!q || !categories?.length) return [];

    return categories
      .filter((cat) => {
        const name = showingTranslateValue(cat.name)?.toLowerCase() || "";
        return name.includes(q);
      })
      .slice(0, 4);
  }, [value, categories, showingTranslateValue]);

  useEffect(() => {
    const q = value.trim();
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!q) {
      setProductMatches([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await ProductServices.getShowingStoreProducts({
          title: encodeURIComponent(q),
          limit: "8",
        });
        setProductMatches((data?.products || data || []).slice(0, MAX_SUGGESTIONS));
      } catch {
        setProductMatches([]);
      } finally {
        setLoading(false);
      }
    }, 220);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value]);

  const matchedCategories = categoryMatches();
  const hasQuery = value.trim().length > 0;
  const showDropdown =
    open &&
    (hasQuery
      ? loading || productMatches.length > 0 || matchedCategories.length > 0
      : recentSearches.length > 0);

  const runSearch = (term) => {
    const q = (term ?? value).trim();
    if (!q) return;
    saveRecentSearch(q);
    setRecentSearches(readRecentSearches());
    setOpen(false);
    onSubmit?.(q);
    router.push(`/search?title=${encodeURIComponent(q)}`);
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none z-10" />
      <input
        type="search"
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            runSearch();
          }
          if (e.key === "Escape") setOpen(false);
        }}
        placeholder="Search Products, Categories, Brands..."
        aria-label="Search products, categories, and brands"
        aria-expanded={showDropdown}
        className={`w-full h-10 pl-9 ${showButton ? "pr-10" : "pr-3"} rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#0b1d3d] focus:ring-2 focus:ring-[#0b1d3d]/8 outline-none transition-all text-[13px] font-medium text-gray-700 placeholder:text-gray-400 ${inputClassName}`}
      />
      {showButton && (
        <button
          type="button"
          onClick={() => runSearch()}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-[#0b1d3d] hover:bg-[#ED1C24] text-white rounded-lg flex items-center justify-center transition-colors"
          aria-label="Search"
        >
          <FiSearch className="w-3.5 h-3.5" />
        </button>
      )}

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl border border-gray-100 shadow-[0_16px_48px_rgba(0,0,0,0.12)] z-[80] overflow-hidden max-h-[min(70vh,420px)] overflow-y-auto">
          {!hasQuery && recentSearches.length > 0 && (
            <div className="py-2">
              <p className="px-3 py-1 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Recent Searches
              </p>
              {recentSearches.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => runSearch(term)}
                  className="w-full text-left px-3 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-50"
                >
                  {term}
                </button>
              ))}
            </div>
          )}

          {hasQuery && matchedCategories.length > 0 && (
            <div className="py-2 border-b border-gray-50">
              <p className="px-3 py-1 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Categories
              </p>
              {matchedCategories.map((cat) => {
                const name = showingTranslateValue(cat.name);
                const href = getCategorySearchUrl(cat._id, name, cat.slug);
                return (
                  <Link
                    key={cat._id}
                    href={href}
                    onClick={() => {
                      saveRecentSearch(value.trim());
                      setOpen(false);
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 transition-colors"
                  >
                    {cat.icon ? (
                      <span className="relative w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                        <Image
                          src={cat.icon}
                          alt=""
                          fill
                          sizes="32px"
                          className="object-contain p-1"
                          unoptimized
                        />
                      </span>
                    ) : (
                      <span className="w-8 h-8 rounded-lg bg-gray-100 flex-shrink-0" />
                    )}
                    <span className="text-[13px] font-bold text-gray-700 truncate">{name}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {hasQuery && (
            <div className="py-2">
              <p className="px-3 py-1 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Products
              </p>
              {loading && (
                <p className="px-3 py-3 text-xs text-gray-400">Searching...</p>
              )}
              {!loading && productMatches.length === 0 && (
                <p className="px-3 py-3 text-xs text-gray-400">No matching products</p>
              )}
              {!loading &&
                productMatches.map((product) => {
                  const title = showingTranslateValue(product.title);
                  const href = product.slug ? `/product/${product.slug}` : "/search";
                  return (
                    <Link
                      key={product._id}
                      href={href}
                      onClick={() => {
                        saveRecentSearch(value.trim());
                        setOpen(false);
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 transition-colors"
                    >
                      <span className="relative w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                        <Image
                          src={getProductImageSrc(product, 0, { width: 120 })}
                          alt={title || "Product"}
                          fill
                          sizes="40px"
                          className="object-contain p-1"
                        />
                      </span>
                      <span className="text-[13px] font-medium text-gray-800 line-clamp-2 min-w-0">
                        {title}
                      </span>
                    </Link>
                  );
                })}
              {!loading && hasQuery && (
                <button
                  type="button"
                  onClick={() => runSearch()}
                  className="w-full text-left px-3 py-2.5 text-[12px] font-black text-[#0b1d3d] hover:bg-gray-50 border-t border-gray-50"
                >
                  View all results for &ldquo;{value.trim()}&rdquo;
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NavbarSearch;

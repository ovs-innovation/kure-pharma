import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { FaFacebookF, FaWhatsapp } from "react-icons/fa";
import {
  FiPhoneCall,
  FiMail,
  FiMapPin,
  FiClock,
  FiShield,
  FiTruck,
} from "react-icons/fi";

import SettingServices from "@services/SettingServices";
import kureHomepageDefaults from "@utils/kureHomepageDefaults";
import { kureTherapeuticCategories } from "@utils/kureTherapeuticCategories";

const BADGE_ICONS = [FiShield, FiTruck];

const Footer = () => {
  const { data: homepageSettings } = useQuery({
    queryKey: ["kureHomepage"],
    queryFn: () => SettingServices.getKureHomepageSetting(),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const footer = {
    ...kureHomepageDefaults.footer,
    ...homepageSettings?.footer,
  };

  const badges = (footer.badges || kureHomepageDefaults.footer.badges).filter(
    Boolean,
  );

  return (
    <footer className="bg-[#0f1a33] text-blue-100 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF9933] via-[#B8860B] to-[#138808]" />

      <div className="kure-container pt-14 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="kure-footer__logo">
              <img
                src="/logo/kurelogo.png"
                alt="Kure Pharma"
                className="kure-footer__logo-img"
              />
            </Link>
            <p className="text-sm leading-relaxed text-blue-100/75 max-w-sm">
              {footer.description}
            </p>
            {badges.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {badges.map((label, index) => {
                  const Icon = BADGE_ICONS[index % BADGE_ICONS.length];
                  return (
                    <span
                      key={`${label}-${index}`}
                      className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-white/8 border border-white/10 rounded-full px-3 py-1.5"
                    >
                      <Icon className="w-3 h-3 text-[#FF9933]" />
                      {label}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <h4 className="kure-footer-heading mb-5">Company</h4>
            <ul className="space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "About Us", href: "/about-us" },
                { label: "Products", href: "/products" },
                { label: "Contact Us", href: "/contact-us" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-blue-100/70 hover:text-[#FF9933] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="kure-footer-heading mb-5">Therapeutic Areas</h4>
            <ul className="space-y-3 text-sm text-blue-100/70">
              {kureTherapeuticCategories.map((item) => (
                <li key={item.name}>
                  <Link
                    href={`/products?category=${encodeURIComponent(item.category)}`}
                    className="hover:text-[#FF9933] transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="kure-footer-heading mb-5">Get In Touch</h4>
            <div className="space-y-4 text-sm">
              <a
                href={footer.phoneHref || `tel:${footer.phone?.replace(/\s/g, "")}`}
                className="flex items-center gap-3 text-blue-100/80 hover:text-[#FF9933] transition-colors"
              >
                <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-[#FF9933] flex items-center justify-center flex-shrink-0 transition-colors">
                  <FiPhoneCall className="w-4 h-4" />
                </span>
                <span>{footer.phone}</span>
              </a>
              <a
                href={`mailto:${footer.email}`}
                className="flex items-center gap-3 text-blue-100/80 hover:text-[#FF9933] transition-colors"
              >
                <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-[#FF9933] flex items-center justify-center flex-shrink-0 transition-colors">
                  <FiMail className="w-4 h-4" />
                </span>
                <span>{footer.email}</span>
              </a>
              <div className="flex items-start gap-3 text-blue-100/80">
                <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-[#FF9933] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FiMapPin className="w-4 h-4" />
                </span>
                <span className="leading-relaxed whitespace-pre-line">
                  {footer.address}
                </span>
              </div>
              <div className="flex items-center gap-3 text-blue-100/80">
                <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-[#FF9933] flex items-center justify-center flex-shrink-0">
                  <FiClock className="w-4 h-4" />
                </span>
                <span>{footer.hours}</span>
              </div>
            </div>
            <div className="flex gap-2.5 mt-5">
              {footer.whatsappUrl && (
                <a
                  href={footer.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#138808] flex items-center justify-center hover:scale-105 transition-transform"
                  aria-label="WhatsApp"
                >
                  <FaWhatsapp className="w-5 h-5 text-white" />
                </a>
              )}
              {footer.facebookUrl && (
                <a
                  href={footer.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#3b5998] flex items-center justify-center hover:scale-105 transition-transform"
                  aria-label="Facebook"
                >
                  <FaFacebookF className="w-4 h-4 text-white" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-blue-100/50">
          <p>
            © {new Date().getFullYear()} Kure Pharma. {footer.copyright}
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <Link href="/privacy-policy" className="hover:text-[#FF9933] transition-colors">
              Privacy
            </Link>
            <span className="text-white/15">|</span>
            <Link href="/terms-and-conditions" className="hover:text-[#FF9933] transition-colors">
              Terms
            </Link>
            <span className="text-white/15">|</span>
            <Link href="/shipping-policy" className="hover:text-[#FF9933] transition-colors">
              Shipping
            </Link>
            <span className="text-white/15">|</span>
            <Link href="/return-and-refund-policy" className="hover:text-[#FF9933] transition-colors">
              Returns
            </Link>
            <span className="text-white/15">|</span>
            <Link href="/legal-disclaimer" className="hover:text-[#FF9933] transition-colors">
              Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

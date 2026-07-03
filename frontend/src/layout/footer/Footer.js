import React from "react";
import Link from "next/link";
import { FaFacebookF, FaWhatsapp } from "react-icons/fa";
import { FiPhoneCall, FiMail, FiMapPin, FiClock } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-[#f8fafc] text-slate-600 border-t border-slate-200/80 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12">

          {/* ── Brand Column ── */}
          <div className="space-y-5">
            <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
              <img
                src="/kure-logo.png"
                alt="Kure Pharma Logo"
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-[13px] leading-relaxed text-slate-500 font-medium max-w-[280px]">
              Kure Pharma is a trusted pharmaceutical distributor of oncology, critical care, HIV, Nephrology and specialty medicines across India.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full border border-slate-200 hover:border-[#0F4C81] hover:bg-[#0F4C81]/5 text-slate-500 hover:text-[#0F4C81] flex items-center justify-center transition-all duration-300"
              >
                <FaFacebookF className="w-4 h-4" />
              </Link>
              <Link
                href="https://wa.me/919910768201"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full border border-slate-200 hover:border-[#25D366] hover:bg-[#25D366]/5 text-slate-500 hover:text-[#25D366] flex items-center justify-center transition-all duration-300"
              >
                <FaWhatsapp className="w-4 h-4" />
              </Link>
              <a
                href="mailto:info@kurepharma.com"
                aria-label="Email"
                className="w-9 h-9 rounded-full border border-slate-200 hover:border-[#0F4C81] hover:bg-[#0F4C81]/5 text-slate-500 hover:text-[#0F4C81] flex items-center justify-center transition-all duration-300"
              >
                <FiMail className="w-4 h-4" />
              </a>
              <a
                href="tel:+919910768201"
                aria-label="Phone"
                className="w-9 h-9 rounded-full border border-slate-200 hover:border-[#0F4C81] hover:bg-[#0F4C81]/5 text-slate-500 hover:text-[#0F4C81] flex items-center justify-center transition-all duration-300"
              >
                <FiPhoneCall className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div className="space-y-5">
            <h4 className="text-[13px] font-extrabold text-slate-800 uppercase tracking-widest border-b border-slate-200/60 pb-2 w-max pr-6">Quick Links</h4>
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
                    className="text-[13px] font-semibold text-slate-500 hover:text-[#0F4C81] transition-all hover:pl-1 duration-200 block w-max"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact Us ── */}
          <div className="space-y-5">
            <h4 className="text-[13px] font-extrabold text-slate-800 uppercase tracking-widest border-b border-slate-200/60 pb-2 w-max pr-6">Contact Us</h4>
            <div className="space-y-3.5 pt-1">
              <a
                href="tel:+919910768201"
                className="flex items-center gap-3 text-[13px] font-semibold text-slate-600 hover:text-[#0F4C81] transition-colors"
              >
                <span className="w-8 h-8 rounded-lg bg-[#0F4C81]/10 text-[#0F4C81] flex items-center justify-center flex-shrink-0">
                  <FiPhoneCall className="w-4 h-4" />
                </span>
                +91 99107 68201
              </a>
              <a
                href="mailto:info@kurepharma.com"
                className="flex items-center gap-3 text-[13px] font-semibold text-slate-600 hover:text-[#0F4C81] transition-colors"
              >
                <span className="w-8 h-8 rounded-lg bg-[#0F4C81]/10 text-[#0F4C81] flex items-center justify-center flex-shrink-0">
                  <FiMail className="w-4 h-4" />
                </span>
                info@kurepharma.com
              </a>
              <div className="flex items-start gap-3 text-[13px] font-medium text-slate-600">
                <span className="w-8 h-8 rounded-lg bg-[#0F4C81]/10 text-[#0F4C81] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FiMapPin className="w-4 h-4" />
                </span>
                <span className="leading-relaxed">
                  123, Pharma House, Sector 63,<br />
                  Noida, Uttar Pradesh - 201301
                </span>
              </div>
              <div className="flex items-center gap-3 text-[13px] font-medium text-slate-600">
                <span className="w-8 h-8 rounded-lg bg-[#0F4C81]/10 text-[#0F4C81] flex items-center justify-center flex-shrink-0">
                  <FiClock className="w-4 h-4" />
                </span>
                <span>Mon - Sat: 9:00 AM – 6:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="pt-6 border-t border-slate-200/60 flex flex-col md:flex-row items-center justify-between gap-4 text-[12px] font-medium text-slate-400">
          <p>© 2026 Kure Pharma. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-[#0F4C81] transition-colors">Privacy Policy</Link>
            <span className="text-slate-300">|</span>
            <Link href="/terms-and-conditions" className="hover:text-[#0F4C81] transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

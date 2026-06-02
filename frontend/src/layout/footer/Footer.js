import React, { useContext } from "react";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FiPhoneCall, FiMail, FiMapPin } from "react-icons/fi";

import useGetSetting from "@hooks/useGetSetting";
import useUtilsFunction from "@hooks/useUtilsFunction";
import { SidebarContext } from "@context/SidebarContext";

const Footer = () => {
  const { storeCustomizationSetting } = useGetSetting();
  const { showingTranslateValue } = useUtilsFunction();
  const { services } = useContext(SidebarContext);
  const footerPhone = "+91 9717372217";
  const footerAddress =
    "B-1/D GROUND FLOOR SAURAV VIHAR, JAITPUR NEAR CHOKAN MANDIR B, ADARPUR, DELHI 110044, NEW DELHI, DELHI, 110044, IN";
  return (
    <div className="bg-gray-100 text-gray-900 pt-10 pb-16 relative">
      {/* Red vertical bar on the right */}
      <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#ED1C24]"></div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* About Section */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <div className="relative overflow-hidden flex items-center h-[48px] sm:h-[58px] lg:h-[68px] xl:h-[78px] w-[150px] sm:w-[190px] lg:w-[230px] xl:w-[260px]">
                <img
                  src="/logo/elecmoon-transparent.png"
                  alt="ELECMOON"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-auto object-contain object-left origin-left h-[160%] scale-[1.55] sm:scale-[1.6] lg:scale-[1.65]"
                />
              </div>
            </Link>
            <p className="text-sm leading-7 text-gray-700">
              {showingTranslateValue(storeCustomizationSetting?.footer?.shipping_card) || 
              "At Elecmoon, we specialize in providing top-quality electrical testing, tagging, and fire safety services. Our mission is to ensure your workplace is safe and compliant."}
            </p>

            <div className="flex gap-3 pt-2">
              <Link
                href="https://facebook.com"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-[#000435] text-white flex items-center justify-center hover:bg-[#C53030] transition"
              >
                <FaFacebookF />
              </Link>
              <Link
                href="https://instagram.com"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-[#000435] text-white flex items-center justify-center hover:bg-[#C53030] transition"
              >
                <FaInstagram />
              </Link>
              <Link
                href="https://linkedin.com"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-full bg-[#000435] text-white flex items-center justify-center hover:bg-[#C53030] transition"
              >
                <FaLinkedinIn />
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-black">Contact Info</h3>
            <div className="text-sm space-y-3 text-gray-700">
              <div className="flex items-start gap-2">
                <FiPhoneCall className="text-[#ED1C24] mt-1 flex-shrink-0" />
                <a href={`tel:${footerPhone}`} className="font-medium hover:text-[#ED1C24] transition">
                  {footerPhone}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <FiMail className="text-[#ED1C24] mt-1 flex-shrink-0" />
                <p className="font-medium">{storeCustomizationSetting?.contact_us?.email_box_email?.en || "elecmoonofficial@gmail.com"}</p>
              </div>
              <div className="flex items-start gap-2">
                <FiMapPin className="text-[#ED1C24] mt-1 flex-shrink-0" />
                <p>{footerAddress}</p>
              </div>
            </div>
          </div>

          {/* Services — from database */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-black">Services</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {services?.length > 0 ? (
                services.map((service) => {
                  const name = showingTranslateValue(service.name);
                  if (!name) return null;
                  const href = service.slug ? `/service/${service.slug}` : "/services";
                  return (
                    <li key={service._id}>
                      <Link href={href} className="hover:text-[#ED1C24] transition">
                        {name}
                      </Link>
                    </li>
                  );
                })
              ) : (
                <li className="text-gray-400 text-xs">No services available.</li>
              )}
              {services?.length > 0 && (
                <li>
                  <Link href="/services" className="font-semibold text-[#ED1C24] hover:underline transition">
                    View All Services →
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* General Links */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-black">General Links</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><Link href="/" className="hover:text-[#ED1C24] transition">Home</Link></li>
              <li><Link href="/about-us" className="hover:text-[#ED1C24] transition">About Us</Link></li>
              <li><Link href="/pricing" className="hover:text-[#ED1C24] transition">Pricing</Link></li>
              <li><Link href="/blog" className="hover:text-[#ED1C24] transition">Blog</Link></li>
            
            </ul>
          </div>

          {/* Legal & Policies */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-black">Legal &amp; Policies</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><Link href="/privacy-policy" className="hover:text-[#ED1C24] transition">Privacy Policy</Link></li>
              <li><Link href="/terms-and-conditions" className="hover:text-[#ED1C24] transition">Terms &amp; Conditions</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-[#ED1C24] transition">Shipping Policy</Link></li>
              <li><Link href="/return-and-refund-policy" className="hover:text-[#ED1C24] transition">Return &amp; Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Elecmoon. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/privacy-policy" className="hover:text-[#ED1C24] transition">Privacy</Link>
            <Link href="/terms-and-conditions" className="hover:text-[#ED1C24] transition">Terms</Link>
            <Link href="/shipping-policy" className="hover:text-[#ED1C24] transition">Shipping</Link>
            <Link href="/return-and-refund-policy" className="hover:text-[#ED1C24] transition">Returns</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;


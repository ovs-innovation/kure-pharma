import React from "react";
import Layout from "@layout/Layout";
import PageHero from "@components/ui/PageHero";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import EnquiryServices from "@services/EnquiryServices";
import { motion } from "framer-motion";
import {
  FiClock,
  FiMapPin,
  FiPhoneCall,
  FiMail,
  FiChevronRight,
  FiSend,
  FiShield,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

import {
  KURE_ADDRESS_LINES,
  KURE_ADDRESS_MAP_EMBED,
} from "@utils/kureContactInfo";

const enquiryTypes = [
  ...kureTherapeuticCategories.map((item) => item.name),
  "General Enquiry",
];

const contactCards = [
  {
    icon: FiClock,
    title: "Business Hours",
    lines: ["Mon – Sat: 10am – 7pm", "Sunday: Closed"],
    bg: "bg-blue-50",
    color: "text-[#1A2E5B]",
  },
  {
    icon: FiMapPin,
    title: "Our Location",
    lines: KURE_ADDRESS_LINES,
    bg: "bg-red-50",
    color: "text-[#8B1A2E]",
  },
  {
    icon: FiPhoneCall,
    title: "Call Us",
    lines: ["+91 99119 72234"],
    href: "tel:+919911972234",
    bg: "bg-emerald-50",
    color: "text-emerald-600",
  },
  {
    icon: FiMail,
    title: "Email Us",
    lines: ["Kure.export@gmail.com"],
    href: "mailto:Kure.export@gmail.com",
    bg: "bg-purple-50",
    color: "text-purple-600",
  },
];

const ContactUs = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const enquiryData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        productId: null,
        productName: data.enquiryType || "Contact Form Enquiry",
        message: `Enquiry Type: ${data.enquiryType || "General"}\nLocation: ${data.location || "N/A"}\nMessage: ${data.message || "No message provided"}`,
      };
      await EnquiryServices.createEnquiry(enquiryData);
      toast.success("Thank you! We will contact you shortly.");
      reset();
    } catch (error) {
      console.log("error", error);
      toast.error(error?.response?.data?.message || "Failed to submit request.");
    }
  };

  return (
    <Layout
      title="Contact Us – Kure Pharma | Pharmaceutical Sourcing Enquiries"
      description="Get in touch with Kure Pharma for wholesale pharmaceutical enquiries, oncology medicines, and specialty drug sourcing across India."
    >
      <PageHero
        breadcrumb="Contact Us"
        title="Connect With"
        highlight="Kure Pharma"
        subtitle="Hospitals, clinics & pharmacies — get oncology, critical care & specialty medicine sourcing support across Bharat."
        bgImage="/hero-indian-distribution.png"
      />

      {/* ── CONTACT CARDS (floating overlap) ── */}
      <section className="relative z-20 -mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="kure-card p-8 sm:p-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex flex-col items-center text-center gap-4 group"
            >
              <div
                className={`w-14 h-14 rounded-2xl ${card.bg} flex items-center justify-center ${card.color} group-hover:scale-110 transition-transform duration-300`}
              >
                <card.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                  {card.title}
                </p>
                {card.href ? (
                  <a
                    href={card.href}
                    className={`text-sm font-bold ${card.color} hover:underline leading-relaxed`}
                  >
                    {card.lines.join("\n")}
                  </a>
                ) : (
                  card.lines.map((line, j) => (
                    <p key={j} className="text-sm font-semibold text-gray-700 leading-relaxed">
                      {line}
                    </p>
                  ))
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── MAP + FORM ── */}
      <section className="kure-section kure-section-cream">
        <div className="kure-container">
          <div className="grid lg:grid-cols-2 gap-10 items-start">

            {/* Left – Map + Quick contact */}
            <div className="space-y-6">
              {/* map */}
              <div className="w-full h-[400px] rounded-[2rem] overflow-hidden border border-gray-100 shadow-lg">
                <iframe
                  title="Kure Pharma Location"
                  src={KURE_ADDRESS_MAP_EMBED}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                />
              </div>

              {/* quick reach cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href="tel:+919911972234"
                  className="flex items-center gap-4 p-5 rounded-2xl border border-gray-100 bg-gray-50 hover:border-[#1A2E5B]/30 hover:bg-blue-50 transition-all group"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#1A2E5B]/10 flex items-center justify-center text-[#1A2E5B] group-hover:scale-110 transition-transform">
                    <FiPhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Call Now</p>
                    <p className="text-sm font-bold text-gray-800">+91 99119 72234</p>
                  </div>
                </a>

                <a
                  href="https://wa.me/919911972234"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-5 rounded-2xl border border-gray-100 bg-gray-50 hover:border-green-300 hover:bg-green-50 transition-all group"
                >
                  <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                    <FaWhatsapp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">WhatsApp</p>
                    <p className="text-sm font-bold text-gray-800">Chat with us</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Right – Enquiry Form */}
            <div className="kure-card p-8 lg:p-10">
              {/* form header */}
              <div className="mb-8">
                <span className="inline-block px-4 py-1.5 rounded-full text-[#8B1A2E] text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                  Get in Touch
                </span>
                <h2 className="text-3xl font-black text-[#1A2E5B] tracking-tight leading-tight">
                  Send Us a <span className="text-[#8B1A2E]">Message</span>
                </h2>
                <p className="text-gray-500 text-sm mt-2 font-medium">
                  Our team responds within 24 hours on business days.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name + Email */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name *"
                      className="kure-input bg-gray-50"
                      {...register("name", { required: "Name is required" })}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email Address *"
                      className="kure-input bg-gray-50"
                      {...register("email", { required: "Email is required" })}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    className="kure-input bg-gray-50"
                    {...register("phone", { required: "Phone is required" })}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                  )}
                </div>

                {/* Enquiry Type */}
                <div>
                  <select
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[#1A2E5B]/30 focus:border-[#1A2E5B] focus:outline-none bg-gray-50 text-gray-600 transition"
                    defaultValue=""
                    {...register("enquiryType", { required: "Please select an enquiry type" })}
                  >
                    <option value="" disabled>Select Enquiry Type *</option>
                    {enquiryTypes.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {errors.enquiryType && (
                    <p className="text-red-500 text-xs mt-1">{errors.enquiryType.message}</p>
                  )}
                </div>

                {/* City */}
                <input
                  type="text"
                  placeholder="Your City / Location"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[#1A2E5B]/30 focus:border-[#1A2E5B] focus:outline-none bg-gray-50 placeholder:text-gray-400 transition"
                  {...register("location")}
                />

                {/* Message */}
                <textarea
                  placeholder="Your Message / Requirements"
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[#1A2E5B]/30 focus:border-[#1A2E5B] focus:outline-none bg-gray-50 placeholder:text-gray-400 transition resize-none"
                  {...register("message")}
                />

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#1A2E5B] hover:bg-[#0a3460] text-white font-black text-sm px-6 py-4 rounded-xl transition-all shadow-lg shadow-blue-900/20 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Enquiry <FiSend className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* trust note */}
                <p className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 font-medium pt-1">
                  <FiShield className="w-3.5 h-3.5 text-[#1A2E5B]" />
                  Your information is 100% confidential and secure.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ── */}
      <section className="py-16 bg-gradient-to-br from-[#1f2937] to-[#374151] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
            Need Urgent Medicine Sourcing?
          </h2>
          <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto font-medium">
            Call or WhatsApp us directly for time-sensitive oncology or critical care drug requests.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <a
              href="tel:+919911972234"
              className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-xl font-extrabold text-sm hover:bg-gray-100 transition-all shadow-lg"
            >
              <FiPhoneCall className="w-4 h-4" /> Call Now
            </a>
            <a
              href="https://wa.me/919911972234"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-extrabold text-sm hover:bg-white hover:text-gray-900 transition-all"
            >
              <FaWhatsapp className="w-4 h-4" /> WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactUs;

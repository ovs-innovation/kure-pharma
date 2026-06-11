import React, { useState, useEffect } from "react";
import Link from "next/link";
import Layout from "@layout/Layout";
import { FiCheckCircle } from "react-icons/fi";

const ProductPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <Layout
      title="Lithium-ion Battery | Elecmoon"
      description="Explore our high-quality Lithium-ion Battery solutions for your business needs."
    >
      {/* Hero Section */}
      <div className="relative bg-[#0b1d3d] text-white min-h-[350px] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b1d3d] to-[#0b1d3d]/80 z-10" />
        <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1600&q=80')] bg-cover bg-center" />
        
        <div className="relative max-w-screen-xl mx-auto px-4 sm:px-10 py-16 z-20 w-full">
          <div className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <p className="text-[#ff5c23] font-bold uppercase tracking-widest text-sm mb-3">
              Products / Lithium-ion Battery
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6 max-w-3xl">
              Lithium-ion Battery
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl leading-8 mb-8">
              We provide industry-leading lithium-ion battery with uncompromising quality, 
              reliability, and performance to meet all your project requirements.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/category/lithium-ion-battery"
                className="px-8 py-3 bg-[#ff5c23] hover:bg-[#e04d18] text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Shop Lithium Products
              </Link>
              <Link
                href="/request-a-quote"
                className="px-8 py-3 border-2 border-white/30 hover:bg-white hover:text-[#0b1d3d] text-white font-bold rounded-full transition-all duration-300"
              >
                Request a Quote
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white py-16 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-10 flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-extrabold text-[#0b1d3d] mb-4">
              Premium Lithium-ion Battery Solutions
            </h2>
            <div className="w-20 h-1 bg-[#ff5c23] mb-6" />
            <p className="text-gray-600 text-lg leading-8 mb-6">
              Our lithium-ion battery is manufactured to the highest standards, ensuring optimal 
              efficiency and safety. Whether you are looking for scalability, precision, or raw power, 
              our products are designed to deliver exceptional results.
            </p>
            <ul className="space-y-4 mb-8">
              {['High Quality & Durability', 'Strict Quality Control', 'Competitive Pricing', 'Global Industry Standards'].map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3 text-gray-700 font-medium">
                  <FiCheckCircle className="text-[#ff5c23] w-5 h-5 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href="/contact-us"
              className="inline-block px-8 py-3 border-2 border-[#0b1d3d] hover:bg-[#0b1d3d] hover:text-white text-[#0b1d3d] font-bold rounded-full transition-all duration-300"
            >
              Contact Our Experts
            </Link>
          </div>
          <div className="lg:w-1/2 w-full">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-100 aspect-[4/3]">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-[#0e2550]">
                <span className="text-xl font-bold text-white opacity-50">Lithium-ion Battery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductPage;

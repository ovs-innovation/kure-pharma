import React from 'react';
import { motion } from 'framer-motion';
import {
  FiCheckCircle,
  FiFileText,
  FiPackage,
  FiTruck,
  FiShield,
  FiHeadphones
} from 'react-icons/fi';

const benefits = [
  {
    icon: <FiCheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: "Genuine Products",
    desc: "Authorized sourcing",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    hoverBorder: "hover:border-emerald-100"
  },
  {
    icon: <FiFileText className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: "GST Invoice",
    desc: "Business-ready billing",
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
    hoverBorder: "hover:border-red-100"
  },
  {
    icon: <FiPackage className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: "Bulk Orders",
    desc: "MOQ & tier pricing",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    hoverBorder: "hover:border-amber-100"
  },
  {
    icon: <FiTruck className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: "Fast Dispatch",
    desc: "Quick processing",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    hoverBorder: "hover:border-blue-100"
  },
  {
    icon: <FiShield className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: "Secure Payments",
    desc: "Safe checkout",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    hoverBorder: "hover:border-purple-100"
  },
  {
    icon: <FiHeadphones className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: "Technical Support",
    desc: "Expert assistance",
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
    hoverBorder: "hover:border-sky-100"
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemAnim = {
  hidden: { y: 16, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

const ServiceBenefits = () => {
  return (
    <div className="bg-white py-5 sm:py-6 border-b border-gray-100">
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-12">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3"
        >
          {benefits.map((item, idx) => (
            <motion.div
              key={idx}
              variants={itemAnim}
              className={`flex flex-col items-center text-center group cursor-default p-3 sm:p-4 rounded-2xl border border-gray-100/80 transition-all duration-300 ${item.hoverBorder} hover:shadow-[0_10px_32px_rgba(11,29,61,0.08)] hover:bg-gray-50/60`}
            >
              <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl ${item.iconBg} ${item.iconColor} flex items-center justify-center mb-2.5 transition-all duration-300 group-hover:scale-110 flex-shrink-0 shadow-sm`}>
                {item.icon}
              </div>
              <h3 className="text-[10px] sm:text-[11px] font-black text-gray-900 mb-0.5 tracking-tight leading-tight">{item.title}</h3>
              <p className="text-[8px] sm:text-[9px] text-gray-400 font-bold uppercase tracking-wider">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ServiceBenefits;

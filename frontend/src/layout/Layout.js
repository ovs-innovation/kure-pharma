import Head from "next/head";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import { FiPhoneCall, FiChevronUp } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

import Navbar from "@layout/navbar/Navbar";
import Footer from "@layout/footer/Footer";

const Layout = ({ title, description, children }) => {
  const router = useRouter();

  const handleScrollTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <ToastContainer />

      <div className="font-sans overflow-x-hidden min-h-screen flex flex-col bg-[#fdfbf7] text-[#1C1814]">
        <Head>
          <title>
            {title ? `Kure Pharma | ${title}` : "Kure Pharma | Trusted Pharmaceutical Solutions"}
          </title>
          <meta
            name="description"
            content={
              description ||
              "India's trusted pharmaceutical distributor — oncology, critical care & specialty medicines across Bharat."
            }
          />
          <link rel="icon" href="/favicon.png" />
        </Head>

        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
        </div>

        {/* Floating action buttons */}
        <div className="fixed right-4 bottom-6 flex flex-col gap-3 z-30">
          {/* WhatsApp floating button */}
          <a
            href="https://wa.me/919911972234"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:bg-[#20BD5A] transition-all hover:scale-105"
            aria-label="Chat on WhatsApp"
          >
            <FaWhatsapp className="w-6 h-6" />
          </a>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Layout;

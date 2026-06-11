import { SidebarContext } from "@context/SidebarContext";
import { useContext, useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

//internal import
import Layout from "@layout/Layout";
import useGetSetting from "@hooks/useGetSetting";
import ProductServices from "@services/ProductServices";
import FeatureCategory from "@components/category/FeatureCategory";
import ProductCatalog from "@components/product/ProductCatalog";
import HomeHeroBanner from "@components/home/HomeHeroBanner";
import ServiceBenefits from "@components/sections/ServiceBenefits";
import PromotionalBanners from "@components/sections/PromotionalBanners";
import CategoryServices from "@services/CategoryServices";
import useUtilsFunction from "@hooks/useUtilsFunction";
import {
  FaCheckCircle,
  FaFireExtinguisher,
} from "react-icons/fa";
import MainModal from "@components/modal/MainModal";
import InputArea from "@components/form/InputArea";
import LeadServices from "@services/LeadServices";

// Homepage Sections
import ServicesSection from "@components/home/ServicesSection";
import WhyChooseUs from "@components/home/WhyChooseUs";
import MelbourneBanner from "@components/home/MelbourneBanner";
import PricingSection from "@components/home/PricingSection";
import TestimonialSlider from "@components/home/TestimonialSlider";
import HomeProductsSection from "@components/home/HomeProductsSection";
import HomeCategoriesSection from "@components/home/HomeCategoriesSection";
import HomeBlogSection from "@components/home/HomeBlogSection";
import ProcessSection from "@components/home/ProcessSection";
import BatteryServiceSection from "@components/home/BatteryServiceSection";
import InteractiveBlogBanner from "@components/home/InteractiveBlogBanner";
import ModernCategoryBanner from "@components/home/ModernCategoryBanner";
import BrandSlider from "@components/common/BrandSlider";
import ShortVideoSection from "@components/home/ShortVideoSection";

// Services will be derived from Categories dynamically


const Home = ({
  popularProducts,
  discountProducts,
  newArrivalsProducts,
  attributes,
}) => {
  const router = useRouter();
  const { categories, isCategoriesLoading } = useContext(SidebarContext);
  const { loading, error, storeCustomizationSetting } = useGetSetting();
  const [welcomeModalOpen, setWelcomeModalOpen] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const { showingTranslateValue } = useUtilsFunction();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const {
    register: registerQuote,
    handleSubmit: handleSubmitQuote,
    reset: resetQuote,
    setValue: setQuoteValue,
    formState: { errors: errorsQuote },
  } = useForm();

  // console.log("storeCustomizationSetting", storeCustomizationSetting);

  // Show welcome popup modal when user visits the home page
  // useEffect(() => {
  //   if (!isLoading) {
  //     // Delay showing the modal by 1.5 seconds for better UX
  //     const timer = setTimeout(() => {
  //       setWelcomeModalOpen(true);
  //     }, 1500);
  //     return () => clearTimeout(timer);
  //   }
  // }, [isLoading]);

  const onSubmitEnquiry = async (data) => {
    try {
      const leadData = {
        ...data,
        product: {
          title: "General Enquiry",
          type: "home_page_enquiry",
        },
      };
      await LeadServices.addLead(leadData);
      setWelcomeModalOpen(false);
      toast.success("Thank you for your enquiry! We will contact you soon.");
      reset();
    } catch (error) {
      console.log("error", error);
      toast.error(
        error?.response?.data?.message || "Failed to submit enquiry."
      );
    }
  };

  const onSubmitQuote = async (data) => {
    try {
      const leadData = {
        ...data,
        service: selectedService || data.service,
        product: {
          title: "Quote Request",
          type: "quote_request",
        },
      };
      await LeadServices.addLead(leadData);
      setQuoteModalOpen(false);
      setSelectedService("");
      toast.success("Thank you for your quote request! We will contact you soon.");
      resetQuote();
    } catch (error) {
      console.log("error", error);
      toast.error(
        error?.response?.data?.message || "Failed to submit quote request."
      );
    }
  };

  const handleGetQuoteClick = (serviceName = "") => {
    setSelectedService(serviceName);
    if (serviceName) {
      setQuoteValue("service", serviceName);
    }
    setQuoteModalOpen(true);
  };



  // Get featured product image for the modal
  const getFeaturedImage = () => {
    if (popularProducts?.length > 0 && popularProducts[0]?.image?.[0]) {
      return popularProducts[0].image[0];
    }
    if (newArrivalsProducts?.length > 0 && newArrivalsProducts[0]?.image?.[0]) {
      return newArrivalsProducts[0].image[0];
    }
    if (discountProducts?.length > 0 && discountProducts[0]?.image?.[0]) {
      return discountProducts[0].image[0];
    }
    return null;
  };

  const featuredImage = getFeaturedImage();

  return (
    <>
      <Layout>
          {/* Hero Section: All Departments + Hero Slider */}
          <HomeHeroBanner />

          {/* Service Benefits Icons Section */}
          <ServiceBenefits />

          {/* Shop by Category */}
          <HomeCategoriesSection />

          {/* Battery Repair & Service Section */}
          <BatteryServiceSection />

          {/* How It Works Section - Dark & Premium */}
          <ProcessSection />

          {/* Popular & Trending Products */}
          <HomeProductsSection />

          {/* Interactive Blog CTA/Banner */}
          <InteractiveBlogBanner />

          {/* Latest Services & Products */}
          <ServicesSection />

          {/* Latest Blog Posts */}
          <HomeBlogSection />

          {/* Happy Client Testimonials */}
          <TestimonialSlider />

          {/* Product Video Shorts Section */}
          <ShortVideoSection />

          {/* Horizontal Brand Carousel */}
          <BrandSlider />

          {/* Innovations/Modern Animation Section */}
          <ModernCategoryBanner />


          {/* Welcome Popup Modal - Shows on page visit */}
          <MainModal
            modalOpen={welcomeModalOpen}
            setModalOpen={setWelcomeModalOpen}
          >
            {/* Modal content skipped for brevity, keeping the code structure if needed later */}
            {/* ... */}
          </MainModal>

          <MainModal
            modalOpen={quoteModalOpen}
            setModalOpen={setQuoteModalOpen}
          >
             {/* Quote Modal content */}
          </MainModal>


        </Layout>
    </>
  );
};

export default Home;
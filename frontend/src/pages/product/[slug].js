import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Link from "next/link";
import Head from "next/head";
import Layout from "@layout/Layout";
import ProductServices from "@services/ProductServices";
import EnquiryServices from "@services/EnquiryServices";
import useUtilsFunction from "@hooks/useUtilsFunction";
import { 
  FiChevronRight, 
  FiArrowLeft, 
  FiSend, 
  FiInfo, 
  FiDatabase, 
  FiActivity, 
  FiHeart, 
  FiBox, 
  FiShield, 
  FiLayers, 
  FiHelpCircle,
  FiTrendingUp
} from "react-icons/fi";
import { FaWhatsapp, FaGlobe } from "react-icons/fa";
import { getProductImageSrc } from "@utils/productImage";

const catColorMap = {
  "Oncology Medicines":   { light: "bg-[#F3EEFF]", text: "text-[#7C3AED]", border: "border-[#7C3AED]/20", badge: "bg-[#7C3AED] text-white", textBg: "bg-[#F3EEFF] text-[#7C3AED]" },
  "Anti Cancer Drugs":   { light: "bg-[#F3EEFF]", text: "text-[#7C3AED]", border: "border-[#7C3AED]/20", badge: "bg-[#7C3AED] text-white", textBg: "bg-[#F3EEFF] text-[#7C3AED]" },
  "Critical Care":      { light: "bg-[#FFF0F0]", text: "text-[#DC2626]", border: "border-[#DC2626]/20", badge: "bg-[#DC2626] text-white", textBg: "bg-[#FFF0F0] text-[#DC2626]" },
  "Immunotherapy":      { light: "bg-[#FFF0F5]", text: "text-[#BE185D]", border: "border-[#BE185D]/20", badge: "bg-[#BE185D] text-white", textBg: "bg-[#FFF0F5] text-[#BE185D]" },
  "Targeted Therapy":   { light: "bg-[#EFF7FF]", text: "text-[#1D4ED8]", border: "border-[#1D4ED8]/20", badge: "bg-[#1D4ED8] text-white", textBg: "bg-[#EFF7FF] text-[#1D4ED8]" },
  "Hematology":         { light: "bg-[#EFF7FF]", text: "text-[#1D4ED8]", border: "border-[#1D4ED8]/20", badge: "bg-[#1D4ED8] text-white", textBg: "bg-[#EFF7FF] text-[#1D4ED8]" },
  "Bone Health":        { light: "bg-[#EDFFF5]", text: "text-[#059669]", border: "border-[#059669]/20", badge: "bg-[#059669] text-white", textBg: "bg-[#EDFFF5] text-[#059669]" },
  "Injectable Medicines":{ light: "bg-[#FFFBEA]", text: "text-[#D97706]", border: "border-[#D97706]/20", badge: "bg-[#D97706] text-white", textBg: "bg-[#FFFBEA] text-[#D97706]" },
  "Oral Medicines":     { light: "bg-[#FFFBEA]", text: "text-[#D97706]", border: "border-[#D97706]/20", badge: "bg-[#D97706] text-white", textBg: "bg-[#FFFBEA] text-[#D97706]" },
  "Imported Medicines": { light: "bg-[#EDFFF5]", text: "text-[#059669]", border: "border-[#059669]/20", badge: "bg-[#059669] text-white", textBg: "bg-[#EDFFF5] text-[#059669]" },
  "Specialty Pharma":   { light: "bg-[#FFFBEA]", text: "text-[#D97706]", border: "border-[#D97706]/20", badge: "bg-[#D97706] text-white", textBg: "bg-[#FFFBEA] text-[#D97706]" },
};

const getTitleString = (titleObj) => {
  if (!titleObj) return "";
  if (typeof titleObj === "string") return titleObj;
  if (typeof titleObj === "object") {
    return titleObj.en || titleObj[Object.keys(titleObj)[0]] || "";
  }
  return "";
};

const getDetailProductImage = (prod) => {
  return getProductImageSrc(prod);
};

const ProductScreen = ({ product, relatedProducts }) => {
  const { showingTranslateValue } = useUtilsFunction();
  const [activeTab, setActiveTab] = useState("description");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  if (!product) {
    return (
      <Layout title="Product Not Found">
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl font-extrabold text-[#0B2545] mb-2">Product Not Found</h1>
          <p className="text-gray-500 mb-6">The requested product could not be found.</p>
          <Link href="/products" className="bg-[#134074] text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow hover:bg-[#0B2545] transition-all">
            Back to Products
          </Link>
        </div>
      </Layout>
    );
  }

  const productName = showingTranslateValue(product.title) || "Specialty Medicine";
  const productDescription = showingTranslateValue(product.description) || "No detailed description available.";
  const catName = getTitleString(product.category?.name || product.category) || "Specialty Pharma";
  const colors = catColorMap[catName] || { light: "bg-gray-50", text: "text-[#0F4C81]", border: "border-gray-200", badge: "bg-[#0F4C81] text-white", textBg: "bg-gray-100 text-gray-800" };
  const imageUrl = getDetailProductImage(product);

  const focusEnquiryForm = () => {
    const nameField = document.getElementById("enquiry-name");
    if (nameField) {
      nameField.scrollIntoView({ behavior: "smooth", block: "center" });
      nameField.focus();
    }
  };

  const onSubmitEnquiry = async (data) => {
    try {
      setIsSubmitting(true);
      const enquiryData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        companyName: data.companyName,
        address: data.address,
        state: data.state,
        district: data.district,
        pincode: data.pincode,
        quantity: Number(data.quantity || 1),
        product: {
          id: product._id,
          title: product.title || { en: productName },
          slug: product.slug || "",
          description: product.description || { en: productDescription },
          category: product.category || null,
          image: product.image || [],
          stock: product.stock ?? 999,
          stockQuantity: product.stock ?? 999,
          highlights: product.highlights || product.tag || "",
          manufacturer: product.manufacturer || "",
          composition: product.composition || "",
          strength: product.strength || "",
          dosageForm: product.dosageForm || "",
        },
        message: data.message,
        enquiryType: 'single',
      };

      await EnquiryServices.createEnquiry(enquiryData);
      toast.success("Your sourcing enquiry has been submitted successfully!");
      reset();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to submit enquiry. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout 
      title={product.seoTitle || `${productName} - Distributor & Supplier`} 
      description={product.seoDescription || product.shortDescription || productDescription}
    >
      <Head>
        {product.seoKeywords && (
          <meta name="keywords" content={product.seoKeywords} />
        )}
      </Head>

      <div className="py-12 bg-[#F8FBFF] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs & Back */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#0F4C81] overflow-hidden whitespace-nowrap">
              <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
              <FiChevronRight className="shrink-0 text-slate-400" />
              <Link href="/products" className="hover:text-orange-500 transition-colors">Products</Link>
              <FiChevronRight className="shrink-0 text-slate-400" />
              <span className="text-slate-800 truncate font-extrabold">{productName}</span>
            </div>
            <Link href="/products" className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-500 hover:text-slate-900 uppercase tracking-widest transition-colors">
              <FiArrowLeft className="w-3.5 h-3.5" /> Back to List
            </Link>
          </div>

          {/* Main Showcase Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
            
            {/* Left/Middle Column (col-span-8) */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Section 1: Hero Section Card */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                {/* Left: Product Image */}
                <div className="md:col-span-5 flex flex-col items-center justify-center">
                  <div className={`w-full rounded-xl aspect-square flex items-center justify-center p-6 overflow-hidden relative border border-slate-100 bg-slate-50/30`}>
                    <img
                      src={imageUrl}
                      alt={productName}
                      className="max-h-[220px] w-auto object-contain transition-transform duration-500 hover:scale-105"
                    />
                    <span className={`absolute top-3 left-3 text-[9px] font-black px-2.5 py-1 rounded-full border uppercase tracking-wider shadow-sm ${colors.badge} ${colors.border}`}>
                      {catName}
                    </span>
                  </div>
                </div>

                {/* Right: Spec Details & Sourcing CTA */}
                <div className="md:col-span-7 space-y-6">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#0F4C81] bg-[#0F4C81]/10 px-2.5 py-1 rounded-md border border-[#0F4C81]/15">
                      {catName} Category
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight leading-tight mt-3">
                      {productName}
                    </h1>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 border-t border-b border-slate-100 py-5">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Manufacturer</span>
                      <span className="text-sm font-bold text-slate-700">{product.manufacturer || "N/A"}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Composition</span>
                      <span className="text-sm font-bold text-slate-750 line-clamp-1">{product.composition || "N/A"}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Strength</span>
                      <span className="text-sm font-bold text-slate-700">{product.strength || "N/A"}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Availability</span>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> {product.availability || "Sourcing Available"}
                      </span>
                    </div>
                    {product.dosageForm && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Dosage Form</span>
                        <span className="text-sm font-bold text-slate-700">{product.dosageForm}</span>
                      </div>
                    )}
                    {product.route && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Route</span>
                        <span className="text-sm font-bold text-slate-700">{product.route}</span>
                      </div>
                    )}
                    {product.coldChain && (
                      <div className="space-y-1 col-span-1 sm:col-span-2">
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-[#E53935] bg-[#E53935]/10 border border-[#E53935]/25 rounded-md px-2.5 py-1 uppercase tracking-wider">
                          ❄️ Cold Chain Logistics Required (2°C - 8°C)
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-1">
                    <button
                      onClick={focusEnquiryForm}
                      className="bg-[#0F4C81] hover:bg-[#0c3d67] text-white font-bold text-xs py-3 px-6 rounded-xl transition-all shadow-sm hover:shadow uppercase tracking-wider cursor-pointer text-center"
                    >
                      Send Enquiry
                    </button>
                    <a
                      href={`https://wa.me/919910768201?text=Hello%20Kure%20Pharma%2C%20I%20am%20inquiring%20about%20${encodeURIComponent(productName)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-[11px] py-3 px-6 rounded-xl transition-all shadow-sm uppercase tracking-wider text-center"
                    >
                      <FaWhatsapp className="w-4.5 h-4.5" /> WhatsApp Sourcing
                    </a>
                  </div>
                </div>
              </div>

              {/* Section 2: Product Facts Card */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
                <div className="border-b border-slate-100 pb-3 mb-6">
                  <h2 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <FiTrendingUp className="text-[#0F4C81] w-4 h-4" /> Technical Specifications
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100/50">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Product Name</span>
                    <span className="text-xs font-bold text-slate-700 mt-1 block">{productName}</span>
                  </div>
                  <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100/50">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Composition</span>
                    <span className="text-xs font-bold text-slate-700 mt-1 block">{product.composition || "N/A"}</span>
                  </div>
                  <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100/50">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Strength</span>
                    <span className="text-xs font-bold text-slate-700 mt-1 block">{product.strength || "N/A"}</span>
                  </div>
                  <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100/50">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Manufacturer</span>
                    <span className="text-xs font-bold text-slate-700 mt-1 block">{product.manufacturer || "N/A"}</span>
                  </div>
                  <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100/50">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Category</span>
                    <span className="text-xs font-bold text-slate-700 mt-1 block">{catName}</span>
                  </div>
                  <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100/50">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Sourcing Availability</span>
                    <span className="text-xs font-bold text-emerald-600 mt-1 block">{product.availability || "Global Distribution"}</span>
                  </div>
                  {product.dosageForm && (
                    <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100/50">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Dosage Form</span>
                      <span className="text-xs font-bold text-slate-700 mt-1 block">{product.dosageForm}</span>
                    </div>
                  )}
                  {product.route && (
                    <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100/50">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Route</span>
                      <span className="text-xs font-bold text-slate-700 mt-1 block">{product.route}</span>
                    </div>
                  )}
                  {product.coldChain !== undefined && (
                    <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100/50">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Cold Chain</span>
                      <span className={`text-xs font-bold mt-1 block ${product.coldChain ? "text-[#E53935]" : "text-slate-550"}`}>
                        {product.coldChain ? "Required (2-8°C)" : "Not Required"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 3: Tabbed Technical Information */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
                <div className="flex flex-wrap border-b border-slate-100 bg-slate-50/60 scrollbar-thin overflow-x-auto">
                  {[
                    { id: "description", label: "Description", icon: FiInfo },
                    { id: "composition", label: "Composition", icon: FiDatabase },
                    { id: "indications", label: "Indications", icon: FiActivity },
                    { id: "dosage", label: "Dosage", icon: FiHeart },
                    { id: "packaging", label: "Packaging", icon: FiBox },
                    { id: "storage", label: "Storage", icon: FiLayers },
                    { id: "faqs", label: "FAQs", icon: FiHelpCircle }
                  ].map((tab) => {
                    const TabIcon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-5 py-4 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                          activeTab === tab.id
                            ? "border-[#0F4C81] text-[#0F4C81] bg-white font-extrabold"
                            : "border-transparent text-slate-400 hover:text-slate-700"
                        }`}
                      >
                        <TabIcon className="w-3.5 h-3.5 shrink-0" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                <div className="p-6 sm:p-8 text-[13px] font-medium text-slate-600 leading-relaxed min-h-[160px] whitespace-pre-line">
                  {activeTab === "description" && (
                    <div>
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3">About {productName}</h4>
                      <p className="text-slate-600">{productDescription || product.shortDescription || "No detailed description available."}</p>
                    </div>
                  )}
                  {activeTab === "composition" && (
                    <div>
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3">Active Ingredients</h4>
                      <p className="text-slate-600">{product.composition || "Active pharmaceutical ingredients conform to the reference brand formulation standards."}</p>
                    </div>
                  )}
                  {activeTab === "indications" && (
                    <div>
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3">Therapeutic Indications</h4>
                      <p className="text-slate-600">{product.indications || "Indications details are restricted. Please consult the product pack insert or request clinical specifications from our sourcing desk."}</p>
                    </div>
                  )}
                  {activeTab === "dosage" && (
                    <div>
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3">Dosage Guidelines</h4>
                      <p className="text-slate-600">{product.dosage || "As directed by a registered medical practitioner or specialist oncologist."}</p>
                    </div>
                  )}
                  {activeTab === "packaging" && (
                    <div>
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3">Commercial Packaging</h4>
                      <p className="text-slate-600">{product.packaging || "Packaging conforms to original manufacturer export configurations (e.g. vials, blister packs)."}</p>
                    </div>
                  )}
                  {activeTab === "storage" && (
                    <div>
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3">Storage & Handling</h4>
                      <p className="font-bold text-[#0F4C81] bg-[#0F4C81]/5 p-3 rounded-lg border border-[#0F4C81]/15 inline-block">
                        {product.storageConditions || product.storage || "Store as directed on the packaging label."}
                      </p>
                    </div>
                  )}
                  {activeTab === "faqs" && (
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-bold text-slate-850 mb-1">Q: Is a medical prescription mandatory to import or source this medicine?</h5>
                        <p className="text-slate-550">A: Yes. Under international and local regulatory laws, a valid prescription from a registered medical specialist is required to secure sourcing quotes and supply.</p>
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-850 mb-1">Q: How are temperature-sensitive (cold-chain) oncology drugs shipped?</h5>
                        <p className="text-slate-550">A: We deploy specialized temperature-controlled packaging utilizing validated cold-chain logistics (2°C to 8°C) with real-time temperature loggers to preserve efficacy.</p>
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-850 mb-1">Q: What documentation is provided for pharmaceutical clearance?</h5>
                        <p className="text-slate-550">A: All shipments are accompanied by Certificate of Analysis (COA), manufacturer invoice, country of origin certificate, and import/export documentation.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 4: Dynamic Custom Sections Array */}
              {product.customSections && product.customSections.length > 0 && (
                <div className="space-y-6">
                  {product.customSections.map((sec, idx) => (
                    <div key={idx} className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
                      <div className="border-b border-slate-100 pb-3 mb-4">
                        <h2 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                          <FaGlobe className="text-[#0F4C81] w-4 h-4" /> {sec.title}
                        </h2>
                      </div>
                      <div className="text-[13px] font-medium text-slate-600 leading-relaxed whitespace-pre-line">
                        {sec.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* Right Side Column (col-span-4): Sourcing Enquiry Card Form */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <FiShield className="text-[#0F4C81] w-4 h-4" /> Sourcing Desk
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-normal">Get custom distributor quotes from our global pharmaceutical sourcing desk.</p>
              </div>

              <form onSubmit={handleSubmit(onSubmitEnquiry)} className="space-y-4">
                <div>
                  <label className="block text-[9px] font-bold text-slate-450 uppercase tracking-wider mb-1">Your Name *</label>
                  <input
                    {...register("name", { required: "Name is required" })}
                    id="enquiry-name"
                    type="text"
                    placeholder="Enter your name"
                    className={`w-full bg-slate-50 border rounded-xl py-3 px-4 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/15 focus:border-[#0F4C81] transition duration-200 ${
                      errors.name ? "border-red-500" : "border-slate-200"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-slate-450 uppercase tracking-wider mb-1">Corporate Email *</label>
                  <input
                    {...register("email", { 
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                    type="email"
                    placeholder="name@institution.com"
                    className={`w-full bg-slate-50 border rounded-xl py-3 px-4 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/15 focus:border-[#0F4C81] transition duration-200 ${
                      errors.email ? "border-red-500" : "border-slate-200"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-slate-450 uppercase tracking-wider mb-1">Phone Number *</label>
                  <input
                    {...register("phone", { required: "Phone is required" })}
                    type="text"
                    placeholder="e.g. +91 99107..."
                    className={`w-full bg-slate-50 border rounded-xl py-3 px-4 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/15 focus:border-[#0F4C81] transition duration-200 ${
                      errors.phone ? "border-red-500" : "border-slate-200"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-slate-450 uppercase tracking-wider mb-1">Company / Institution</label>
                  <input
                    {...register("companyName")}
                    type="text"
                    placeholder="Institution / Pharmacy Name"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/15 focus:border-[#0F4C81] transition duration-200"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-slate-450 uppercase tracking-wider mb-1">Quantity Required *</label>
                  <input
                    {...register("quantity", { 
                      required: "Quantity is required",
                      min: { value: 1, message: "Quantity must be at least 1" }
                    })}
                    type="number"
                    placeholder="Enter quantity (e.g. 50)"
                    className={`w-full bg-slate-50 border rounded-xl py-3 px-4 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/15 focus:border-[#0F4C81] transition duration-200 ${
                      errors.quantity ? "border-red-500" : "border-slate-200"
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-[9px] font-bold text-slate-450 uppercase tracking-wider mb-1">Full Address *</label>
                    <input
                      {...register("address", { required: "Address is required" })}
                      type="text"
                      placeholder="Shipping / Delivery address"
                      className={`w-full bg-slate-50 border rounded-xl py-3 px-4 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/15 focus:border-[#0F4C81] transition duration-200 ${
                        errors.address ? "border-red-500" : "border-slate-200"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-slate-450 uppercase tracking-wider mb-1">District / City *</label>
                    <input
                      {...register("district", { required: "District is required" })}
                      type="text"
                      placeholder="e.g. Noida"
                      className={`w-full bg-slate-50 border rounded-xl py-3 px-4 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/15 focus:border-[#0F4C81] transition duration-200 ${
                        errors.district ? "border-red-500" : "border-slate-200"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-slate-450 uppercase tracking-wider mb-1">State *</label>
                    <input
                      {...register("state", { required: "State is required" })}
                      type="text"
                      placeholder="e.g. Uttar Pradesh"
                      className={`w-full bg-slate-50 border rounded-xl py-3 px-4 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/15 focus:border-[#0F4C81] transition duration-200 ${
                        errors.state ? "border-red-500" : "border-slate-200"
                      }`}
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-[9px] font-bold text-slate-450 uppercase tracking-wider mb-1">Pincode / Zipcode *</label>
                    <input
                      {...register("pincode", { required: "Pincode is required" })}
                      type="text"
                      placeholder="6-digit pincode"
                      className={`w-full bg-slate-50 border rounded-xl py-3 px-4 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/15 focus:border-[#0F4C81] transition duration-200 ${
                        errors.pincode ? "border-red-500" : "border-slate-200"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-slate-450 uppercase tracking-wider mb-1">Quantity & Sourcing Details *</label>
                  <textarea
                    {...register("message", { required: "Message is required" })}
                    placeholder="Please specify packaging type, strength, target port..."
                    rows="4"
                    className={`w-full bg-slate-50 border rounded-xl py-3 px-4 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/15 focus:border-[#0F4C81] transition duration-200 ${
                      errors.message ? "border-red-500" : "border-slate-200"
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#0F4C81] hover:bg-[#0c3d67] disabled:bg-slate-350 text-white font-bold text-xs py-3.5 rounded-xl transition-all duration-300 shadow-sm uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FiSend className="w-3.5 h-3.5" /> {isSubmitting ? "Sending..." : "Submit Enquiry"}
                </button>
              </form>

              <div className="border-t border-slate-100 pt-4">
                <a
                  href={`https://wa.me/919910768201?text=Hello%20Kure%20Pharma%2C%20I%20am%20inquiring%20about%20${encodeURIComponent(productName)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs py-3.5 rounded-xl transition-all duration-300 shadow-sm uppercase tracking-widest flex items-center justify-center gap-2 text-center"
                >
                  <FaWhatsapp className="w-4.5 h-4.5" /> WhatsApp Sourcing
                </a>
              </div>
            </div>

          </div>

          {/* Section 5: Related Products Section */}
          {relatedProducts?.length > 0 && (
            <div className="space-y-6 mt-16 border-t border-slate-100 pt-10">
              <div className="pb-3 flex items-center justify-between">
                <h2 className="text-base font-black text-slate-800 uppercase tracking-wider">Related {catName} Medicines</h2>
                <Link href="/products" className="text-xs font-bold text-[#0F4C81] hover:text-orange-500 transition-colors uppercase tracking-widest">
                  View All Products →
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                {relatedProducts.map((p) => {
                  const pCatName = getTitleString(p.category?.name || p.category) || catName;
                  const pColors = catColorMap[pCatName] || colors;
                  const pImg = getDetailProductImage(p);
                  const pTitle = getTitleString(p.title) || p.name || "";
                  return (
                    <div 
                      key={p._id} 
                      className="bg-white rounded-2xl border border-slate-100 hover:border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_24px_-6px_rgba(15,76,129,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col group p-4 text-center relative overflow-hidden"
                    >
                      {/* Category Tag */}
                      <span className={`absolute top-2.5 left-2.5 text-[8px] font-black px-2.5 py-0.5 rounded-full border tracking-wider uppercase z-10 shadow-sm ${pColors.badge} ${pColors.border}`}>
                        {pCatName}
                      </span>
                      {/* Image area */}
                      <div className="relative h-28 w-full flex items-center justify-center bg-white mb-3 mt-2 overflow-hidden rounded-lg">
                        <img src={pImg} alt={pTitle} className="h-full w-full object-contain p-1 transition-transform duration-500 group-hover:scale-105" />
                      </div>
                      {/* Details */}
                      <div className="flex flex-col flex-grow justify-between">
                        <div className="w-full">
                          <h4 className="text-[12px] font-bold text-slate-800 line-clamp-2 leading-snug mb-1 min-h-[32px] group-hover:text-[#0F4C81] transition-colors duration-200">{pTitle}</h4>
                          <p className="text-[10px] text-slate-400 font-medium truncate mb-3">{p.composition || "Specialty Formulation"}</p>
                        </div>
                        <div className="mt-auto w-full flex justify-center pb-0.5">
                          <Link href={`/product/${p.slug}`} className="inline-flex items-center justify-center w-full text-[10px] font-extrabold text-[#0F4C81] hover:text-white border border-[#0F4C81]/25 hover:border-[#0F4C81] hover:bg-[#0F4C81] py-1.5 px-3 rounded-lg transition-all duration-200 uppercase tracking-wider">
                            Read more
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps = async (context) => {
  const { slug } = context.params;
  try {
    const productData = await ProductServices.getProductBySlug(slug);
    if (!productData) {
      return {
        notFound: true,
      };
    }

    // Fetch related products in same category
    let relatedProducts = [];
    try {
      const catId = productData.category?._id || productData.category;
      const relatedRes = await ProductServices.getAllProducts({
        category: catId,
        limit: 10
      });
      relatedProducts = (relatedRes.products || [])
        .filter((p) => p._id !== productData._id)
        .slice(0, 5);
    } catch (e) {
      console.error("Error fetching related products:", e);
    }

    return {
      props: {
        product: productData,
        relatedProducts,
      },
    };
  } catch (error) {
    console.error("Error fetching product on details page:", error);
    return {
      props: { product: null, relatedProducts: [] },
    };
  }
};

export default ProductScreen;



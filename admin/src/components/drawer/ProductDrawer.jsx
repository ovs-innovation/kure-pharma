import { Input, Textarea } from "@windmill/react-ui";
import React, { useEffect, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { useTranslation } from "react-i18next";
import { FiX } from "react-icons/fi";
import CategoryServices from "@/services/CategoryServices";

//internal import
import Title from "@/components/form/others/Title";
import Error from "@/components/form/others/Error";
import InputArea from "@/components/form/input/InputArea";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import LabelArea from "@/components/form/selectOption/LabelArea";
import DrawerButton from "@/components/form/button/DrawerButton";
import useProductSubmit from "@/hooks/useProductSubmit";
import Uploader from "@/components/image-uploader/Uploader";
import UploaderThree from "@/components/image-uploader/UploaderThree";

// A clean, reusable section header
const SectionHeader = ({ title }) => (
  <div className="border-t border-gray-200 dark:border-gray-600 mt-8 mb-5 pt-5">
    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</h4>
  </div>
);

// A single-select category dropdown
const CategoryDropdown = ({ categories, value, onChange, placeholder }) => {
  const { showingTranslateValue } = useUtilsFunction();
  return (
    <select
      className="border text-sm block w-full bg-gray-100 border-gray-200 rounded-md p-2"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{placeholder || "-- Select --"}</option>
      {categories.map((cat) => (
        <option key={cat._id} value={cat._id}>
          {showingTranslateValue(cat.name)}
        </option>
      ))}
    </select>
  );
};

const ProductDrawer = ({ id }) => {
  const { t } = useTranslation();

  // All categories (flat list from API)
  const [allCategories, setAllCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedMainCatId, setSelectedMainCatId] = useState("");
  const [selectedSubCatId, setSelectedSubCatId] = useState("");

  const {
    values,
    register,
    onSubmit,
    errors,
    openModal,
    imageUrl,
    setImageUrl,
    handleSubmit,
    isSubmitting,
    handleProductSlug,
    handleSelectLanguage,
    setValue,
    handleSelectImage,
    onCloseModal,
    setSelectedCategory,
    setDefaultCategory,
    productFaqs,
    setProductFaqs,
  } = useProductSubmit(id);

  const { showingTranslateValue } = useUtilsFunction();

  // Load all categories
  useEffect(() => {
    CategoryServices.getAllCategories()
      .then((data) => {
        if (Array.isArray(data)) {
          setAllCategories(data);
        }
      })
      .catch(() => setAllCategories([]));
  }, []);

  // When main category changes, filter sub-categories
  useEffect(() => {
    if (selectedMainCatId) {
      const subs = allCategories.filter((c) => c.parentId === selectedMainCatId);
      setSubCategories(subs);
      setSelectedSubCatId("");
    } else {
      setSubCategories([]);
      setSelectedSubCatId("");
    }
  }, [selectedMainCatId, allCategories]);

  // Sync selectedMainCatId â†’ useProductSubmit's selectedCategory & defaultCategory
  useEffect(() => {
    if (!selectedMainCatId) return;
    const cat = allCategories.find((c) => c._id === selectedMainCatId);
    if (!cat) return;
    const catEntry = { _id: cat._id, name: showingTranslateValue(cat.name) };
    setDefaultCategory([catEntry]);
    setSelectedCategory([catEntry]);
    // Also set subCategory text in form
    if (selectedSubCatId) {
      const sub = allCategories.find((c) => c._id === selectedSubCatId);
      if (sub) setValue("subCategory", showingTranslateValue(sub.name));
    }
  }, [selectedMainCatId, selectedSubCatId]);

  // When editing a product, pre-populate category dropdown
  useEffect(() => {
    if (id && allCategories.length > 0) {
      import("@/services/ProductServices").then(({ default: PS }) => {
        PS.getProductById(id)
          .then((res) => {
          if (res && res.category) {
              const catId =
                typeof res.category === "object" ? res.category._id : res.category;
            setSelectedMainCatId(catId || "");
          }
          })
          .catch(() => {});
      });
    } else if (!id) {
      setSelectedMainCatId("");
      setSelectedSubCatId("");
    }
  }, [id, allCategories]);

  const handleAddProductFaq = () => {
    setProductFaqs((prev) => [...prev, { question: "", answer: "" }]);
  };

  const handleRemoveProductFaq = (index) => {
    setProductFaqs((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleProductFaqChange = (index, field, val) => {
    setProductFaqs((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };
      return next;
    });
  };

  // Top-level (parent) categories only
  const parentCategories = allCategories.filter((c) => !c.parentId || c.parentId === "");

  return (
    <>
      <Modal
        open={openModal}
        onClose={onCloseModal}
        center
        closeIcon={
          <div className="absolute top-0 right-0 text-red-500  active:outline-none text-xl border-0">
            <FiX className="text-3xl" />
          </div>
        }
      >
        <div className="cursor-pointer">
          <UploaderThree
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
            handleSelectImage={handleSelectImage}
          />
        </div>
      </Modal>

      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {id ? (
          <Title
            register={register}
            handleSelectLanguage={handleSelectLanguage}
            title={t("UpdateProduct")}
            description={t("UpdateProductDescription")}
          />
        ) : (
          <Title
            register={register}
            handleSelectLanguage={handleSelectLanguage}
            title={t("DrawerAddProduct")}
            description={t("AddProductDescription")}
          />
        )}
      </div>

      <Scrollbars className="track-horizontal thumb-horizontal w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <form onSubmit={handleSubmit(onSubmit)} className="block" id="block">
            <div className="px-6 pt-8 flex-grow w-full h-full max-h-full pb-40 md:pb-32 lg:pb-32 xl:pb-32">

            <SectionHeader title="Product Details" />

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label="Brand / Product Name *" />
                <div className="col-span-8 sm:col-span-4">
                  <Input
                  {...register("title", { required: "Product name is required!" })}
                    name="title"
                    type="text"
                    placeholder="e.g. Darzalex / Herceptin"
                    onBlur={(e) => handleProductSlug(e.target.value)}
                  />
                  <Error errorName={errors.title} />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label="Generic / Salt Name" />
                <div className="col-span-8 sm:col-span-4">
                  <InputArea
                    register={register}
                    label="Generic Name"
                    name="composition"
                    type="text"
                    placeholder="e.g. Daratumumab / Trastuzumab"
                  />
                  <Error errorName={errors.composition} />
                </div>
              </div>

            <input type="hidden" {...register("slug")} />

            <SectionHeader title="Category" />

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label="Main Category *" />
                <div className="col-span-8 sm:col-span-4">
                  <CategoryDropdown
                    categories={parentCategories}
                    value={selectedMainCatId}
                    onChange={setSelectedMainCatId}
                    placeholder="-- Select Main Category --"
                  />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label="Sub Category" />
                <div className="col-span-8 sm:col-span-4">
                  {subCategories.length > 0 ? (
                    <select
                      className="border text-sm block w-full bg-gray-100 border-gray-200 rounded-md p-2"
                      value={selectedSubCatId}
                      onChange={(e) => {
                        setSelectedSubCatId(e.target.value);
                        const sub = allCategories.find((c) => c._id === e.target.value);
                        if (sub) setValue("subCategory", showingTranslateValue(sub.name));
                      }}
                    >
                      <option value="">-- No Sub Category --</option>
                      {subCategories.map((sub) => (
                        <option key={sub._id} value={sub._id}>
                          {showingTranslateValue(sub.name)}
                        </option>
                      ))}
                    </select>
                  ) : (
                      <InputArea
                        register={register}
                        label="Sub Category"
                        name="subCategory"
                        type="text"
                        placeholder="e.g. Breast Cancer / Monoclonal Antibody"
                      />
                  )}
                  <Error errorName={errors.subCategory} />
                </div>
              </div>

            <SectionHeader title="Medicine Info" />

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label="Manufacturer" />
                <div className="col-span-8 sm:col-span-4">
                  <InputArea
                    register={register}
                    label="Manufacturer"
                    name="manufacturer"
                    type="text"
                    placeholder="e.g. Roche / Pfizer / Janssen"
                  />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label="Strength" />
                <div className="col-span-8 sm:col-span-4">
                  <InputArea
                    register={register}
                    label="Strength"
                    name="strength"
                    type="text"
                    placeholder="e.g. 1800mg / 150mg/ml"
                  />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label="Dosage Form" />
                <div className="col-span-8 sm:col-span-4">
                  <select
                    {...register("dosageForm")}
                    className="border text-sm block w-full bg-gray-100 border-gray-200 rounded-md p-2"
                  >
                    <option value="">-- Select Dosage Form --</option>
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Injection">Injection</option>
                    <option value="IV Infusion">IV Infusion</option>
                    <option value="Vial">Vial</option>
                    <option value="Lyophilized Powder">Lyophilized Powder</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Route" />
                <div className="col-span-8 sm:col-span-4">
                  <select
                    {...register("route")}
                    className="border text-sm block w-full bg-gray-100 border-gray-200 rounded-md p-2"
                  >
                    <option value="">-- Select Route --</option>
                    <option value="Oral">Oral</option>
                    <option value="IV Infusion">IV Infusion</option>
                    <option value="Subcutaneous">Subcutaneous</option>
                    <option value="Intravenous">Intravenous</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label="Cold Chain" />
                <div className="col-span-8 sm:col-span-4">
                  <label className="inline-flex items-center gap-2 cursor-pointer mt-2">
                    <input
                      type="checkbox"
                      {...register("coldChain")}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500 w-4 h-4"
                    />
                    <span className="text-sm text-gray-700 font-medium">
                    Requires Cold Chain (2-8Â°C)
                    </span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label="Packaging" />
                <div className="col-span-8 sm:col-span-4">
                  <InputArea
                    register={register}
                    label="Packaging"
                    name="packaging"
                    type="text"
                  placeholder="e.g. 1 Vial of 1800mg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Storage" />
                <div className="col-span-8 sm:col-span-4">
                  <InputArea
                    register={register}
                    label="Storage"
                    name="storage"
                    type="text"
                  placeholder="e.g. Store at 2-8Â°C"
                  />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Availability" />
                <div className="col-span-8 sm:col-span-4">
                  <select
                    {...register("availability")}
                    className="border text-sm block w-full bg-gray-100 border-gray-200 rounded-md p-2"
                  >
                  <option value="Sourcing Available">Sourcing Available</option>
                  <option value="Global Distribution">Global Distribution</option>
                  <option value="Limited Stock">Limited Stock</option>
                  <option value="Pre Order">Pre Order</option>
                  <option value="Coming Soon">Coming Soon</option>
                  </select>
                </div>
              </div>

            <SectionHeader title="Description" />

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label="Short Description" />
                <div className="col-span-8 sm:col-span-4">
                  <Textarea
                  className="border text-sm block w-full bg-gray-100 border-gray-200"
                  {...register("description")}
                    name="description"
                  placeholder="Brief overview for product card (2-3 lines)"
                    rows="3"
                  />
                  <Error errorName={errors.description} />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label="Indications / Uses" />
                <div className="col-span-8 sm:col-span-4">
                  <Textarea
                    className="border text-sm block w-full bg-gray-100 border-gray-200"
                    {...register("indications")}
                    name="indications"
                  placeholder="e.g. Multiple Myeloma, Breast Cancer (HER2+)"
                    rows="3"
                  />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label="Dosage Guidelines" />
                <div className="col-span-8 sm:col-span-4">
                  <InputArea
                    register={register}
                    label="Dosage"
                    name="dosage"
                    type="text"
                  placeholder="e.g. As directed by specialist"
                  />
                </div>
              </div>

            <SectionHeader title="Product Images" />

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={t("ProductImage")} />
                <div className="col-span-8 sm:col-span-4">
                  <Uploader
                    product
                    folder="product"
                    imageUrl={imageUrl}
                    setImageUrl={setImageUrl}
                  maxFilesOverride={4}
                  />
                <p className="text-xs text-gray-400 mt-1">Up to 4 images. First image is the main photo.</p>
                </div>
              </div>

            <SectionHeader title="Publish" />

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={t("ProductStatus")} />
                <div className="col-span-8 sm:col-span-4">
                  <select
                  {...register("status", { required: "Status is required!" })}
                    className="border text-sm block w-full bg-gray-100 border-gray-200 rounded-md p-2"
                    name="status"
                    defaultValue={values?.status || "show"}
                  >
                    <option value="show">{t("Published")}</option>
                    <option value="hide">{t("Unpublished")}</option>
                  </select>
                  <Error errorName={errors.status} />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Homepage Label" />
                <div className="col-span-8 sm:col-span-4">
                  <select
                    {...register("type")}
                    className="border text-sm block w-full bg-gray-100 border-gray-200 rounded-md p-2"
                    name="type"
                    defaultValue={values?.type || "normal"}
                  >
                    <option value="normal">Normal</option>
                  <option value="popular">Popular</option>
                  <option value="trending">Trending</option>
                  <option value="new">New Arrival</option>
                  </select>
                <p className="text-xs text-gray-400 mt-1">Optional â€” feature on homepage sections.</p>
                </div>
              </div>

            <SectionHeader title="Product FAQs (optional)" />

            <div className="mb-6">
              <div className="flex justify-end mb-3">
                  <button
                    type="button"
                  onClick={handleAddProductFaq}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-1.5 px-3 rounded-lg"
                  >
                  + Add FAQ
                  </button>
                </div>

              {productFaqs && productFaqs.length > 0 ? (
                <div className="space-y-4 border border-gray-200 rounded-xl p-4 bg-gray-50/50">
                  {productFaqs.map((faq, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-3 bg-white space-y-3 relative">
                        <button
                          type="button"
                        onClick={() => handleRemoveProductFaq(idx)}
                        className="absolute top-2 right-2 text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 px-2 py-1 rounded"
                        >
                          Remove
                        </button>
                        <div className="pr-16">
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Question</label>
                          <input
                            type="text"
                          value={faq.question}
                          onChange={(e) => handleProductFaqChange(idx, "question", e.target.value)}
                          placeholder="e.g. Is a prescription required?"
                          className="w-full border border-gray-200 rounded-lg py-1.5 px-3 text-sm"
                          />
                        </div>
                        <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Answer</label>
                          <textarea
                          value={faq.answer}
                          onChange={(e) => handleProductFaqChange(idx, "answer", e.target.value)}
                          placeholder="Answer shown on product page"
                          rows="3"
                          className="w-full border border-gray-200 rounded-lg py-1.5 px-3 text-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                <p className="text-xs text-gray-400 italic">No FAQs added. Default FAQs will show on the website.</p>
                )}
              </div>

            </div>

            <DrawerButton id={id} title="Product" isSubmitting={isSubmitting} />
        </form>
      </Scrollbars>
    </>
  );
};

export default React.memo(ProductDrawer);

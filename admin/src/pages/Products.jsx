import React, { useContext, useState } from "react";
import {
  Table,
  TableHeader,
  TableCell,
  TableFooter,
  TableContainer,
  Select,
  Input,
  Button,
  Card,
  CardBody,
  Pagination,
} from "@windmill/react-ui";
import { useTranslation } from "react-i18next";
import { FiPlus, FiEdit, FiTrash2, FiZoomIn } from "react-icons/fi";
import { Link } from "react-router-dom";
import EditDeleteButton from "@/components/table/EditDeleteButton";
import ShowHideButton from "@/components/table/ShowHideButton";
import useUtilsFunction from "@/hooks/useUtilsFunction";

//internal import

import useAsync from "@/hooks/useAsync";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import UploadMany from "@/components/common/UploadMany";
import NotFound from "@/components/table/NotFound";
import ProductServices from "@/services/ProductServices";
import PageTitle from "@/components/Typography/PageTitle";
import { SidebarContext } from "@/context/SidebarContext";
import ProductTable from "@/components/product/ProductTable";
import MainDrawer from "@/components/drawer/MainDrawer";
import ProductDrawer from "@/components/drawer/ProductDrawer";
import CheckBox from "@/components/form/others/CheckBox";
import useProductFilter from "@/hooks/useProductFilter";
import DeleteModal from "@/components/modal/DeleteModal";
import BulkActionDrawer from "@/components/drawer/BulkActionDrawer";
import TableLoading from "@/components/preloader/TableLoading";
import SelectCategory from "@/components/form/selectOption/SelectCategory";
import AnimatedContent from "@/components/common/AnimatedContent";

const Products = () => {
  const { title, allId, serviceId, handleDeleteMany, handleUpdateMany, handleModalOpen, handleUpdate } =
    useToggleDrawer();
  const { currency, showingTranslateValue, getNumberTwo } = useUtilsFunction();

  const { t } = useTranslation();
  const {
    toggleDrawer,
    lang,
    currentPage,
    handleChangePage,
    searchText,
    category,
    setCategory,
    searchRef,
    handleSubmitForAll,
    sortedField,
    setSortedField,
    limitData,
  } = useContext(SidebarContext);

  const { data, loading, error } = useAsync(() =>
    ProductServices.getAllProducts({
      page: currentPage,
      limit: limitData,
      category: category,
      title: searchText,
      price: sortedField,
    })
  );


  // react hooks
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);

  const handleSelectAll = () => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(data?.products.map((li) => li._id));
    if (isCheckAll) {
      setIsCheck([]);
    }
  };

  const handleCardCheckboxClick = (e) => {
    const { id, checked } = e.target;
    setIsCheck((prevCheck) => {
      if (checked) {
        return [...prevCheck, id];
      } else {
        return prevCheck.filter((item) => item !== id);
      }
    });
  };
  // handle reset field
  const handleResetField = () => {
    setCategory("");
    setSortedField("");
    searchRef.current.value = "";
  };

  // console.log('productss',products)
  const {
    serviceData,
    filename,
    isDisabled,
    handleSelectFile,
    handleUploadMultiple,
    handleRemoveSelectFile,
  } = useProductFilter(data?.products);

  return (
    <>
      <PageTitle>{t("ProductsPage")}</PageTitle>
      <DeleteModal ids={allId} setIsCheck={setIsCheck} title={title} />
      <BulkActionDrawer ids={allId} title="Products" />
      <MainDrawer>
        <ProductDrawer id={serviceId} />
      </MainDrawer>
      <AnimatedContent>
        <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
          <CardBody className="">
            <form
              onSubmit={handleSubmitForAll}
              className="py-3 md:pb-0 grid gap-4 lg:gap-6 xl:gap-6 xl:flex"
            >
              <div className="flex-grow-0 sm:flex-grow md:flex-grow lg:flex-grow xl:flex-grow">
                <UploadMany
                  title="Products"
                  filename={filename}
                  isDisabled={isDisabled}
                  totalDoc={data?.totalDoc}
                  handleSelectFile={handleSelectFile}
                  handleUploadMultiple={handleUploadMultiple}
                  handleRemoveSelectFile={handleRemoveSelectFile}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                  <Button
                    disabled={isCheck.length < 1}
                    onClick={() => handleUpdateMany(isCheck)}
                    className="w-full rounded-md h-12 btn-gray text-gray-600"
                  >
                    <span className="mr-2">
                      <FiEdit />
                    </span>
                    {t("BulkAction")}
                  </Button>
                </div>
                <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                  <Button
                    disabled={isCheck?.length < 1}
                    onClick={() => handleDeleteMany(isCheck, data.products)}
                    className="w-full rounded-md h-12 bg-red-300 disabled btn-red"
                  >
                    <span className="mr-2">
                      <FiTrash2 />
                    </span>

                    {t("Delete")}
                  </Button>
                </div>
                <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                  <Button
                    onClick={toggleDrawer}
                    className="w-full rounded-md h-12"
                  >
                    <span className="mr-2">
                      <FiPlus />
                    </span>
                    {t("AddProduct")}
                  </Button>
                </div>
              </div>
            </form>
          </CardBody>
        </Card>

        <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 rounded-t-lg rounded-0 mb-4">
          <CardBody>
            <form
              onSubmit={handleSubmitForAll}
              className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex"
            >
              <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                <Input
                  ref={searchRef}
                  type="search"
                  name="search"
                  placeholder="Search Product"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 mt-5 mr-1"
                ></button>
              </div>

              <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                <SelectCategory setCategory={setCategory} lang={lang} />
              </div>

              <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                <Select onChange={(e) => setSortedField(e.target.value)}>
                  <option value="All" defaultValue hidden>
                    {/* {t("Price")} */}
                  </option>
                  {/* <option value="low">{t("LowtoHigh")}</option> */}
                  {/* <option value="high">{t("HightoLow")}</option> */}
                  <option value="published">{t("Published")}</option>
                  <option value="unPublished">{t("Unpublished")}</option>
                  {/* <option value="status-selling">{t("StatusSelling")}</option> */}
                  {/* <option value="status-out-of-stock">
                    {t("StatusStock")}
                  </option> */}
                  <option value="date-added-asc">{t("DateAddedAsc")}</option>
                  <option value="date-added-desc">{t("DateAddedDesc")}</option>
                  <option value="date-updated-asc">
                    {t("DateUpdatedAsc")}
                  </option>
                  <option value="date-updated-desc">
                    {t("DateUpdatedDesc")}
                  </option>
                </Select>
              </div>
              <div className="flex items-center gap-2 flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                <div className="w-full mx-1">
                  <Button type="submit" className="h-12 w-full bg-green-700">
                    Filter
                  </Button>
                </div>

                <div className="w-full mx-1">
                  <Button
                    layout="outline"
                    onClick={handleResetField}
                    type="reset"
                    className="px-4 md:py-1 py-2 h-12 text-sm dark:bg-gray-700"
                  >
                    <span className="text-black dark:text-gray-200">Reset</span>
                  </Button>
                </div>
              </div>
            </form>
          </CardBody>
        </Card>
      </AnimatedContent>

      {loading ? (
        <TableLoading row={12} col={8} width={160} height={20} />
      ) : error ? (
        <span className="text-center mx-auto text-red-500">{error}</span>
      ) : serviceData?.length !== 0 ? (
        <>
          {/* Mobile Product Card Layout */}
          <div className="block lg:hidden space-y-4 mb-8">
            {data?.products?.map((product) => {
              const productTitle = showingTranslateValue(product?.title);
              const categoryName = showingTranslateValue(product?.category?.name);
              const productHighlights = product.highlights ? showingTranslateValue(product?.highlights) : "";
              
              return (
                <div
                  key={product._id}
                  className="bg-white dark:bg-gray-850 rounded-2xl border border-gray-150 dark:border-gray-750 p-4 shadow-xs relative space-y-3"
                >
                  {/* Checkbox, Thumbnail, Title & SKU */}
                  <div className="flex items-start gap-3">
                    <div className="pt-1.5">
                      <CheckBox
                        type="checkbox"
                        name={product?.title?.en}
                        id={product._id}
                        handleClick={handleCardCheckboxClick}
                        isChecked={isCheck?.includes(product._id)}
                      />
                    </div>
                    
                    {product?.image?.[0] ? (
                      <img
                        src={product?.image?.[0]}
                        alt="product"
                        className="w-12 h-12 object-cover rounded-xl border border-gray-150 dark:border-gray-700 bg-gray-50 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex-shrink-0 flex items-center justify-center text-xs text-gray-400">
                        No Img
                      </div>
                    )}
                    
                    <div className="min-w-0 flex-1">
                      <h4 className="font-extrabold text-sm text-gray-800 dark:text-gray-100 truncate">
                        {productTitle}
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-0.5 font-mono">
                        SKU: {product?.sku || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Category & Pricing */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-500 border-t border-b border-gray-100 dark:border-gray-750 py-2">
                    <div>
                      <span className="text-[9px] text-gray-400 uppercase font-black tracking-widest block mb-0.5">Category</span>
                      <span className="font-bold text-gray-700 dark:text-gray-300">{categoryName || "Uncategorized"}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-400 uppercase font-black tracking-widest block mb-0.5">Price / MOQ</span>
                      <span className="font-bold text-gray-800 dark:text-gray-100">
                        {currency}{getNumberTwo(product?.price || 0)} / {product?.minOrderQuantity || 1}
                      </span>
                    </div>
                  </div>

                  {/* Highlights */}
                  {productHighlights && (
                    <div className="text-[11px] text-gray-550 dark:text-gray-350 bg-gray-50 dark:bg-gray-750 p-2 rounded-xl">
                      <span className="font-bold text-[9px] text-gray-400 uppercase tracking-widest block mb-0.5">Highlights</span>
                      <p className="line-clamp-2">{productHighlights}</p>
                    </div>
                  )}

                  {/* Show/Hide, Edit, Delete and Detail actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-750">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-gray-400 uppercase font-black tracking-widest">Status:</span>
                      <ShowHideButton id={product._id} status={product.status} />
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Link
                        to={`/product/${product._id}`}
                        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/10"
                        title="View Details"
                      >
                        <FiZoomIn className="w-4 h-4" />
                      </Link>
                      
                      <EditDeleteButton
                        id={product._id}
                        product={product}
                        isCheck={isCheck}
                        handleUpdate={handleUpdate}
                        handleModalOpen={handleModalOpen}
                        title={productTitle}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Mobile Pagination */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-150 dark:border-gray-750 p-4 flex justify-center shadow-xs">
              <Pagination
                totalResults={data?.totalDoc}
                resultsPerPage={limitData}
                onChange={handleChangePage}
                label="Product Page Navigation"
              />
            </div>
          </div>

          {/* Desktop Table View */}
          <TableContainer className="hidden lg:block mb-8 rounded-b-lg">
            <Table>
              <TableHeader>
                <tr>
                  <TableCell>
                    <CheckBox
                      type="checkbox"
                      name="selectAll"
                      id="selectAll"
                      isChecked={isCheckAll}
                      handleClick={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>{t("ProductNameTbl")}</TableCell>
                  <TableCell>{t("CategoryTbl")}</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Min Order Qty</TableCell>
                  <TableCell>Highlights</TableCell>
                  <TableCell className="text-center">{t("DetailsTbl")}</TableCell>
                  <TableCell className="text-center">
                    {t("PublishedTbl")}
                  </TableCell>
                  <TableCell className="text-right">{t("ActionsTbl")}</TableCell>
                </tr>
              </TableHeader>
              <ProductTable
                lang={lang}
                isCheck={isCheck}
                products={data?.products}
                setIsCheck={setIsCheck}
              />
            </Table>
            <TableFooter>
              <Pagination
                totalResults={data?.totalDoc}
                resultsPerPage={limitData}
                onChange={handleChangePage}
                label="Product Page Navigation"
              />
            </TableFooter>
          </TableContainer>
        </>
      ) : (
        <NotFound title="Product" />
      )}
    </>
  );
};

export default Products;

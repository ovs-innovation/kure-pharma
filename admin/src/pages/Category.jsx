import {
  Button,
  Card,
  CardBody,
  Input,
  Pagination,
  Table,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
} from "@windmill/react-ui";
import { useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiEdit, FiPlus, FiTrash2 } from "react-icons/fi";

import useAsync from "@/hooks/useAsync";
import { SidebarContext } from "@/context/SidebarContext";
import CategoryServices from "@/services/CategoryServices";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import useFilter from "@/hooks/useFilter";
import DeleteModal from "@/components/modal/DeleteModal";
import BulkActionDrawer from "@/components/drawer/BulkActionDrawer";
import PageTitle from "@/components/Typography/PageTitle";
import MainDrawer from "@/components/drawer/MainDrawer";
import CategoryDrawer from "@/components/drawer/CategoryDrawer";
import UploadMany from "@/components/common/UploadMany";
import TableLoading from "@/components/preloader/TableLoading";
import CheckBox from "@/components/form/others/CheckBox";
import CategoryTable from "@/components/category/CategoryTable";
import NotFound from "@/components/table/NotFound";
import AnimatedContent from "@/components/common/AnimatedContent";

const Category = () => {
  const { toggleDrawer, lang } = useContext(SidebarContext);

  const { data, loading, error } = useAsync(CategoryServices.getAllCategory);
  const { data: getAllCategories } = useAsync(
    CategoryServices.getAllCategories
  );

  const {
    handleDeleteMany,
    allId,
    handleUpdateMany,
    serviceId,
    setServiceId,
    handleUpdate,
  } = useToggleDrawer();

  const { t } = useTranslation();

  const parentCategories = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.filter((cat) => !cat.parentId);
  }, [data]);

  const openParentDrawer = () => {
    setServiceId("");
    toggleDrawer();
  };

  const {
    handleSubmitCategory,
    categoryRef,
    totalResults,
    resultsPerPage,
    dataTable,
    serviceData,
    handleChangePage,
    filename,
    isDisabled,
    setCategoryType,
    handleSelectFile,
    handleUploadMultiple,
    handleRemoveSelectFile,
  } = useFilter(parentCategories);

  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);

  const handleSelectAll = () => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(parentCategories.map((li) => li._id));
    if (isCheckAll) {
      setIsCheck([]);
    }
  };

  const handleResetField = () => {
    setCategoryType("");
    categoryRef.current.value = "";
  };

  return (
    <>
      <PageTitle>Parent Categories</PageTitle>
      <DeleteModal ids={allId} setIsCheck={setIsCheck} />

      <BulkActionDrawer
        ids={allId}
        title="Parent Categories"
        lang={lang}
        data={data}
        isCheck={isCheck}
      />

      <MainDrawer>
        <CategoryDrawer
          id={serviceId}
          data={data}
          lang={lang}
          mode="parent"
        />
      </MainDrawer>

      <AnimatedContent>
        <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
          <CardBody className="">
            <form
              onSubmit={handleSubmitCategory}
              className="py-3  grid gap-4 lg:gap-6 xl:gap-6  xl:flex"
            >
              <div className="flex justify-start w-1/2 xl:w-1/2 md:w-full">
                <UploadMany
                  title="Categories"
                  exportData={getAllCategories}
                  filename={filename}
                  isDisabled={isDisabled}
                  handleSelectFile={handleSelectFile}
                  handleUploadMultiple={handleUploadMultiple}
                  handleRemoveSelectFile={handleRemoveSelectFile}
                />
              </div>

              <div className="lg:flex  md:flex xl:justify-end xl:w-1/2  md:w-full md:justify-start flex-grow-0">
                <div className="w-full md:w-40 lg:w-40 xl:w-40 mr-3 mb-3 lg:mb-0">
                  <Button
                    disabled={isCheck.length < 1}
                    onClick={() => handleUpdateMany(isCheck)}
                    className="w-full rounded-md h-12 text-gray-600 btn-gray"
                  >
                    <span className="mr-2">
                      <FiEdit />
                    </span>
                    {t("BulkAction")}
                  </Button>
                </div>
                <div className="w-full md:w-32 lg:w-32 xl:w-32  mr-3 mb-3 lg:mb-0">
                  <Button
                    disabled={isCheck.length < 1}
                    onClick={() => handleDeleteMany(isCheck)}
                    className="w-full rounded-md h-12 bg-red-500 disabled  btn-red"
                  >
                    <span className="mr-2">
                      <FiTrash2 />
                    </span>
                    {t("Delete")}
                  </Button>
                </div>
                <div className="w-full md:w-56 lg:w-56 xl:w-56">
                  <Button
                    onClick={openParentDrawer}
                    className="rounded-md h-12 w-full"
                  >
                    <span className="mr-2">
                      <FiPlus />
                    </span>
                    Add Parent Category
                  </Button>
                </div>
              </div>
            </form>
          </CardBody>
        </Card>

        <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 rounded-t-lg rounded-0 mb-4">
          <CardBody>
            <form
              onSubmit={handleSubmitCategory}
              className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex"
            >
              <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                <Input
                  ref={categoryRef}
                  type="search"
                  placeholder="Search by parent category name"
                />
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
        <TableLoading row={12} col={6} width={190} height={20} />
      ) : error ? (
        <span className="text-center mx-auto text-red-500">{error}</span>
      ) : serviceData?.length !== 0 ? (
        <div style={{ overflowX: "auto", width: "100%" }}>
          <TableContainer className="mb-8">
            <Table>
              <TableHeader>
                <tr>
                  <TableCell>
                    <CheckBox
                      type="checkbox"
                      name="selectAll"
                      id="selectAll"
                      handleClick={handleSelectAll}
                      isChecked={isCheckAll}
                    />
                  </TableCell>

                  <TableCell>{t("catIdTbl")}</TableCell>
                  <TableCell>{t("catIconTbl")}</TableCell>
                  <TableCell>{t("CatTbName")}</TableCell>
                  <TableCell>{t("CatTbDescription")}</TableCell>
                  <TableCell className="text-center">
                    {t("catPublishedTbl")}
                  </TableCell>
                  <TableCell className="text-right">
                    {t("catActionsTbl")}
                  </TableCell>
                </tr>
              </TableHeader>

              <CategoryTable
                data={data}
                lang={lang}
                isCheck={isCheck}
                categories={dataTable}
                setIsCheck={setIsCheck}
                variant="parent"
                handleUpdate={handleUpdate}
              />
            </Table>

            <TableFooter>
              <Pagination
                totalResults={totalResults}
                resultsPerPage={resultsPerPage}
                onChange={handleChangePage}
                label="Table navigation"
              />
            </TableFooter>
          </TableContainer>
        </div>
      ) : (
        <NotFound title="No parent categories found." />
      )}
    </>
  );
};

export default Category;

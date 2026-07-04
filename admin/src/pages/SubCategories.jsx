import {
  Button,
  Card,
  CardBody,
  Input,
  Pagination,
  Select,
  Table,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
} from "@windmill/react-ui";
import { useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiEdit, FiPlus, FiTrash2 } from "react-icons/fi";
import { useHistory } from "react-router-dom";

import useAsync from "@/hooks/useAsync";
import useQuery from "@/hooks/useQuery";
import { SidebarContext } from "@/context/SidebarContext";
import CategoryServices from "@/services/CategoryServices";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import useFilter from "@/hooks/useFilter";
import DeleteModal from "@/components/modal/DeleteModal";
import BulkActionDrawer from "@/components/drawer/BulkActionDrawer";
import PageTitle from "@/components/Typography/PageTitle";
import MainDrawer from "@/components/drawer/MainDrawer";
import CategoryDrawer from "@/components/drawer/CategoryDrawer";
import TableLoading from "@/components/preloader/TableLoading";
import CheckBox from "@/components/form/others/CheckBox";
import CategoryTable from "@/components/category/CategoryTable";
import NotFound from "@/components/table/NotFound";
import AnimatedContent from "@/components/common/AnimatedContent";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import { notifyError } from "@/utils/toast";

const SubCategories = () => {
  const { toggleDrawer, lang } = useContext(SidebarContext);
  const { showingTranslateValue } = useUtilsFunction();
  const query = useQuery();
  const history = useHistory();

  const { data: parentTree, loading: parentsLoading, error: parentsError } =
    useAsync(CategoryServices.getAllCategory);
  const { data: flatCategories, loading: flatLoading, error: flatError } =
    useAsync(CategoryServices.getAllCategories);

  const {
    handleDeleteMany,
    allId,
    handleUpdateMany,
    serviceId,
    setServiceId,
    handleUpdate,
  } = useToggleDrawer();

  const { t } = useTranslation();
  const [parentFilter, setParentFilter] = useState(query.get("parent") || "");

  useEffect(() => {
    setParentFilter(query.get("parent") || "");
  }, [query]);

  const parentOptions = useMemo(() => {
    if (!Array.isArray(parentTree)) return [];
    return parentTree.filter((cat) => !cat.parentId);
  }, [parentTree]);

  const parentNameMap = useMemo(() => {
    const map = {};
    parentOptions.forEach((parent) => {
      map[parent._id] = showingTranslateValue(parent.name);
    });
    return map;
  }, [parentOptions, showingTranslateValue]);

  const subCategories = useMemo(() => {
    if (!Array.isArray(flatCategories)) return [];
    return flatCategories.filter((cat) => cat.parentId);
  }, [flatCategories]);

  const filteredSubCategories = useMemo(() => {
    if (!parentFilter) return subCategories;
    return subCategories.filter((cat) => cat.parentId === parentFilter);
  }, [subCategories, parentFilter]);

  const {
    handleSubmitCategory,
    categoryRef,
    totalResults,
    resultsPerPage,
    dataTable,
    serviceData,
    handleChangePage,
    setCategoryType,
  } = useFilter(filteredSubCategories);

  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);

  const loading = parentsLoading || flatLoading;
  const error = parentsError || flatError;

  const openSubDrawer = () => {
    if (!parentFilter) {
      notifyError("Please select a parent category first.");
      return;
    }
    setServiceId("");
    toggleDrawer();
  };

  const handleParentFilterChange = (e) => {
    const value = e.target.value;
    setParentFilter(value);
    if (value) {
      history.push(`/sub-categories?parent=${value}`);
    } else {
      history.push("/sub-categories");
    }
  };

  const handleSelectAll = () => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(filteredSubCategories.map((li) => li._id));
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
      <PageTitle>Sub Categories</PageTitle>
      <DeleteModal ids={allId} setIsCheck={setIsCheck} />

      <BulkActionDrawer
        ids={allId}
        title="Sub Categories"
        lang={lang}
        data={parentTree}
        isCheck={isCheck}
      />

      <MainDrawer>
        <CategoryDrawer
          id={serviceId}
          data={parentTree}
          lang={lang}
          mode="child"
          defaultParentId={parentFilter}
        />
      </MainDrawer>

      <AnimatedContent>
        <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
          <CardBody>
            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3 mb-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t("ParentCategory")}
                </label>
                <Select
                  className="capitalize h-12"
                  value={parentFilter}
                  onChange={handleParentFilterChange}
                >
                  <option value="">All parent categories</option>
                  {parentOptions.map((parent) => (
                    <option key={parent._id} value={parent._id}>
                      {showingTranslateValue(parent.name)}
                    </option>
                  ))}
                </Select>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Sub-categories are always linked to a parent. Select one before adding.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmitCategory}
              className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex md:justify-between"
            >
              <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                <Input
                  ref={categoryRef}
                  type="search"
                  placeholder="Search by sub-category name"
                />
              </div>

              <div className="flex items-center gap-2 flex-grow-0 justify-end">
                <div className="w-full md:w-32">
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
                <div className="w-full md:w-32">
                  <Button
                    disabled={isCheck.length < 1}
                    onClick={() => handleDeleteMany(isCheck)}
                    className="w-full rounded-md h-12 bg-red-500 btn-red"
                  >
                    <span className="mr-2">
                      <FiTrash2 />
                    </span>
                    {t("Delete")}
                  </Button>
                </div>
                <div className="w-full md:w-52">
                  <Button onClick={openSubDrawer} className="rounded-md h-12 w-full">
                    <span className="mr-2">
                      <FiPlus />
                    </span>
                    Add Sub Category
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
                  placeholder="Search by sub-category name"
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
        <TableLoading row={12} col={7} width={190} height={20} />
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
                  <TableCell>{t("ParentCategory")}</TableCell>
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
                data={parentTree}
                lang={lang}
                isCheck={isCheck}
                categories={dataTable}
                setIsCheck={setIsCheck}
                variant="sub"
                parentNameMap={parentNameMap}
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
        <NotFound title="No sub-categories found. Select a parent or add a new sub-category." />
      )}
    </>
  );
};

export default SubCategories;

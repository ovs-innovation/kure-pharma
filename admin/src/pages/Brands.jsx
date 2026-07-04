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
import { t } from "i18next";
import React, { useContext, useState } from "react";
import { FiEdit, FiPlus, FiTrash2 } from "react-icons/fi";

import BulkActionDrawer from "@/components/drawer/BulkActionDrawer";
import BrandDrawer from "@/components/drawer/BrandDrawer";
import MainDrawer from "@/components/drawer/MainDrawer";
import DeleteModal from "@/components/modal/DeleteModal";
import PageTitle from "@/components/Typography/PageTitle";
import { SidebarContext } from "@/context/SidebarContext";
import useAsync from "@/hooks/useAsync";
import useFilter from "@/hooks/useFilter";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import BrandServices from "@/services/BrandServices";
import TableLoading from "@/components/preloader/TableLoading";
import CheckBox from "@/components/form/others/CheckBox";
import NotFound from "@/components/table/NotFound";
import AnimatedContent from "@/components/common/AnimatedContent";

const Brands = () => {
  const { toggleDrawer } = useContext(SidebarContext);
  const { allId, handleUpdateMany, handleDeleteMany, serviceId, handleUpdate } =
    useToggleDrawer();
  const { data, loading, error } = useAsync(BrandServices.getAllBrands);
  const {
    totalResults,
    resultsPerPage,
    dataTable,
    handleChangePage,
    handleSubmitCurrency,
    currencyRef,
  } = useFilter(data);

  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);

  const handleSelectAll = () => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(data.map((li) => li._id));
    if (isCheckAll) {
      setIsCheck([]);
    }
  };

  return (
    <>
      <PageTitle>Brands</PageTitle>
      <BulkActionDrawer ids={allId} title="Brands" />
      <MainDrawer>
        <BrandDrawer id={serviceId} />
      </MainDrawer>
      <DeleteModal
        ids={allId}
        setIsCheck={setIsCheck}
        title="Selected Brands"
      />

      <AnimatedContent>
        <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
          <CardBody>
            <form
              onSubmit={handleSubmitCurrency}
              className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex md:justify-between"
            >
              <div className="w-full">
                <Input
                  ref={currencyRef}
                  type="search"
                  placeholder={t("SearchBrand") || "Search brands"}
                />
              </div>
              <div className="lg:flex md:flex xl:justify-end xl:w-1/2 md:w-full md:justify-start flex-grow-0">
                <div className="w-full md:w-40 lg:w-40 xl:w-40 mr-3 mb-3 lg:mb-0">
                  <Button
                    disabled={isCheck.length < 1}
                    onClick={() => handleUpdateMany(isCheck)}
                    className="w-full rounded-md h-12 btn-gray text-gray-600"
                  >
                    <span className="mr-2">
                      <FiEdit />
                    </span>
                    Bulk Action
                  </Button>
                </div>
                <div className="w-full md:w-32 lg:w-32 xl:w-32 mr-3 mb-3 lg:mb-0">
                  <Button
                    disabled={isCheck.length < 1}
                    onClick={() => handleDeleteMany(isCheck)}
                    className="w-full rounded-md h-12 bg-red-500 btn-red"
                  >
                    <span className="mr-2">
                      <FiTrash2 />
                    </span>
                    Delete
                  </Button>
                </div>
                <Button onClick={toggleDrawer} className="rounded-md h-12 w-48">
                  <span className="mr-2">
                    <FiPlus />
                  </span>
                  Add Brand
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </AnimatedContent>

      {loading ? (
        <TableLoading row={10} col={6} width={160} height={20} />
      ) : error ? (
        <span className="text-center mx-auto text-red-500">{error}</span>
      ) : (
        data.length !== 0 && (
          <div style={{ overflowX: "auto", width: "100%" }}>
            <TableContainer className="mb-8 rounded-b-lg">
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
                    <TableCell className="text-center">Name</TableCell>
                    <TableCell className="text-center">Slug</TableCell>
                    <TableCell className="text-center">Status</TableCell>
                    <TableCell className="text-right">Actions</TableCell>
                  </tr>
                </TableHeader>
                <tbody>
                  {dataTable.map((brand) => (
                    <tr key={brand._id}>
                      <TableCell>
                        <CheckBox
                          type="checkbox"
                          name={brand._id}
                          id={brand._id}
                          isChecked={isCheck.includes(brand._id)}
                          handleClick={() =>
                            setIsCheck((prev) =>
                              prev.includes(brand._id)
                                ? prev.filter((id) => id !== brand._id)
                                : [...prev, brand._id],
                            )
                          }
                        />
                      </TableCell>
                      <TableCell className="text-center">{brand.name}</TableCell>
                      <TableCell className="text-center">{brand.slug}</TableCell>
                      <TableCell className="text-center">
                        {brand.status}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="small"
                          layout="link"
                          onClick={() => handleUpdate(brand._id)}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </tr>
                  ))}
                </tbody>
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
        )
      )}
      {!loading && data.length === 0 && !error && (
        <NotFound title="Sorry, There are no brands right now." />
      )}
    </>
  );
};

export default Brands;

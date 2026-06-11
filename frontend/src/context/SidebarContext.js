import React, { useState, useMemo, createContext, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import CategoryServices from "@services/CategoryServices";
import ServiceServices from "@services/ServiceServices";
import Cookies from "js-cookie";

// create context
export const SidebarContext = createContext();

const CATEGORY_STALE_TIME = 5 * 60 * 1000;

export const SidebarProvider = ({ children }) => {
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [services, setServices] = useState([]);

  const lang = Cookies.get("_lang") || "en";

  const showingTranslateValue = useCallback((data) => {
    if (!data || typeof data !== "object") return "";
    return data[lang] || data?.en || Object.values(data).find(v => v) || "";
  }, [lang]);

  const { data: categoryData, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["category"],
    queryFn: () => CategoryServices.getShowingCategory(),
    staleTime: CATEGORY_STALE_TIME,
    gcTime: 30 * 60 * 1000,
  });

  const categories = useMemo(() => {
    const catList = categoryData || [];
    if (!catList.length) return [];

    const findMainCategories = (list) => {
      if (list.length === 1) {
        const name = showingTranslateValue(list[0].name)?.toLowerCase()?.trim();
        if (name === 'home' || name === 'all categories' || name === 'all departments' || !list[0].parentId) {
          if (list[0].children && list[0].children.length > 0) {
            return findMainCategories(list[0].children);
          }
        }
      }
      return list;
    };

    const finalCategories = findMainCategories(catList);

    return finalCategories.filter(cat => {
      const name = showingTranslateValue(cat.name)?.toLowerCase()?.trim();
      return name !== 'home' && name !== 'all categories' && name !== 'all departments' && name !== '';
    });
  }, [categoryData, showingTranslateValue]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await ServiceServices.getShowingServices();
        setServices(res || []);
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };

    fetchServices();
  }, [lang]);

  const toggleCategoryDrawer = () => setCategoryDrawerOpen(!categoryDrawerOpen);
  const closeCategoryDrawer = () => setCategoryDrawerOpen(false);

  const toggleCartDrawer = () => setCartDrawerOpen(!cartDrawerOpen);
  const closeCartDrawer = () => setCartDrawerOpen(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const closeModal = () => setIsModalOpen(false);

  const handleChangePage = (p) => {
    setCurrentPage(p);
  };

  const value = useMemo(
    () => ({
      categoryDrawerOpen,
      toggleCategoryDrawer,
      closeCategoryDrawer,
      cartDrawerOpen,
      toggleCartDrawer,
      closeCartDrawer,
      isModalOpen,
      toggleModal,
      closeModal,
      currentPage,
      setCurrentPage,
      handleChangePage,
      isLoading,
      setIsLoading,
      categories,
      services,
      isCategoriesLoading,
      categoryTree: categoryData || [],
    }),

    [categoryDrawerOpen, cartDrawerOpen, isModalOpen, currentPage, isLoading, categories, services, isCategoriesLoading, categoryData]
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};

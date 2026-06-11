import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useState, useEffect } from "react";
import {
  IoChevronDownOutline,
  IoChevronForwardOutline,
  IoRemoveSharp,
} from "react-icons/io5";

//internal import
import { SidebarContext } from "@context/SidebarContext";
import useUtilsFunction from "@hooks/useUtilsFunction";
import { getCategorySearchUrl } from "@utils/categoryUrl";

const CategoryCard = ({ title, icon, nested, id, slug }) => {
  const router = useRouter();
  const { closeCategoryDrawer } = useContext(SidebarContext);
  const { showingTranslateValue } = useUtilsFunction();

  // react hook
  const [show, setShow] = useState(false);
  const [showSubCategory, setShowSubCategory] = useState({
    id: "",
    show: false,
  });
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const navigateToCategory = (catId, categoryName, slug) => {
    const url = getCategorySearchUrl(catId, categoryName, slug);
    router.prefetch(url);
    router.push(url);
    closeCategoryDrawer();
  };

  // handle show category - toggle subcategories, only navigate if no children
  const showCategory = (id, categoryName, slug) => {
    if (nested?.length > 0) {
      setShow(!show);
    } else {
      navigateToCategory(id, categoryName, slug);
    }
  };

  // handle sub nested category - show sub-subcategories without navigation
  const handleSubNestedCategory = (id, categoryName) => {
    setShowSubCategory({ id: id, show: showSubCategory.show ? false : true });
  };

  // handle sub category - navigate to subcategory page
  const handleSubCategory = (id, categoryName, slug) => {
    navigateToCategory(id, categoryName, slug);
  };

  const handleSubSubCategory = (id, categoryName, slug) => {
    navigateToCategory(id, categoryName, slug);
    if (isMobile) {
      closeCategoryDrawer();
    }
  };

  return (
    <>
      <div className="relative group">
        <a
          onClick={() => showCategory(id, title, slug)}
          onMouseEnter={() => {
            if (nested?.length > 0) return;
            router.prefetch(getCategorySearchUrl(id, title, slug));
          }}
          className="p-3 flex items-center rounded-md hover:bg-gray-50 w-full hover:text-[#A821A8] transition-colors duration-200 cursor-pointer"
          role="button"
        >
          {icon ? (
            <Image
              src={icon}
              width={20}
              height={20}
              alt="Category"
              className="flex-shrink-0"
            />
          ) : (
            <Image
              src="https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
              width={20}
              height={20}
              alt="category"
              className="flex-shrink-0"
            />
          )}

          <div className="inline-flex items-center justify-between ml-3 text-sm font-medium w-full hover:text-[#A821A8]">
            <span className="truncate">{title}</span>
            {nested?.length > 0 && (
              <span className="transition duration-300 ease-in-out inline-flex loading-none items-end text-gray-400 ml-2 flex-shrink-0">
                {show ? <IoChevronDownOutline /> : <IoChevronForwardOutline />}
              </span>
            )}
          </div>
        </a>

        {/* Click-based expanded view with improved styling */}
        {show && nested.length > 0 && (
          <div className="border-l-2 border-gray-100 ml-4 mt-1">
            <ul className="space-y-1">
              {nested.map((children) => (
                <li key={children._id} className="relative">
                  {children.children.length > 0 ? (
                    <a
                      onClick={() =>
                        handleSubNestedCategory(
                          children._id,
                          showingTranslateValue(children.name)
                        )
                      }
                      className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-[#A821A8] hover:bg-gray-50 cursor-pointer transition-colors duration-200 rounded-md"
                    >
                      <span className="text-xs text-gray-400 mr-2">
                        <IoRemoveSharp />
                      </span>

                      <div className="inline-flex items-center justify-between w-full">
                        <span className="truncate">
                          {`for ${showingTranslateValue(children.name)}`}
                        </span>
                        <span className="transition duration-300 ease-in-out inline-flex loading-none items-end text-gray-400 ml-2 flex-shrink-0">
                          {showSubCategory.id === children._id &&
                          showSubCategory.show ? (
                            <IoChevronDownOutline />
                          ) : (
                            <IoChevronForwardOutline />
                          )}
                        </span>
                      </div>
                    </a>
                  ) : (
                    <a
                      onClick={() =>
                        handleSubCategory(
                          children._id,
                          showingTranslateValue(children.name),
                          children.slug
                        )
                      }
                      className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-[#A821A8] hover:bg-gray-50 cursor-pointer transition-colors duration-200 rounded-md"
                    >
                      <span className="text-xs text-gray-400 mr-2">
                        <IoRemoveSharp />
                      </span>
                      <span className="truncate">
                        {`for ${showingTranslateValue(children.name)}`}
                      </span>
                    </a>
                  )}

                  {/* sub children category with improved styling */}
                  {showSubCategory.id === children._id &&
                  showSubCategory.show === true &&
                  children.children.length > 0 ? (
                    <div className="border-l-2 border-gray-100 ml-4 mt-1">
                      <ul className="space-y-1">
                        {children.children.map((subChildren) => (
                          <li key={subChildren._id}>
                            <a
                              onClick={() =>
                                handleSubSubCategory(
                                  subChildren._id,
                                  showingTranslateValue(subChildren?.name),
                                  subChildren.slug
                                )
                              }
                              className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-[#A821A8] hover:bg-gray-50 cursor-pointer transition-colors duration-200 rounded-md"
                            >
                              <span className="text-xs text-gray-400 mr-2">
                                <IoRemoveSharp />
                              </span>
                              <span className="truncate">
                                {`for ${showingTranslateValue(subChildren?.name)}`}
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default CategoryCard;

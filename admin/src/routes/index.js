import { lazy } from "react";

const Page404 = lazy(() => import("@/pages/404"));
const EditProfile = lazy(() => import("@/pages/EditProfile"));
const Category = lazy(() => import("@/pages/Category"));
const SubCategories = lazy(() => import("@/pages/SubCategories"));
const ChildCategory = lazy(() => import("@/pages/ChildCategory"));
const Products = lazy(() => import("@/pages/Products"));
const Brands = lazy(() => import("@/pages/Brands"));
const FaqSettings = lazy(() => import("@/pages/FaqSettings"));
const Leads = lazy(() => import("@/pages/Leads"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Homepage = lazy(() => import("@/pages/Homepage"));

const routes = [
  { path: "/dashboard", component: Dashboard },
  { path: "/products", component: Products },
  { path: "/categories", component: Category },
  { path: "/sub-categories", component: SubCategories },
  { path: "/categories/:id", component: ChildCategory },
  { path: "/brands", component: Brands },
  { path: "/faq", component: FaqSettings },
  { path: "/edit-profile", component: EditProfile },
  { path: "/leads", component: Leads },
  { path: "/settings", component: Homepage },
  { path: "/404", component: Page404 },
];

const routeAccessList = [
  { label: "Dashboard", value: "dashboard" },
  { label: "Products", value: "products" },
  { label: "Categories", value: "categories" },
  { label: "Sub Categories", value: "sub-categories" },
  { label: "Brands", value: "brands" },
  { label: "FAQ", value: "faq" },
  { label: "Enquiries", value: "leads" },
  { label: "Edit Profile", value: "edit-profile" },
];

export { routeAccessList, routes };

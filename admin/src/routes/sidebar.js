import { FiSlack, FiHelpCircle, FiMail, FiGrid, FiSettings } from "react-icons/fi";

const sidebar = [
  {
    path: "/dashboard",
    icon: FiGrid,
    name: "Dashboard",
  },
  {
    icon: FiSlack,
    name: "Catalog",
    routes: [
      {
        path: "/products",
        name: "Products",
      },
      {
        path: "/categories",
        name: "Parent Categories",
      },
      {
        path: "/sub-categories",
        name: "Sub Categories",
      },
      {
        path: "/brands",
        name: "Brands",
      },
    ],
  },
  {
    path: "/leads",
    icon: FiMail,
    name: "Enquiries",
  },
  {
    path: "/faq",
    icon: FiHelpCircle,
    name: "FAQ",
  },
  {
    path: "/settings",
    icon: FiSettings,
    name: "Homepage & Footer",
  },
];

export default sidebar;

import requests from "./httpServices";

const CategoryServices = {
  getShowingCategory: async () => {
    return requests.get("/category/show");
  },

  getCategoryBySlug: async (slug) => {
    return requests.get(`/category/slug/${encodeURIComponent(slug)}`);
  },
};

export default CategoryServices;

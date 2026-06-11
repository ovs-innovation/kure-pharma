require("dotenv").config();
const { connectDB } = require("../config/db");
const Category = require("../models/Category");
const Product = require("../models/Product");

const audit = async () => {
  await connectDB();

  // 1. Check categories in DB
  const categoriesInDB = await Category.find({}).lean();
  console.log("=== DB CATEGORIES COUNT ===", categoriesInDB.length);
  categoriesInDB.forEach(c => {
    const name = c.name?.en || c.name?.hi || Object.values(c.name || {})[0] || "(no name)";
    console.log(`- ID: ${c._id.toString()} | Name: ${name} | ParentId: ${c.parentId} | Status: ${c.status} | Slug: ${c.slug}`);
  });

  // 2. Check product category references
  const products = await Product.find({ status: "show" }).lean();
  console.log("\n=== SHOWING PRODUCTS CATEGORY REFERENCES ===");
  const categoryIdsInProducts = new Set();
  const categoriesArrayIdsInProducts = new Set();
  products.forEach(p => {
    if (p.category) categoryIdsInProducts.add(p.category.toString());
    if (p.categories && p.categories.length > 0) {
      p.categories.forEach(cid => categoriesArrayIdsInProducts.add(cid.toString()));
    }
  });

  console.log("Total unique p.category IDs in showing products:", categoryIdsInProducts.size);
  console.log("Unique p.category IDs:", Array.from(categoryIdsInProducts));
  console.log("Total unique p.categories array IDs in showing products:", categoriesArrayIdsInProducts.size);
  console.log("Unique p.categories IDs:", Array.from(categoriesArrayIdsInProducts));

  // 3. See if we have parent/child mismatch
  const rootCategories = categoriesInDB.filter(c => !c.parentId);
  console.log("\n=== ROOT CATEGORIES (parentId is undefined/null) ===", rootCategories.length);
  rootCategories.forEach(c => {
    const name = c.name?.en || c.name?.hi || Object.values(c.name || {})[0] || "(no name)";
    console.log(`- Root Category: ${name} (ID: ${c._id.toString()})`);
  });

  const childCategories = categoriesInDB.filter(c => c.parentId);
  console.log("\n=== CHILD CATEGORIES (have parentId) ===", childCategories.length);
  childCategories.forEach(c => {
    const name = c.name?.en || c.name?.hi || Object.values(c.name || {})[0] || "(no name)";
    console.log(`- Child Category: ${name} (ID: ${c._id.toString()}) | ParentId: ${c.parentId}`);
  });

  process.exit();
};

audit();

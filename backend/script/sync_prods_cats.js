require("dotenv").config();
const { connectDB } = require("../config/db");
const Product = require("../models/Product");
const Category = require("../models/Category");

const syncProductsCategories = async () => {
  await connectDB();

  const products = await Product.find({ status: "show" });
  console.log("Processing", products.length, "showing products...");

  let updatedCount = 0;
  for (const product of products) {
    let mainCategory = product.category;
    let categoriesArray = product.categories || [];

    // If main category is missing, set it to the first category in the array
    if (!mainCategory && categoriesArray.length > 0) {
      mainCategory = categoriesArray[0];
      product.category = mainCategory;
    }

    // If category exists but is not in categories list, add it
    if (mainCategory && !categoriesArray.some(c => c.toString() === mainCategory.toString())) {
      categoriesArray.push(mainCategory);
      product.categories = categoriesArray;
    }

    if (product.isModified('category') || product.isModified('categories')) {
      await product.save();
      updatedCount++;
    }
  }

  console.log(`Sync complete. Updated ${updatedCount} products.`);
  process.exit();
};

syncProductsCategories();
